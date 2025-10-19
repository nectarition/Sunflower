import { APIContext } from '../@types'
import APIError from '../libs/APIError'
import generateRandomString from '../libs/generateRandomString'
import type { SuccessResult, User } from 'soleil'

const verifyEmailByIdAsync = async (
  c: APIContext,
  user: User
): Promise<SuccessResult> => {
  if (user.emailVerified) {
    throw new APIError('invalid-operation', 'email-already-verified', 'Email address is already verified')
  }

  const token = generateRandomString(48)
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000)

  const prisma = c.get('prisma')
  const mailer = c.get('mailer')

  await prisma.mailToken.create({
    data: {
      userId: user.id,
      type: 'EmailVerify',
      token,
      expiredAt
    }
  })
  
  await mailer.sendMail({
    from: '"鳩の会 CHECK-IN" <no-reply@seidouren.jp>',
    to: user.email,
    subject: 'メールアドレス確認',
    text: `以下のリンクをクリックしてメールアドレスを確認してください。\n\n${c.env.USER_APP_URL}/action?mode=verify&token=${token}`
  })

  return { success: true }
}

export default {
  verifyEmailByIdAsync
}
