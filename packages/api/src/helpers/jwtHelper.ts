import { sign, verify } from 'hono/jwt'
import { APIContext, LoggedInUser } from '../@types'
import APIError from '../libs/APIError'

const signLoginTokenAsync = async (c: APIContext, user: LoggedInUser) => {
  const secret = c.env.JWT_LOGIN_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }

  return await signCoreAsync(secret, user.id, 60 * 24)
}

const signAPITokenAsync = async (c: APIContext, user: LoggedInUser) => {
  const secret = c.env.JWT_API_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }

  return await signCoreAsync(secret, user.id, 60)
}

const signCoreAsync = async (secret: string, userId: number, expiredMinutes: number) => {
  const payload = {
    uid: userId,
    exp: Math.floor(Date.now() / 1000) + 60 * expiredMinutes
  }

  const token = await sign(payload, secret)
  return token
}

const verifyLoginTokenAsync = async (c: APIContext, token: string) => {
  const secret = c.env.JWT_LOGIN_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }
  return await verifyCoreAsync(token, secret)
}

const verifyAPITokenAsync = async (c: APIContext, token: string) => {
  const secret = c.env.JWT_API_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }
  return await verifyCoreAsync(token, secret)
}

const verifyCoreAsync = async (token: string, secret: string) => {
  try {
    const payload = await verify(token, secret)
    if (!payload || !payload.uid) {
      return null
    }

    const userId = parseInt(payload.uid as string)
    const user: LoggedInUser = {
      id: userId
    }

    return user
  } catch (err: any) {
    if (err?.message.includes('expired')) {
      throw new APIError('unauthorized', 'unauthorized', 'Token expired')
    }
    throw err
  }}

export default {
  signLoginTokenAsync,
  signAPITokenAsync,
  verifyLoginTokenAsync,
  verifyAPITokenAsync
}
