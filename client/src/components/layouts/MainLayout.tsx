import { JSX } from 'react'

interface MainLayoutProps {
  children: JSX.Element
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <div className='w-full h-full bg-gray-500'>{children}</div>
}
