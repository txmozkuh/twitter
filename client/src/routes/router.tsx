import MainLayout from '@/components/layouts/MainLayout'
import RegisterLayout from '@/components/layouts/RegisterLayout'
import Bookmark from '@/pages/Bookmark'
import Explore from '@/pages/Explore'
import Home from '@/pages/Home'
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
      element: (
        <MainLayout>
          <AuthenticateRoute />
        </MainLayout>
      ),
      children: [
        {
          path: PATH.HOME,
          element: <Home />
        },
        {
          path: PATH.PROFILE,
          element: <Profile />
        },
        {
          path: PATH.EXPLORE,
          element: <Explore />
        },
        {
          path: PATH.BOOKMARK,
          element: <Bookmark />
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
