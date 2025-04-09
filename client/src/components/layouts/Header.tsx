import { getProfile } from '@/services/user'
import Logo from '@assets/svgs/x_logo.svg'
import { useQuery } from '@tanstack/react-query'
import { Home, LogOut, UserRound } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { logout } from '@/stores/slices/user'
import { useDispatch } from 'react-redux'
interface HeaderProps {
  className?: string
}
export default function Header({ className = '' }: HeaderProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { data, refetch } = useQuery({
    queryKey: ['user', 'getProfile'],
    queryFn: getProfile,
    retry: false,
    staleTime: 1000 * 60 * 15 // cache for 15 min
  })
  const handleGetProfile = () => {
    refetch()
    console.log(data?.data)
  }
  return (
    <div
      className={`sticky top-0 h-screen items-center py-4 md:p-4 ${className} flex flex-col justify-between overflow-hidden`}
    >
      <div className='flex flex-col items-center space-y-12 md:block'>
        <img src={Logo} alt='logo' className='mx-5 size-6 md:size-8' />
        <div className='space-y-2 text-xl'>
          <Link
            to={'/'}
            className='group flex items-center gap-6 rounded-full p-3 transition-all duration-300 hover:bg-white/10 md:px-5'
          >
            <Home className='size-7 stroke-3' />
            <span className='hidden md:block'>Home</span>
          </Link>
          <Link
            to={'/profile'}
            className='group flex items-center gap-6 rounded-full p-3 transition-all duration-300 hover:bg-white/10 md:px-5'
          >
            <UserRound className='size-7' />
            <span className='hidden md:block'>Profile</span>
          </Link>
        </div>
      </div>
      <button onClick={handleGetProfile} className='ring-border-grey rounded-full px-4 py-1 ring hover:bg-white/10'>
        Get Profile
      </button>
      <button
        className='flex gap-2 rounded-full bg-red-700 px-5 py-2 text-white transition hover:bg-red-600'
        onClick={() => {
          dispatch(logout())
          navigate('/login')
        }}
      >
        <LogOut />
        <span>Logout</span>
      </button>
    </div>
  )
}
