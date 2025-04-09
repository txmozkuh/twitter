import Header from '@components/layouts/Header'
import SideBar from '@/components/layouts/Sidebar'
import { JSX } from 'react'

interface MainLayoutProps {
  children: JSX.Element
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className='divide-border-grey flex h-screen w-full divide-x'>
      <Header className='w-[15%] md:w-[20%]' />
      <div className='w-full bg-black md:w-[50%]'>{children}</div>
      <SideBar className='hidden md:block md:w-[30%]' />
    </div>
  )
}
