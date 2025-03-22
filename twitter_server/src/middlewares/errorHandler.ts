import WrappedError from '@/utils/error'
import { Request, Response } from 'express'

export const errorHandler = (error: WrappedError, req: Request, res: Response) => {
  console.log('🚨 Error Approached: ', error.message)
  res.status(error.statusCode || 500).json({
    sucess: 'false',
    message: error.message || 'Internal server error'
  })
}
