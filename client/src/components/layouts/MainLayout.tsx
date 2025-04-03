import { JSX } from 'react'

interface MainLayoutProps {
  children: JSX.Element
}

export default function MainLayout({ children }: MainLayoutProps) {
  return <div className='h-screen w-full'>{children}</div>
}
