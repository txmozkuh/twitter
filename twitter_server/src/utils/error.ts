class WrappedError extends Error {
  statusCode: number
  isCustomError: boolean

  constructor(statusCode: number, message: string) {
    super(message)
    this.statusCode = statusCode
    this.isCustomError = true
    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export default WrappedError
