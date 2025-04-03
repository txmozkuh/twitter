import { requestResetPassword } from '@/services/auth'
import { ErrorData, SuccessWithoutData } from '@/types/api'
import { ForgetPasswordFormType, ForgetPasswordSchema } from '@/types/auth'
import { PATH } from '@/types/path'
import FormInput from '@components/ui/FormInput'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

export default function ForgetPassword() {
  const { mutate } = useMutation<SuccessWithoutData, AxiosError<ErrorData>, ForgetPasswordFormType>({
    mutationFn: (data) => requestResetPassword(data)
  })
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<ForgetPasswordFormType>({
    resolver: zodResolver(ForgetPasswordSchema)
  })

  const onSubmit: SubmitHandler<ForgetPasswordFormType> = async (data) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success(response.message)
      },
      onError: (error) => {
        console.error(error)
      }
    })
  }

  return (
    <div className='grid gap-2'>
      <h1 className='my-4 text-center text-3xl font-bold md:text-5xl'>Chúng tôi sẽ đưa bạn trở lại</h1>
      <form className='mt-6 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
        <FormInput<ForgetPasswordFormType>
          name='email'
          register={register}
          errorMessage={errors.email?.message}
          placeholder='Nhập email đã đăng ký của bạn'
        />
        <button className='mt-4 w-full cursor-pointer rounded-full bg-white py-2 font-semibold text-black'>
          Yêu cầu mật khẩu mới
        </button>
      </form>
      <div className='mt-8 space-x-1 text-center'>
        <span className='text-text-grey'>Đã có tài khoản?</span>
        <span className='text-blue-sky'>
          <Link to={PATH.LOGIN}>Đăng nhập</Link>
        </span>
      </div>
    </div>
  )
}
