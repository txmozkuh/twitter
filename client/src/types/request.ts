export interface ResetPasswordRequest {
  new_password: string
  confirm_new_password: string
  forgot_password_token: string
}
