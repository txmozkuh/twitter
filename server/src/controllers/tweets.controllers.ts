import { HTTP_STATUS } from '@/constants/httpStatusCode'
import { SuccessWithoutData } from '@/types/response'
import { NextFunction, Request, Response } from 'express'

export const createTweetController = async (req: Request, res: Response<SuccessWithoutData>, next: NextFunction) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: 'Tạo tweet thành công'
  })
  return
}
