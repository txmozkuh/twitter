import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'

import { CalendarDays, Pen } from 'lucide-react'
import { useState } from 'react'
import Update from '@/pages/Update'

export default function Profile() {
  const user = useSelector((state: RootState) => state.user)
  const [isOpen, setIsOpen] = useState(false)

  const handleOpenModal = (value: boolean) => {
    setIsOpen(value)
  }
  return (
    <div className='w-full'>
      <div className='sticky top-0 left-0 z-10 flex items-center justify-between bg-black/95 px-4 py-4'>
        <span className='text-xl font-bold'>Profile</span>
      </div>

      <div className='h-[250px] overflow-hidden opacity-65'>
        <img src={user.cover_photo} alt='wallpaper' className='w-full object-cover object-center' />
      </div>

      <div className='relative mx-auto w-[90%] -translate-y-[75px] space-y-4'>
        <div className='flex justify-between'>
          <div className='aspect-square w-[150px] overflow-hidden rounded-full bg-black p-1'>
            <img src={user.avatar} alt='avatar' className='rounded-full' />
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
      <div className='h-screen w-full'>Img</div>
      <div className='h-screen w-full'>Img</div>
      <div className='h-screen w-full'>Img</div>
      <div className='h-screen w-full'>Img</div>
      <div className='h-screen w-full'>Img</div>

      <Update isOpen={isOpen} handleOpenModal={handleOpenModal} />
    </div>
  )
}
