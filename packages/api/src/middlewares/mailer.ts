import { Context, Next } from 'hono'
import nodemailer from 'nodemailer'
import { Bindings, Variables } from '../@types'

export type TransporterOptions = {
  host: string
  port: number
  user: string
  pass: string
}

const createTransport = (options: TransporterOptions) => {
  const transporter = nodemailer.createTransport({
    host: options.host,
    port: options.port,
    secure: true,
    auth: {
      user: options.user,
      pass: options.pass
    }
  })
  return transporter
}

const mailer = async (
  c: Context<{ Bindings: Bindings, Variables: Variables }>,
  next: Next
) => {
  if (!c.get('mailer')) {
    const mailer = createTransport({
      host: c.env.SMTP_HOST,
      port: c.env.SMTP_PORT,
      user: c.env.SMTP_USER,
      pass: c.env.SMTP_PASS
    })
    c.set('mailer', mailer)
  }

  await next()
}

export default mailer
