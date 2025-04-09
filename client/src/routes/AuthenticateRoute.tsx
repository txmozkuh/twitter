import { RootState } from '@/stores/store'
import { PATH } from '@/types/path'
import { useSelector } from 'react-redux'
import { Navigate, Outlet } from 'react-router-dom'

export const AuthenticateRoute = () => {
  const accessToken = useSelector((state: RootState) => state.user.access_token)
  return accessToken ? <Outlet /> : <Navigate to={PATH.LOGIN} replace />
}
