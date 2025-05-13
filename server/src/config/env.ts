import z from 'zod'
import dotenv from 'dotenv'
dotenv.config()

const envSchema = z.object({
  PORT: z.string(),
  MONGO_URI: z.string().url(),
  DB_NAME: z.string().min(1)
})

const parseEnv = envSchema.safeParse(process.env)

if (!parseEnv.success) {
  console.error('Invalid or missing enviroment variables: ', parseEnv.error.format())
  process.exit(1)
}

export const env = parseEnv.data
