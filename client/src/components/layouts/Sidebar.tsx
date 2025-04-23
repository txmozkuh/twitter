import { Search } from 'lucide-react'

interface SideBarProps {
  className?: string
}

export default function SideBar({ className = '' }: SideBarProps) {
  return (
    <div className={`${className} space-y-4 px-4`}>
      <div className='sticky top-0 flex w-full justify-center bg-black/90 py-2'>
        <div className='border-border-grey flex w-full items-center gap-2 rounded-full border px-4 py-2'>
          <Search className='stroke-text-grey size-4' />
          <input type='text' className='text-sm' />
        </div>
      </div>
      <div className='border-border-grey h-50 rounded-2xl border'></div>
      <div className='border-border-grey h-70 rounded-2xl border'></div>
      <div className='border-border-grey h-40 rounded-2xl border'></div>
      <div className='border-border-grey h-200 rounded-2xl border'></div>
    </div>
  )
}
