import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'

export default function Profile() {
  const user = useSelector((state: RootState) => state.user)
  console.log(user)

  return <div className='h-screen w-full'></div>
}
