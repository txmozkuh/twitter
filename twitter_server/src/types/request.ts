export interface RegisterRequest {
  name: string
  email: string
  password: string
  date_of_birth: Date
}

export interface LoginRequest {
  email: string
  password: string
}
