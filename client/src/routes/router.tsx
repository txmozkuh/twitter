import MainLayout from '@/components/layouts/MainLayout'
import RegisterLayout from '@/components/layouts/RegisterLayout'
import { PATH } from '@/types/path'
import { lazy } from 'react'
import { Outlet, useRoutes } from 'react-router-dom'

const Login = lazy(() => import('@pages/Login'))
const Register = lazy(() => import('@pages/Register'))
const Profile = lazy(() => import('@pages/Profile'))

const RouterElement = () => {
  return useRoutes([
    {
      path: '/',
      element: (
        <MainLayout>
          <div>asdd</div>
        </MainLayout>
      )
    },
    {
      path: '/profile',
      element: (
        <MainLayout>
          <Profile />
        </MainLayout>
      )
    },
    {
      path: '/',
      element: (
        <RegisterLayout>
          <Outlet />
        </RegisterLayout>
      ),
      children: [
        {
          path: PATH.LOGIN,
          element: <Login />
        },
        {
          path: PATH.REGISTER,
          element: <Register />
        }
      ]
    }
  ])
}
export default RouterElement
