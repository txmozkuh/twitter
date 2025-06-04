import z from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  CLIENT_URL: z.string(),
  MONGO_URI: z.string().url(),
  DB_NAME: z.string().min(1),
  USERS_COLLECTION: z.string().min(1),
  REFRESH_TOKENS_COLLECTION: z.string().min(1),
  TWEETS_COLLECTION: z.string().min(1),
  FOLLOWERS_COLLECTION: z.string().min(1),
  BOOKMARKS_COLLECTION: z.string().min(1),
  LIKES_COLLECTION: z.string().min(1),
  HASHTAGS_COLLECTION: z.string().min(1),
  CONVERSATIONS_COLLECTION: z.string().min(1),
  //
  JWT_PRIVATE_KEY: z.string().min(1),
  ACCESS_TOKEN_EXPIRE_TIME: z.string().min(1),
  REFRESH_TOKEN_EXPIRE_TIME: z.string().min(1),
  //
  CLOUDINARY_CLOUD_NAME: z.string().min(1),
  CLOUDINARY_API_KEY: z.string().min(1),
  CLOUDINARY_API_SECRET: z.string().min(1),
  //
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  //
  AWS_ACCESS_KEY_ID: z.string().min(1),
  AWS_SECRET_ACCESS_KEY: z.string().min(1),
  AWS_REGION: z.string().min(1),
  SES_FROM_ADDRESS: z.string().min(1)
  //
})

const parseEnv = envSchema.safeParse(process.env)

if (!parseEnv.success) {
  console.error('Invalid or missing enviroment variables: ', parseEnv.error.format())
  process.exit(1)
}

export const env = parseEnv.data
