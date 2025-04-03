import { resetPassword } from '@/services/auth'
import { ErrorData, SuccessWithoutData } from '@/types/api'
import { ResetPasswordFormType, ResetPasswordSchema } from '@/types/auth'
import { PATH } from '@/types/path'
import { ResetPasswordRequest } from '@/types/request'
import FormInput from '@components/ui/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useNavigate, useParams } from 'react-router-dom'

export default function ResetPassword() {
  const navigate = useNavigate()
  const { forgot_password_token } = useParams()
  const { mutate } = useMutation<SuccessWithoutData, AxiosError<ErrorData>, ResetPasswordRequest>({
    mutationFn: (data) => resetPassword(data)
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ResetPasswordFormType>({
    resolver: zodResolver(ResetPasswordSchema)
  })

  const onSubmit: SubmitHandler<ResetPasswordFormType> = async (data) => {
    if (!forgot_password_token) {
      toast.error('Truy cập không hợp lệ')
      navigate(PATH.LOGIN)
      return
    }
    mutate(
      { ...data, forgot_password_token },
      {
        onSuccess: (response) => {
          toast.success(response.message)
          setTimeout(() => navigate(PATH.LOGIN), 2000)
        },
        onError: (error) => {
          console.error(error.message)
        }
      }
    )
  }

  return (
    <div className='grid gap-2'>
      <h1 className='my-4 text-center text-3xl font-bold md:text-5xl'>Chào mừng bạn trở lại</h1>
      <form className='mt-6 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
        <FormInput<ResetPasswordFormType>
          type='password'
          name='new_password'
          register={register}
          errorMessage={errors.new_password?.message}
          placeholder='Nhập mật khẩu mới '
        />
        <FormInput<ResetPasswordFormType>
          type='password'
          name='confirm_new_password'
          register={register}
          errorMessage={errors.confirm_new_password?.message}
          placeholder='Xác nhận lại mật khẩu mới'
        />
        <button className='mt-4 w-full cursor-pointer rounded-full bg-white py-2 font-semibold text-black'>
          Tạo mật khẩu mới
        </button>
      </form>
    </div>
  )
}
