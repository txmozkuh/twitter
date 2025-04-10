import { z } from 'zod'

export const UpdateFormSchema = z
  .object({
    name: z.string().optional(),
    username: z
      .string()
      .min(1, 'Tên người dùng không được để trống')
      .regex(
        /^[a-zA-Z0-9_]+$/,
        'Tên người dùng không được chứa khoảng trắng hoặc ký tự đặc biệt (chỉ chữ, số và gạch dưới)'
      )
      .optional(),
    bio: z.string().optional(),
    location: z.string().optional(),
    website: z.string().optional(),
    date_of_birth: z
      .string()
      .refine((value) => {
        const date = new Date(value)
        const today = new Date()
        return date < today
      }, 'Ngày sinh vượt quá ngày hiện tại')
      .transform((value) => new Date(value).toISOString())
  })
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    message: 'Phải có ít nhất một trường cập nhật'
  })

export type UpdateFormType = z.infer<typeof UpdateFormSchema>
