import { JSX } from 'react'
import logo from '@assets/svgs/x_logo.svg'

interface RegisterLayoutProps {
  children: JSX.Element
}

export default function RegisterLayout({ children }: RegisterLayoutProps) {
  return (
    <div className='w-full p-12 md:grid md:grid-cols-2'>
      <div className='flex items-center justify-center'>
        <img src={logo} alt='x' className='h-28 text-white md:h-64 lg:h-80' />
      </div>
      <div className='my-auto lg:w-2/3'>{children}</div>
    </div>
  )
}
