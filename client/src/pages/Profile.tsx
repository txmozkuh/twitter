import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'
import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import { useEffect, useState } from 'react'
import FormInput from '@/components/ui/FormInput'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateFormSchema, UpdateFormType } from '@/types/user'
import { CalendarDays, CircleX, Pen } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { updateProfile } from '@/services/user'
import { ErrorData, SuccessData } from '@/types/api'
import { UpdateFrofileResponse } from '@/types/response'
import { AxiosError } from 'axios'

export default function Profile() {
  const [isOpen, setIsOpen] = useState(false)
  const user = useSelector((state: RootState) => state.user)

  const { mutate } = useMutation<SuccessData<UpdateFrofileResponse>, AxiosError<ErrorData>, UpdateFormType>({
    mutationFn: (data) => updateProfile(data)
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateFormType>({ resolver: zodResolver(UpdateFormSchema) })

  useEffect(() => {
    if (user) {
      const defaultValues = {
        name: user.name,
        bio: user.bio,
        location: user.location,
        website: user.website,
        date_of_birth: user.date_of_birth
      }
      reset(defaultValues)
    }
  }, [user, reset])

  const onSubmit: SubmitHandler<UpdateFormType> = async (data) => {
    mutate(data, {
      onSuccess: (res) => {
        console.log(res)
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }

  return (
    <div className='h-screen w-full'>
      <div className='sticky top-0 left-0 flex items-center justify-between px-2 py-4'>
        <span className='text-xl font-bold'>Profile</span>
        <button className='rounded-full bg-white px-4 py-1 font-semibold text-black'>Edit</button>
      </div>

      <div className='h-[250px] overflow-hidden opacity-65'>
        <img
          src='https://images.unsplash.com/photo-1743653537429-a94889a6fd47?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
          alt='wallpaper'
          className='w-full object-cover object-center'
        />
      </div>

      <div className='relative mx-auto w-[90%] -translate-y-[75px] space-y-4'>
        <div className='flex justify-between'>
          <div className='aspect-square w-[150px] overflow-hidden rounded-full bg-black p-1'>
            <img
              src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
              alt='avatar'
              className='rounded-full'
            />
          </div>
          <button
            className='ring-border-grey mt-24 flex size-fit items-center gap-2 rounded-full px-4 py-1 font-semibold ring hover:cursor-pointer hover:ring-white'
            onClick={() => setIsOpen(true)}
          >
            Edit profile
            <Pen size={16} />
          </button>
        </div>
        <div className='text-xl font-bold'>{user.name}</div>
        <div className='text-text-grey flex items-center gap-2 text-sm'>
          <CalendarDays size={16} />
          <span>Joined November 2025</span>
        </div>
        <div className='text-text-grey flex items-center gap-4 text-sm'>
          <div className='space-x-1'>
            <span className='font-bold text-white'>328</span>
            <span>Following</span>
          </div>
          <div className='space-x-1'>
            <span className='font-bold text-white'>65</span>
            <span>Followers</span>
          </div>
        </div>
      </div>

      <Dialog open={isOpen} onClose={() => setIsOpen(false)} className='relative z-50'>
        <DialogBackdrop className='fixed inset-0 bg-white/20' />
        <div className='fixed inset-0 flex w-screen items-center justify-center'>
          <DialogPanel className='ring-border-grey relative mx-8 max-h-[700px] max-w-[600px] overflow-scroll overflow-x-hidden rounded-lg bg-black pb-2 ring md:mx-0'>
            <div className='bg-transparent-black sticky top-0 left-0 z-50 flex items-center justify-between px-4 py-3'>
              <span className='text-xl font-bold'>Edit profile</span>
              <CircleX onClick={() => setIsOpen(false)} className='hover:scale-110' />
            </div>
            <div className='relative pb-18'>
              <div className='h-[200px] overflow-hidden opacity-65'>
                <img
                  src='https://images.unsplash.com/photo-1743653537429-a94889a6fd47?q=80&w=3544&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  alt='wallpaper'
                  className='w-full object-cover object-center'
                />
              </div>
              <div className='absolute aspect-square w-[120px] translate-x-[25%] -translate-y-[50%] transform overflow-hidden rounded-full bg-black p-1'>
                <img
                  src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                  alt='avatar'
                  className='rounded-full'
                />
              </div>
            </div>
            <form className='flex flex-col px-4 py-2' onSubmit={handleSubmit(onSubmit)}>
              <FormInput<UpdateFormType>
                register={register}
                name='name'
                placeholder='Name'
                errorMessage={errors.name?.message}
              />
              <FormInput<UpdateFormType>
                register={register}
                name='bio'
                placeholder='Bio'
                errorMessage={errors.bio?.message}
              />
              <FormInput<UpdateFormType>
                register={register}
                name='location'
                placeholder='Location'
                errorMessage={errors.location?.message}
              />
              <FormInput<UpdateFormType>
                register={register}
                name='website'
                placeholder='Website'
                errorMessage={errors.website?.message}
              />
              <FormInput<UpdateFormType>
                register={register}
                name='date_of_birth'
                type='date'
                placeholder='Birthday'
                errorMessage={errors.date_of_birth?.message}
              />
              <button className='ml-auto rounded-full bg-white px-6 py-1 text-black'>Save</button>
            </form>
          </DialogPanel>
        </div>
      </Dialog>
    </div>
  )
}
