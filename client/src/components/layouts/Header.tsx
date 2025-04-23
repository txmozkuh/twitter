import { getProfile } from '@/services/user'
import Logo from '@assets/svgs/x_logo.svg'
import { useQuery } from '@tanstack/react-query'
import { Ellipsis } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { logout, update } from '@/stores/slices/user'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { PATH } from '@/types/path'
import { Popover, PopoverButton, PopoverPanel } from '@headlessui/react'
import { headerItems } from '@/config/constants/headerItems'

interface HeaderProps {
  className?: string
}

export default function Header({ className = '' }: HeaderProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const { data } = useQuery({
    queryKey: ['user', 'getProfile'],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 15 // cache for 15 min,
  })

  useEffect(() => {
    if (data) dispatch(update(data.data))
    // else {
    //   dispatch(logout())
    //   navigate(PATH.LOGIN)
    // }
  }, [data, dispatch])

  return (
    <div
      className={`sticky top-0 left-0 h-screen items-start justify-between py-6 md:p-4 ${className} flex flex-col overflow-hidden`}
    >
      <div className='flex flex-col items-center space-y-12 md:block'>
        <img src={Logo} alt='logo' className='mx-5 size-6 md:size-7' />
        <div className='space-y-2 text-xl'>
          {headerItems.map((item) => (
            <Link
              to={item.url}
              className={`${location.pathname === item.url ? 'bg-white/10 font-semibold' : ''} group flex items-end gap-4 rounded-full p-3 transition-all duration-100 hover:bg-white/10 md:px-5`}
            >
              <item.icon className='size-7 stroke-2' />
              <span className='hidden md:block'>{item.title}</span>
            </Link>
          ))}
        </div>
      </div>

      <Popover className='relative mx-auto'>
        <PopoverButton className='mx-auto flex w-full items-center justify-between gap-2 rounded-full p-2 text-sm hover:bg-white/10'>
          <div className='size-10 overflow-hidden rounded-full'>
            <img src={data?.data.avatar} alt='' />
          </div>
          <div className='hidden flex-col items-start md:flex'>
            <span className='font-bold text-white'>{data?.data.name}</span>
            <span className='text-text-grey'>@{data?.data.username}</span>
          </div>
          <Ellipsis className='ml-8 hidden md:block' />
        </PopoverButton>
        <PopoverPanel
          anchor={{ to: 'bottom', gap: 12 }}
          className='border-border-grey mx-4 flex min-w-[260px] flex-col rounded-2xl border bg-black/80 py-2 shadow-sm shadow-white/30'
        >
          <button
            className='flex items-center justify-between px-12 py-2 text-sm font-bold hover:bg-white/10'
            onClick={() => {
              dispatch(logout())
              navigate(PATH.LOGIN)
            }}
          >
            <span>Log out @{data?.data.username}</span>
          </button>
        </PopoverPanel>
      </Popover>
    </div>
  )
}
