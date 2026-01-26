import crypto from 'crypto'
import bcrypt from 'bcryptjs'
import { Hono } from 'hono'
import { setCookie, getCookie } from 'hono/cookie'
import { validator } from 'hono/validator'
import jwtHelper from '../helpers/jwtHelper'
import APIError from '../libs/APIError'
import { createAccountSchema } from '../schemas/accounts'
import tokenService from '../services/tokenService'
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

  const passwordResetToken = user.requirePasswordChange
    ? await tokenService.createTokenAsync(c, user.id, 'PasswordReset')
    : null

  return c.json({
    passwordResetToken,
    token: apiToken,
    user: {
      name: user.name
    }
  })
})

accountsRouter.get('/accounts/authorize-url', async (c) => {
  const clientId = c.env.OIDC_CLIENT_ID
  const redirectUri = c.env.OIDC_CALLBACK_URI
  
  const requestId = crypto.randomUUID()
  const codeVerifier = crypto.randomBytes(32).toString('base64url')
  const nonce = crypto.randomBytes(32).toString('base64url')
  
  const state = await jwtHelper.signStateTokenAsync(c, requestId, codeVerifier)

  // nonce をハッシュ化してクッキーに保存
  const hashedNonce = crypto.createHash('sha256').update(nonce).digest('base64url')
  setCookie(c, `oidc_nonce_${requestId}`, hashedNonce, {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 60 * 10
  })
  
  const codeChallenge = crypto.createHash('sha256').update(codeVerifier).digest('base64url')
  
  const url = 'https://idapi.nectarition.jp/oidc/authorize'
    + '?response_type=code'
    + `&client_id=${encodeURIComponent(clientId)}`
    + `&redirect_uri=${encodeURIComponent(redirectUri)}`
    + '&scope=openid%20profile%20email'
    + `&state=${encodeURIComponent(state)}`
    + `&nonce=${encodeURIComponent(nonce)}`
    + '&code_challenge_method=S256'
    + `&code_challenge=${encodeURIComponent(codeChallenge)}`
  return c.json({ url })
})

accountsRouter.post('/accounts/oidc-callback', async (c) => {
  const { code, state } = await c.req.json()
  
  // state JWT をデコードして requestId と codeVerifier を取得
  const statePayload = await jwtHelper.verifyStateTokenAsync(c, state)
  if (!statePayload) {
    throw new APIError('invalid-operation', 'invalid-state', 'Invalid state token')
  }

  const { requestId, codeVerifier } = statePayload

  // requestId に対応する nonce クッキーを取得
  const hashedNonce = getCookie(c, `oidc_nonce_${requestId}`)
  if (!hashedNonce) {
    throw new APIError('invalid-operation', 'nonce-not-found', 'Nonce not found or expired')
  }

  // nonce クッキーを削除
  setCookie(c, `oidc_nonce_${requestId}`, '', {
    httpOnly: true,
    secure: true,
    sameSite: 'None',
    maxAge: 0
  })

  const clientId = c.env.OIDC_CLIENT_ID
  const clientSecret = c.env.OIDC_CLIENT_SECRET
  const redirectUri = c.env.OIDC_CALLBACK_URI

  const tokenResponse = await fetch('https://idapi.nectarition.jp/oidc/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
      client_id: clientId,
      client_secret: clientSecret,
      code_verifier: codeVerifier
    })
  })

  if (!tokenResponse.ok) {
    throw new APIError('invalid-operation', 'token-request-failed', 'Token request failed')
  }

  const tokenData = await tokenResponse.json() as {
    id_token: string
  }
  
  const idToken = tokenData.id_token

  const idTokenParts = idToken.split('.')
  if (idTokenParts.length !== 3) {
    throw new APIError('invalid-operation', 'invalid-id-token', 'Invalid ID token')
  }

  const payloadBase64 = idTokenParts[1]
  const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8')
  const payload = JSON.parse(payloadJson) as {
    sub: string
    email: string
    name: string
    nonce: string
  }

  const oidcSub = payload.sub
  if (!oidcSub) {
    throw new APIError('invalid-operation', 'sub-not-found', 'Sub not found in ID token')
  }

  const email = payload.email
  if (!email) {
    throw new APIError('invalid-operation', 'email-not-found', 'Email not found in ID token')
  }

  // nonce を検証
  const receivedNonceHash = crypto.createHash('sha256').update(payload.nonce).digest('base64url')
  if (receivedNonceHash !== hashedNonce) {
    throw new APIError('invalid-operation', 'invalid-nonce', 'Invalid nonce')
  }

  const prisma = c.get('prisma')
  let user = await prisma.user.findFirst({
    where: {
      OR: [
        {
          oidcSub: {
            equals: oidcSub
          }
        },
        {
          email: {
            equals: email
          }
        }
      ]
    }
  })

  if (!user) {
    user = await prisma.user.create({
      data: { email, name: payload.name || email.split('@')[0], password: '', oidcSub }
    })
  } else if (user.email === email && user.oidcSub !== oidcSub) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { oidcSub }
    })
  }

  const loginToken = await jwtHelper.signLoginTokenAsync(c, { id: user.id })

  return c.json({
    token: loginToken
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

  const token = await tokenService.createTokenAsync(c, user.id, 'PasswordReset')

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
    data: {
      password: passwordHash,
      requirePasswordChange: false
    }
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
