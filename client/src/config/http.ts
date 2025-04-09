import { ErrorCode } from '@/config/constants/enum'
import { refreshToken } from '@/services/auth'
import { logout, refresh_token } from '@/stores/slices/user'
import { store } from '@/stores/store'
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, isAxiosError } from 'axios'
import toast from 'react-hot-toast'
class Http {
  axiosInstance: AxiosInstance
  constructor() {
    this.axiosInstance = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 1000,
      headers: { 'Content-Type': 'application/json' }
    })
    this.axiosInstance.interceptors.request.use(
      function (request) {
        const reduxStore = store.getState()
        const access_token = reduxStore.user.access_token
        if (access_token) {
          request.headers.Authorization = `${access_token}`
        }
        return request
      },
      function (error) {
        return Promise.reject(error)
      }
    )
    this.axiosInstance.interceptors.response.use(
      function (response: AxiosResponse) {
        return response.data
      },
      //HANDLE ERROR: Server Error (Axios ERROR),Network error, unknown error
      function (error: unknown) {
        //Server (axios) error
        if (isAxiosError(error)) {
          //Request send, Error returned from server
          if (error.response) {
            if (error.response.status === 401) {
              if (error.response.data.error === ErrorCode.TokenExpired) {
                if (error.config?.url === '/users/refresh-token') {
                  console.log('REFRESH TOKEN HẾT HẠN!')
                  store.dispatch(logout())
                  window.location.replace('/login')
                }
                const token = store.getState().user.refresh_token
                refreshToken({ refresh_token: token }).then((response) => {
                  store.dispatch(refresh_token(response.data))
                  console.log(response.data)
                })
              } else {
                toast.error(error.response.data.message)
              }
            }
            return Promise.reject(error.response.data)
          }
          //Network error:request send, but dont reach server
          if (error.request) {
            toast.error(error.message)
            return Promise.reject({ message: 'Lấy dữ liệu thất bại. Vui lòng thử lại!' })
          }
        }
        //Unexpected Error
        console.log(error)
        return Promise.reject({ message: 'Lỗi bất ngờ xảy ra' })
      }
    )
  }
  get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.get<T>(url, config)
  }

  post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config)
  }
  put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, data, config)
  }
  delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.axiosInstance.post<T>(url, config)
  }
}
const httpService = new Http().axiosInstance
export default httpService
