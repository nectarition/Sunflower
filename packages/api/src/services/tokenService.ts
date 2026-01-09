import { APIContext } from '../@types'
import { $Enums } from '../generated/prisma'
import generateRandomString from '../libs/generateRandomString'

const createTokenAsync = async (c: APIContext, userId: number, tokenType: $Enums.MailTokenTypes) => {
  const prisma = c.get('prisma')
  
  const token = generateRandomString(48)
  const expiredAt = new Date(Date.now() + 10 * 60 * 1000)

  await prisma.mailToken.create({
    data: {
      userId: userId,
      type: tokenType,
      token,
      expiredAt
    }
  })

  return token
}

export default {
  createTokenAsync
}
