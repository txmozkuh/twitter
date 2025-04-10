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
    <div className='h-screen w-full'>
      <div className='sticky top-0 left-0 flex items-center justify-between px-2 py-4'>
        <span className='text-xl font-bold'>Profile</span>
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
      <Update isOpen={isOpen} handleOpenModal={handleOpenModal} />
    </div>
  )
}
