import FormInput from '@components/ui/FormInput'
import { login } from '@/services/auth'
import { create } from '@/stores/slices/user'
import { LoginFormType, LoginSchema } from '@/types/auth'
import { PATH } from '@/types/path'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { SubmitHandler, useForm } from 'react-hook-form'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginFormType>({ resolver: zodResolver(LoginSchema) })

  const { mutate } = useMutation({ mutationFn: login })
  const onSubmit: SubmitHandler<LoginFormType> = (data) => {
    mutate(data, {
      onSuccess: (response) => {
        toast.success('Đăng nhập thành công!')
        dispatch(create(response.data))
        navigate('/')
      },
      onError: (error) => {
        console.log(error.message)
      }
    })
  }
  return (
    <div className='grid gap-2'>
      <h1 className='my-4 text-center text-3xl font-bold md:text-5xl'>Đăng nhập vào X</h1>
      <form className='mt-6 grid gap-4' onSubmit={handleSubmit(onSubmit)}>
        <FormInput<LoginFormType>
          name='email'
          register={register}
          errorMessage={errors.email?.message}
          placeholder='Tên đăng nhập, email người dùng'
        />
        <FormInput<LoginFormType>
          type='password'
          name='password'
          register={register}
          errorMessage={errors.password?.message}
          placeholder='Mật khẩu của bạn'
        />
        <button className='mt-4 w-full cursor-pointer rounded-full bg-white py-2 font-semibold text-black'>
          Đăng nhập
        </button>
        <button className='border-border-grey w-full cursor-pointer rounded-full border-1 py-2 font-semibold'>
          Quên mật khẩu
        </button>
      </form>
      <div className='mt-8 space-x-1 text-center'>
        <span className='text-text-grey'>Không có tài khoản?</span>
        <span className='text-blue-sky'>
          <Link to={PATH.REGISTER}>Đăng ký</Link>
        </span>
      </div>
    </div>
  )
}
