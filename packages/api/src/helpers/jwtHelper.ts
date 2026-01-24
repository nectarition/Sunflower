import { sign, verify } from 'hono/jwt'
import { EncryptJWT, jwtDecrypt } from 'jose'
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
  }
}

const signStateTokenAsync = async (c: APIContext, codeVerifier: string) => {
  const secret = c.env.JWT_STATE_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }

  const payload = {
    codeVerifier,
    exp: Math.floor(Date.now() / 1000) + 60 * 10 // 10 minutes
  }

  const key = new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32))
  const jwe = await new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setExpirationTime('10m')
    .encrypt(key)
  
  return jwe
}

const verifyStateTokenAsync = async (c: APIContext, token: string) => {
  const secret = c.env.JWT_STATE_TOKEN_SECRET
  if (!secret) {
    throw new Error('JWT secret not configured')
  }

  try {
    const key = new TextEncoder().encode(secret.padEnd(32, '0').slice(0, 32))
    const decryptResult = await jwtDecrypt<{ codeVerifier: string }>(token, key)
    
    if (!decryptResult.payload.codeVerifier) {
      return null
    }
    return decryptResult.payload.codeVerifier as string
  } catch (err: any) {
    if (err?.code === 'ERR_JWT_EXPIRED') {
      throw new APIError('invalid-operation', 'state-expired', 'State expired')
    }
    throw new APIError('invalid-operation', 'invalid-state', 'Invalid state token')
  }
}

export default {
  signLoginTokenAsync,
  signAPITokenAsync,
  verifyLoginTokenAsync,
  verifyAPITokenAsync,
  signStateTokenAsync,
  verifyStateTokenAsync
}
