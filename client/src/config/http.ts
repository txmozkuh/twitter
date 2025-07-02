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
      baseURL: 'http://18.141.143.78:3000',
      timeout: 5000
      // headers: { 'Content-Type': 'application/json' }
    })
    this.axiosInstance.interceptors.request.use(
      function (request) {
        if (request.data instanceof FormData) {
          delete request.headers['Content-Type'] // Let browser set boundary
        }
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
              if (error.response.data.error === ErrorCode.TokenError) {
                if (error.config?.url === '/users/refresh-token') {
                  console.log('Token lỗi!')
                  store.dispatch(logout())
                  window.location.replace('/login')
                }
                const token = store.getState().user.refresh_token
                refreshToken({ refresh_token: token }).then((response) => {
                  store.dispatch(refresh_token(response.data))
                })
              }
            }
            toast.error(error.response.data.message)
            return Promise.reject(error.response.data)
          }
          //Network error:request send, but dont reach server
          if (error.request) {
            toast.error('Lỗi kết nối:' + error.message)
            store.dispatch(logout())
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
