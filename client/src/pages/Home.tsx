import Tweet from '@/components/ui/Tweet'
import TweetEditor from '@/components/ui/TweetEditor'
import { getNewfeed } from '@/services/tweet'
import { RootState } from '@/stores/store'
import { useQuery } from '@tanstack/react-query'
import { useSelector } from 'react-redux'

export default function Home() {
  const user = useSelector((state: RootState) => state.user)
  const { data: postData } = useQuery({
    queryKey: ['tweet_homepage'],
    queryFn: () => getNewfeed()
  })
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
      {postData?.data.length === 0 ? (
        <div className='text-text-grey border-border-grey w-full border-b py-4 text-center'>
          Kết nối với mọi người để X của bạn thú vị hơn
        </div>
      ) : (
        postData?.data.map((post, index) => (
          <Tweet
            id={post._id}
            key={index}
            user_avatar={post.user.avatar}
            name={post.user.name}
            username={post.user.username}
            content={post.content}
            views={post.views}
            images={post.medias}
          />
        ))
      )}
    </div>
  )
}
