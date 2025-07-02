export interface ResetPasswordRequest {
  new_password: string
  confirm_new_password: string
  forgot_password_token: string
}

export interface MessageRequest {
  from: string
  to: string
  content: string
  timestamp: string
}
