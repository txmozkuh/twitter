import { Request, Response } from 'express'
import User from '@/models/schemas/user.schema'
import userService from '@/services/users.services'
import { hashPassword } from '@/utils/crypto'
import { ApiResponse, RegisterRequest } from '@/types/auth.types'

export const loginController = (req: Request, res: Response) => {
  const { email, password } = req.body
  if (email === 'daeve.ph@gmail.com' && password === '123456') {
    res.status(200).json({ message: 'Login success' })
    return
  }
  res.status(401).json({ message: 'Login failed' })
  return
}

export const registerController = async (
  req: Request<RegisterRequest>,
  res: Response<
    ApiResponse<{ name: string; email: string; date_of_birth: Date; access_token: string; refresh_token: string }>
  >
) => {
  const { name, email, password, date_of_birth } = req.body
  const hashedPassword = hashPassword(password)
  const user = new User({ name, email, password: hashedPassword, date_of_birth })

  try {
    const { access_token, refresh_token } = await userService.register(user as RegisterRequest)
    res.status(200).json({
      message: 'Đăng ký người dùng thành công',
      data: {
        name,
        email,
        date_of_birth,
        access_token,
        refresh_token
      }
    })
  } catch (error) {
    res.status(400).json({
      message: 'Đăng ký người dùng thất bại',
      error: error instanceof Error ? error.message : (error as string)
    })
    return
  }
  return
}
