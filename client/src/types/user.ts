import { z } from 'zod'

export const UpdateFormSchema = z.object({
  name: z.string(),
  bio: z.string(),
  location: z.string(),
  website: z.string(),
  date_of_birth: z
    .string()
    .refine((value) => {
      const date = new Date(value)
      const today = new Date()
      return date < today
    }, 'Ngày sinh vượt quá ngày hiện tại')
    .transform((value) => new Date(value).toISOString())
})

export type UpdateFormType = z.infer<typeof UpdateFormSchema>
