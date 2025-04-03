import { RegisterFormType, RegisterFormType1, RegisterFormType2, RegisterSchema1, RegisterSchema2 } from '@/types/auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { PATH } from '@/types/path'
import FormInput from '@components/ui/FormInput'
import { register } from '@/services/auth'
import toast from 'react-hot-toast'
import { useMutation } from '@tanstack/react-query'
import { ErrorData, SuccessData } from '@/types/api'
import { RegisterResponse } from '@/types/response'
import { AxiosError } from 'axios'

export default function Register() {
  const navigate = useNavigate()
  const [step, setStep] = useState<number>(1)
  const [dataFirstStep, setDataFirstStep] = useState<RegisterFormType1>()
  const formStep1 = useForm<RegisterFormType1>({
    resolver: zodResolver(RegisterSchema1)
  })

  const formStep2 = useForm<RegisterFormType2>({
    resolver: zodResolver(RegisterSchema2)
  })

  const { mutate } = useMutation<SuccessData<RegisterResponse>, AxiosError<ErrorData>, RegisterFormType>({
    mutationFn: (data) => register(data)
  })

  const onNextStep: SubmitHandler<RegisterFormType1> = async (data) => {
    const result = await formStep1.trigger()
    if (result) {
      setStep(2)
      setDataFirstStep(data)
    }
  }
  const onSubmit: SubmitHandler<RegisterFormType2> = async (data) => {
    const registerData: RegisterFormType = { ...dataFirstStep!, ...data }
    mutate(registerData, {
      onSuccess: (response) => {
        toast.success(response.message)
        navigate(PATH.LOGIN)
      }
    })
  }
  return (
    <div className='grid gap-2'>
      <h1 className='my-4 text-center text-3xl font-bold md:text-5xl'>
        {step === 1 ? 'Chào mừng bạn' : 'Bước cuối của bạn'}
      </h1>
      {step === 1 && (
        <form className='grid gap-4' onSubmit={formStep1.handleSubmit(onNextStep)}>
          <FormInput<RegisterFormType1>
            register={formStep1.register}
            name='email'
            value={formStep1.watch('email')}
            errorMessage={formStep1.formState.errors.email?.message}
            placeholder='Email người dùng,tên người dùng'
          />
          <FormInput<RegisterFormType1>
            register={formStep1.register}
            type='password'
            name='password'
            value={formStep1.watch('password')}
            errorMessage={formStep1.formState.errors.password?.message}
            placeholder='Mật khẩu người dùng'
          />
          <FormInput<RegisterFormType1>
            register={formStep1.register}
            type='password'
            name='confirm_password'
            value={formStep1.watch('confirm_password')}
            errorMessage={formStep1.formState.errors.confirm_password?.message}
            placeholder='Nhập lại mật khẩu'
          />

          <button className='w-full cursor-pointer rounded-full bg-white py-2 font-semibold text-black'>
            Tiếp tục
          </button>
        </form>
      )}
      {step === 2 && (
        <form onSubmit={formStep2.handleSubmit(onSubmit)}>
          <FormInput<RegisterFormType2>
            register={formStep2.register}
            type='text'
            name='name'
            value={formStep2.watch('name')}
            errorMessage={formStep2.formState.errors.name?.message}
            placeholder='Tên tài khoản của bạn'
          />
          <FormInput<RegisterFormType2>
            register={formStep2.register}
            className='appearance-auto text-black dark:brightness-100 dark:invert'
            type='date'
            name='date_of_birth'
            value={formStep2.watch('date_of_birth')}
            errorMessage={formStep2.formState.errors.date_of_birth?.message}
            placeholder='Ngày, tháng, năm sinh'
          />

          <button className='w-full cursor-pointer rounded-full bg-white py-2 font-semibold text-black'>Đăng ký</button>
          <button
            onClick={() => setStep(1)}
            className='border-border-grey my-2 w-full cursor-pointer rounded-full border bg-black py-2 font-semibold text-white'
          >
            Quay lại
          </button>
        </form>
      )}

      <div className='mt-8 space-x-1 text-center'>
        <span className='text-text-grey'>Đã có tài khoản?</span>
        <span className='text-blue-sky'>
          <Link to={PATH.LOGIN}>Đăng nhập</Link>
        </span>
      </div>
    </div>
  )
}
