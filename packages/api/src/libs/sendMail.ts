import SMTPTransport from 'nodemailer/lib/smtp-transport'
import type nodemailer from 'nodemailer'

const sendMailAsync = async (
  mailer: nodemailer.Transporter<SMTPTransport.SentMessageInfo, SMTPTransport.Options>
) => {
}

export default sendMailAsync
