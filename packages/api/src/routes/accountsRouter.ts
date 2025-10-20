import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { validator } from 'hono/validator'
import jwtHelper from '../helpers/jwtHelper'
import APIError from '../libs/APIError'
import generateRandomString from '../libs/generateRandomString'
import { createAccountSchema } from '../schemas/accounts'
import type { Bindings, Variables } from '../@types'

const accountsRouter = new Hono<{ Bindings: Bindings, Variables: Variables }>()

accountsRouter.post(
  '/accounts',
  validator(
    'json',
    (value) => {
      const schema = createAccountSchema.safeParse(value)
      if (!schema.success) {
        throw new APIError('invalid-operation', 'invalid-input', 'Invalid input')
      } 
      return schema.data
    }),
  async (c) => {
    const { email, name, password } = await c.req.json()
    const prisma = c.get('prisma')

    const passwordHash = await bcrypt.hash(password, 10)

    const existingUser = await prisma.user.findUnique({
      where: { email }
    })
    if (existingUser) {
      throw new APIError('invalid-operation', 'user-exists', 'User already exists')
    }

    await prisma.user.create({
      data: { email, name, password: passwordHash }
    })

    return c.json({ success: true })
  })

accountsRouter.post('/accounts/authenticate', async (c) => {
  const { email, password } = await c.req.json()
  const prisma = c.get('prisma')

  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user) {
    throw new APIError('invalid-operation', 'invalid-user', 'Invalid user')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    throw new APIError('invalid-operation', 'invalid-user', 'Invalid user')
  }

  const token = await jwtHelper.signLoginTokenAsync(c, { id: user.id })

  return c.json({
    token
  })
})

accountsRouter.post('/accounts/login', async (c) => {
  const { token } = await c.req.json()
  const prisma = c.get('prisma')
  const payload = await jwtHelper.verifyLoginTokenAsync(c, token)
  if (!payload) {
    throw new APIError('invalid-operation', 'invalid-token', 'Invalid token')
  }

  const user = await prisma.user.findUnique({
    where: { id: payload.id }
  })
  if (!user) {
    throw new APIError('invalid-operation', 'user-not-found', 'User not found')
  }

  const apiToken = await jwtHelper.signAPITokenAsync(c, { id: user.id })
  return c.json({
    token: apiToken,
    user: {
      name: user.name
    }
  })
})

accountsRouter.post('/accounts/send-password-reset-email', async (c) => {
  const { email } = await c.req.json()
  const prisma = c.get('prisma')
  const user = await prisma.user.findUnique({
    where: { email }
  })
  if (!user || !user.emailVerified) {
    return c.json({ success: true })
  }

  const token = generateRandomString(48)
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.mailToken.create({
    data: {
      userId: user.id,
      type: 'PasswordReset',
      token,
      expiredAt
    }
  })

  const mailer = c.get('mailer')
  await mailer.sendMail({
    from: '"鳩の会 CHECK-IN" <no-reply@seidouren.jp>',
    to: user.email,
    subject: 'パスワードリセット',
    text: `以下のリンクをクリックしてパスワードをリセットしてください。\n\n${c.env.USER_APP_URL}/action?mode=reset&token=${token}`
  })

  return c.json({ success: true })
})

accountsRouter.post('/accounts/reset-password', async (c) => {
  const { token, password } = await c.req.json()
  const prisma = c.get('prisma')
  const mailToken = await prisma.mailToken.findUnique({
    where: { token }
  })
  if (!mailToken || mailToken.type !== 'PasswordReset') {
    throw new APIError('invalid-operation', 'invalid-token', 'Invalid token')
  }

  const user = await prisma.user.findUnique({
    where: { id: mailToken.userId }
  })
  if (!user) {
    throw new Error('User not found')
  }

  const passwordHash = await bcrypt.hash(password, 10)

  await prisma.user.update({
    where: { id: user.id },
    data: { password: passwordHash }
  })

  await prisma.mailToken.delete({
    where: { id: mailToken.id }
  })

  return c.json({ success: true })
})

accountsRouter.post('/accounts/verify-email', async (c) => {
  const { token } = await c.req.json()

  const prisma = c.get('prisma')
  const mailToken = await prisma.mailToken.findUnique({
    where: { token }
  })
  if (!mailToken || mailToken.type !== 'EmailVerify') {
    throw new APIError('invalid-operation', 'invalid-token', 'Invalid token')
  }

  const user = await prisma.user.findUnique({
    where: { id: mailToken.userId }
  })
  if (!user) {
    throw new Error('User not found')
  }

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: true }
  })

  await prisma.mailToken.delete({
    where: { id: mailToken.id }
  })

  return c.json({ success: true })
})

export default accountsRouter
