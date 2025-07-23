import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'
import mjml2html from 'mjml'
import fs from 'fs'
import path from 'path'
import { env } from '@/config/env'

type SendEmailCommandParams = {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  url: string
  user: string
  subject: string
  replyToAddresses?: string | string[]
}

interface TemplateData {
  name: string
  link: string
}

// const template = await render(<EmailTemplate url='...' />)

const sesClient = new SESClient({
  region: process.env.AWS_REGION,
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || ''
  }
})

const createSendEmailCommand = ({
  fromAddress,
  toAddresses,
  ccAddresses = [],
  user,
  url,
  subject,
  replyToAddresses = []
}: SendEmailCommandParams) => {
  return new SendEmailCommand({
    Destination: {
      /* required */
      CcAddresses: ccAddresses instanceof Array ? ccAddresses : [ccAddresses],
      ToAddresses: toAddresses instanceof Array ? toAddresses : [toAddresses]
    },
    Message: {
      Subject: {
        Charset: 'UTF-8',
        Data: subject
      } /* required */,
      Body: {
        /* required */
        Html: {
          Charset: 'UTF-8',
          Data: `Hello <b>${user}</b>,<br/> <a href='${url}'>Click here</a> to verify your email <br/> Thank you for joined us!  `
        }
      }
    },
    Source: fromAddress,
    ReplyToAddresses: replyToAddresses instanceof Array ? replyToAddresses : [replyToAddresses]
  })
}

function renderMJML(templatePath: string, data: TemplateData): string {
  const raw = fs.readFileSync(templatePath, 'utf8')

  const filled = raw.replace(/{{(\w+)}}/g, (_, key) => {
    return data[key as keyof TemplateData] || ''
  })

  const { html } = mjml2html(filled)
  return html
}

export const sendVerifyEmail = async (toAddress: string[] | string, subject: string, user: string, url: string) => {
  const sendEmailCommand = createSendEmailCommand({
    fromAddress: process.env.SES_FROM_ADDRESS!,
    toAddresses: toAddress,
    user,
    url,
    subject
  })
  try {
    return await sesClient.send(sendEmailCommand)
  } catch (e) {
    console.error('Failed to send email.', e)
    return e
  }
}

export const sendReclaimPasswordEmail = async (toAddress: string, name: string, reclaim_url: string) => {
  const htmlContent = renderMJML(path.join(__dirname, '../config/email/reclaim_password_template.mjml'), {
    name,
    link: reclaim_url
  })

  const sendEmailCommand = new SendEmailCommand({
    Source: env.SES_FROM_ADDRESS,
    Destination: {
      ToAddresses: [toAddress]
    },
    Message: {
      Subject: { Data: 'Reclaim your password with X' },
      Body: {
        Html: { Data: htmlContent }
      }
    }
  })
  await sesClient.send(sendEmailCommand)
}
