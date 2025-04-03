import { z } from 'zod'

export const LoginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z
    .string()
    .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
      'Mật khẩu phải chứa chữ thường, chữ hoa, số và ký tự đặc biệt'
    )
})

export const RegisterSchema1 = z
  .object({
    email: z.string().email('Email không hợp lệ'),
    password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
        'Mật khẩu phải chứa chữ thường, chữ hoa, số và ký tự đặc biệt'
      ),
    confirm_password: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.password !== data.confirm_password) {
      ctx.addIssue({
        path: ['confirm_password'],
        code: 'custom',
        message: 'Nhập lại mật khẩu không khớp'
      })
    }
  })

export const RegisterSchema2 = z.object({
  name: z.string().min(6, 'Tên cần có ít nhất 6 ký tự'),
  date_of_birth: z
    .string()
    .refine((value) => {
      const date = new Date(value)
      const today = new Date()
      return date < today
    }, 'Ngày sinh vượt quá ngày hiện tại')
    .transform((value) => new Date(value).toISOString())
})

export const ForgetPasswordSchema = z.object({
  email: z.string().nonempty('Vui lòng nhập email').email('Email không đúng định dạng')
})
export const ResetPasswordSchema = z
  .object({
    new_password: z
      .string()
      .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`]).+$/,
        'Mật khẩu phải chứa chữ thường, chữ hoa, số và ký tự đặc biệt'
      ),
    confirm_new_password: z.string()
  })
  .superRefine((data, ctx) => {
    if (data.new_password !== data.confirm_new_password) {
      ctx.addIssue({
        path: ['confirm_new_password'],
        code: 'custom',
        message: 'Nhập lại mật khẩu không khớp'
      })
    }
  })

export type LoginFormType = z.infer<typeof LoginSchema>
export type RegisterFormType1 = z.infer<typeof RegisterSchema1>
export type RegisterFormType2 = z.infer<typeof RegisterSchema2>

export type RegisterFormType = RegisterFormType1 & RegisterFormType2

export type ForgetPasswordFormType = z.infer<typeof ForgetPasswordSchema>

export type ResetPasswordFormType = z.infer<typeof ResetPasswordSchema>
