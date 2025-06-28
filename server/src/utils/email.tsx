import { SendEmailCommand, SESClient } from '@aws-sdk/client-ses'

type SendEmailCommandParams = {
  fromAddress: string
  toAddresses: string | string[]
  ccAddresses?: string | string[]
  url: string
  user: string
  subject: string
  replyToAddresses?: string | string[]
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
