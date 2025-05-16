import { HTTP_STATUS } from '@/constants/httpStatusCode'
import { ErrorData } from '@/types/response'
import WrappedError from '@/utils/error'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (error: WrappedError, req: Request, res: Response<ErrorData>, next: NextFunction) => {
  console.log('---------------------------- \n')
  console.log('ERROR APPROACH: ', error)
  console.log('----------------------------')

  res.status(error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message || 'Lỗi server!',
    statusCode: error.statusCode,
    error: error.errorCode || error.name || 'Có lỗi bất ngờ xảy ra',
    timestamp: new Date().toISOString()
  })
}
