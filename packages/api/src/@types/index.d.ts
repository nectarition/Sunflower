import { Context } from 'hono'
import type { PrismaClient } from '../generated/prisma'
import '../../worker-configuration'

type Variables = {
  prisma: PrismaClient
  user: LoggedInUser
}

export type APIEnv = { Bindings: Env, Variables: Variables }
export type APIContext = Context<APIEnv>

export type ErrorType = 'not-found'
  | 'invalid-operation'
  | 'invalid-argument'
  | 'unauthorized'
  | 'forbidden'
  | 'out-of-term'

export type RequestError = {
  code: number
  message?: string
}

export type LoggedInUser = {
  id: number;
}
