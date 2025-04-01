import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface User {
  name: string
  email: string
  access_token: string
  refresh_token: string
  cover_photo: string
  date_of_birth: string
}

const initialState: User = {
  name: '',
  email: '',
  access_token: '',
  refresh_token: '',
  cover_photo: '',
  date_of_birth: ''
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
