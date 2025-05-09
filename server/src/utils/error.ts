import { ErrorCode } from '@/constants/enums'

class WrappedError extends Error {
  statusCode: number
  isCustomError: boolean
  errorCode?: ErrorCode

  constructor(statusCode: number, message: string, errorCode?: ErrorCode) {
    super(message)
    this.statusCode = statusCode
    this.isCustomError = true
    this.errorCode = errorCode || ErrorCode.NormalError
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default WrappedError
