import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { GetProfileResponse, LoginResponse } from '@/types/response'
interface User {
  _id: string
  name: string
  email: string
  date_of_birth: string
  avatar: string | undefined
  bio: string | undefined
  location: string | undefined
  website: string | undefined
  username: string | undefined
  cover_photo: string | undefined
  access_token: string
  refresh_token: string
}

const initialState: User = {
  _id: '',
  name: '',
  email: '',
  date_of_birth: new Date().toISOString(),
  avatar: '',
  bio: '',
  location: '',
  website: '',
  username: '',
  cover_photo: '',
  access_token: '',
  refresh_token: ''
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<LoginResponse>) => {
      console.log(state)
      return { ...action.payload }
    },
    update: (state, action: PayloadAction<GetProfileResponse>) => {
      return { ...state, ...action.payload }
    },
    refresh_token: (state, action: PayloadAction<{ refresh_token: string; access_token: string }>) => {
      state.access_token = `Bearer ${action.payload.access_token}`
      state.refresh_token = `Bearer ${action.payload.refresh_token}`
    },

    logout: () => {
      return { ...initialState }
    }
  }
})

export const { create, update, logout, refresh_token } = userSlice.actions
export default userSlice.reducer
