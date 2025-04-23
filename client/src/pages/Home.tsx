import TweetEditor from '@/components/ui/TweetEditor'
import { RootState } from '@/stores/store'
import { useSelector } from 'react-redux'

export default function Home() {
  const user = useSelector((state: RootState) => state.user)

  return (
    <div className='w-full'>
      <div className='text-text-grey border-border-grey sticky top-0 left-0 z-100 flex w-full items-center border-b bg-black/95'>
        <button className='flex-1 py-4 hover:bg-white/10'>
          <span className="before:bg-blue-sky relative h-full py-4 before:absolute before:bottom-0 before:left-0 before:h-1 before:w-full before:translate-y-[25%] before:rounded-full before:content-['']">
            For you
          </span>
        </button>
        <button className='flex-1 py-4 hover:bg-white/10'>
          <span>Following</span>
        </button>
      </div>
      <div className='border-border-grey flex gap-4 border-b px-4 pt-4'>
        <div className='size-10 overflow-hidden rounded-full'>
          <img src={user.avatar} alt='' />
        </div>
        <TweetEditor />
      </div>
    </div>
  )
}
