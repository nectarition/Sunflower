import { Context } from 'hono'
import type { PrismaClient } from '../generated/prisma'

type Bindings = {
  DB: D1Database
  JWT_LOGIN_TOKEN_SECRET: string
  JWT_API_TOKEN_SECRET: string
  JWT_PASSWORD_RESET_TOKEN_SECRET: string
  SMTP_HOST: string
  SMTP_PORT: number
  SMTP_USER: string
  SMTP_PASS: string,
  USER_APP_URL: string
}

type Variables = {
  prisma: PrismaClient
  user: LoggedInUser
  mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
}

export type APIContext = Context<{ Bindings: Bindings, Variables: Variables }>

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
