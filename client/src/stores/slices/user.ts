import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  user_id: string
  name: string
  email: string
  date_of_birth: Date
  avatar: string | undefined
  cover_photo: string | undefined
  access_token: string
  refresh_token: string
}

const initialState: User = {
  user_id: '',
  name: '',
  email: '',
  date_of_birth: new Date(),
  avatar: '',
  cover_photo: '',
  access_token: '',
  refresh_token: ''
}
const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    create: (state, action: PayloadAction<User>) => {
      return { ...action.payload }
    }
  }
})

export const { create } = userSlice.actions
export default userSlice.reducer
