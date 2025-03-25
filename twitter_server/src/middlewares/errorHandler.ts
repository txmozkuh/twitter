import { ErrorResponse } from '@/types/auth.types'
import WrappedError from '@/utils/error'
import { NextFunction, Request, Response } from 'express'

export const errorHandler = (error: WrappedError, req: Request, res: Response<ErrorResponse>, next: NextFunction) => {
  console.log('🚨 Error Approached: ', error.message)
  res.status(error.statusCode || 500).json({
    success: false,
    message: error.message || 'Internal server error'
  })
}
