import { Dialog, DialogBackdrop, DialogPanel } from '@headlessui/react'
import FormInput from '@/components/ui/FormInput'
import { CircleX, ImagePlus, LoaderCircle, X } from 'lucide-react'
import { useEffect, useRef } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { UpdateFormSchema, UpdateFormType } from '@/types/user'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteCoverPhoto, updateAvatar, updateCoverPhoto, updateProfile } from '@/services/user'
import { ErrorData, SuccessData, SuccessWithoutData } from '@/types/api'
import { UpdateProfileResponse } from '@/types/response'
import { AxiosError } from 'axios'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/store'
import toast from 'react-hot-toast'

interface UpdateModalProps {
  handleOpenModal: (value: boolean) => void
  isOpen: boolean
}

export default function Update({ isOpen, handleOpenModal }: UpdateModalProps) {
  const user = useSelector((state: RootState) => state.user)
  const queryClient = useQueryClient()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<UpdateFormType>({ resolver: zodResolver(UpdateFormSchema) })

  const { mutate } = useMutation<SuccessData<UpdateProfileResponse>, AxiosError<ErrorData>, UpdateFormType>({
    mutationFn: (data) => updateProfile(data)
  })
  const updateCoverPhotoMutation = useMutation<SuccessData<{ url: string }>, AxiosError<ErrorData>, FormData>({
    mutationFn: (data) => updateCoverPhoto(data)
  })
  const updateAvatarMutation = useMutation<SuccessData<{ url: string }>, AxiosError<ErrorData>, FormData>({
    mutationFn: (data) => updateAvatar(data)
  })

  const deleteCoverPhotoMutation = useMutation<SuccessWithoutData, AxiosError<ErrorData>>({
    mutationFn: deleteCoverPhoto
  })

  const coverInputRef = useRef<HTMLInputElement>(null)
  const avatarIputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (user) {
      const defaultValues = {
        name: user.name,
        username: user.username,
        bio: user.bio,
        location: user.location,
        website: user.website,
        date_of_birth: user.date_of_birth.split('T')[0],
        avatar: user.avatar,
        cover_photo: user.cover_photo
      }
      reset(defaultValues)
    }
  }, [user, reset])

  const onSubmit: SubmitHandler<UpdateFormType> = async (data) => {
    const filterData = Object.fromEntries(Object.entries(data).filter(([, value]) => value !== '')) as UpdateFormType
    mutate(filterData, {
      onSuccess: (res) => {
        toast.success(res.message)
        queryClient.invalidateQueries({ queryKey: ['user', 'getProfile'] })
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }

  const handleChangeCoverPhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
    if (!e.target.files) {
      return
    }
    const form = new FormData()

    form.append('image', e.target.files[0])
    console.log(form.get('image'))
    updateCoverPhotoMutation.mutate(form, {
      onSuccess: (res) => {
        toast.success(res.message)
        queryClient.invalidateQueries({ queryKey: ['user', 'getProfile'] })
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }

  const handleChangeAvatar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log(e.target.files)
    if (!e.target.files) {
      return
    }
    const form = new FormData()

    form.append('image', e.target.files[0])
    console.log(form.get('image'))
    updateAvatarMutation.mutate(form, {
      onSuccess: (res) => {
        toast.success(res.message)
        queryClient.invalidateQueries({ queryKey: ['user', 'getProfile'] })
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }

  const handleDeleteCoverPhoto = async () => {
    deleteCoverPhotoMutation.mutate(undefined, {
      onSuccess: (res) => {
        toast.success(res.message)
        queryClient.invalidateQueries({ queryKey: ['user', 'getProfile'] })
      },
      onError: (err) => {
        console.error(err)
      }
    })
  }

  return (
    <Dialog open={isOpen} onClose={() => handleOpenModal(false)} className='relative z-50'>
      <DialogBackdrop className='fixed inset-0 bg-white/20' />
      <div className='fixed inset-0 flex w-screen items-center justify-center'>
        <DialogPanel className='ring-border-grey relative mx-8 max-h-[700px] w-[600px] overflow-scroll overflow-x-hidden rounded-lg bg-black pb-2 ring md:mx-0'>
          <div className='bg-transparent-black sticky top-0 left-0 z-50 flex items-center justify-between px-4 py-3'>
            <span className='text-xl font-bold'>Edit profile</span>
            <CircleX aria-label='close' onClick={() => handleOpenModal(false)} className='hover:scale-110' />
          </div>
          <div className='relative pb-18'>
            <div className='relative h-[200px] overflow-hidden'>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={coverInputRef}
                onChange={handleChangeCoverPhoto}
              />
              <img src={user.cover_photo} alt='cover-photo' className='w-full object-cover object-center' />
              <div className='absolute top-[50%] left-[50%] grid size-full -translate-x-[50%] -translate-y-[50%] place-items-center bg-black/70'>
                <div className='flex gap-6'>
                  <button
                    className='size-fit cursor-pointer rounded-full bg-white/5 p-3 hover:bg-white/10'
                    onClick={() => coverInputRef.current?.click()}
                    disabled={updateCoverPhotoMutation.isPending}
                  >
                    {updateCoverPhotoMutation.isPending ? <LoaderCircle className='animate-spin' /> : <ImagePlus />}
                  </button>
                  <button
                    className='size-fit cursor-pointer rounded-full bg-white/5 p-3 hover:bg-white/10'
                    onClick={handleDeleteCoverPhoto}
                  >
                    {deleteCoverPhotoMutation.isPending ? <LoaderCircle className='animate-spin' /> : <X />}
                  </button>
                </div>
              </div>
            </div>
            <div className='absolute aspect-square w-[120px] translate-x-[25%] -translate-y-[50%] transform overflow-hidden rounded-full bg-black p-1'>
              <input
                type='file'
                accept='image/*'
                className='hidden'
                ref={avatarIputRef}
                onChange={handleChangeAvatar}
              />

              <img src={user.avatar} alt='avatar' className='rounded-full' />
              <div className='absolute top-0 left-0 grid size-full place-items-center bg-black/70'>
                <button
                  className='size-fit cursor-pointer rounded-full p-3 hover:bg-white/5'
                  onClick={() => avatarIputRef.current?.click()}
                  disabled={updateAvatarMutation.isPending}
                >
                  {updateAvatarMutation.isPending ? (
                    <LoaderCircle className='size-5 animate-spin' />
                  ) : (
                    <ImagePlus className='size-5' />
                  )}
                </button>
              </div>
            </div>
          </div>
          <form className='flex flex-col px-4 py-2' onSubmit={handleSubmit(onSubmit)}>
            <FormInput<UpdateFormType>
              register={register}
              name='username'
              placeholder='Username'
              errorMessage={errors.username?.message}
            />
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
  )
}
