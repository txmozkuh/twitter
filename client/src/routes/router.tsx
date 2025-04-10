import MainLayout from '@/components/layouts/MainLayout'
import RegisterLayout from '@/components/layouts/RegisterLayout'
import { AuthenticateRoute } from '@/routes/AuthenticateRoute'
import { PATH } from '@/types/path'
import { lazy } from 'react'
import { Outlet, useRoutes } from 'react-router-dom'

const Login = lazy(() => import('@pages/Login'))
const Register = lazy(() => import('@pages/Register'))
const Profile = lazy(() => import('@pages/Profile'))
const ForgetPassword = lazy(() => import('@pages/ForgetPassword'))
const ResetPassword = lazy(() => import('@pages/ResetPassword'))

const RouterElement = () => {
  return useRoutes([
    {
      path: '/',
      element: <AuthenticateRoute />,
      children: [
        {
          path: PATH.HOME,
          element: (
            <MainLayout>
              <>Home</>
            </MainLayout>
          )
        },
        {
          path: PATH.PROFILE,
          element: (
            <MainLayout>
              <Profile />
            </MainLayout>
          )
        }
      ]
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
        },
        {
          path: PATH.FORGOR_PASSWORD,
          element: <ForgetPassword />
        },
        {
          path: PATH.RESET_PASSWORD,
          element: <ResetPassword />
        }
      ]
    }
  ])
}
export default RouterElement
