import { configureStore } from '@reduxjs/toolkit'
import userReducer from './slices/user'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

const persistConfig = {
  key: 'user',
  storage
}

const userPersistReducer = persistReducer(persistConfig, userReducer)

export const store = configureStore({
  reducer: {
    user: userPersistReducer
  }
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export type AppStore = typeof store
