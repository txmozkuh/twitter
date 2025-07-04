export interface RegisterResponse {
  name: string
  email: string
  date_of_birth: Date
}

export interface LoginResponse {
  _id: string
  name: string
  email: string
  date_of_birth: string
  avatar: string | undefined
  cover_photo: string | undefined
  bio: string
  location: string
  username: string
  website: string
  access_token: string
  refresh_token: string
}

export interface RefreshTokenResponse {
  refresh_token: string
  access_token: string
}
export interface UpdateProfileResponse {
  name?: string
  email?: string
  date_of_birth?: string
  avatar?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  cover_photo?: string
}

export interface GetProfileResponse {
  _id?: string
  name?: string
  email?: string
  date_of_birth?: string
  bio?: string
  location?: string
  website?: string
  username?: string
  avatar?: string
  cover_photo?: string
}

export interface ChatListResponse {
  latestMessage: {
    content: string
    timestamp: string
  }
  user_info: {
    _id: string
    name: string
    username: string
    avatar: string
  }
}
