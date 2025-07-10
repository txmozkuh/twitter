import ImagesLayout from '@/components/layouts/ImagesLayout'
import { truncateStr } from '@/utils/other'
import { Bookmark, ChartNoAxesColumn, Ellipsis, Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { Link } from 'react-router-dom'

interface TweetProps {
  id: string
  user_avatar: string
  username: string
  name: string
  content: string
  views: number
  images: Array<string>
}

export default function Tweet({ user_avatar, username, name, content, images, views, id }: TweetProps) {
  return (
    <Link to={`/tweet/${id}`} className='w-full'>
      <div className='border-border-grey flex w-full cursor-pointer gap-2 border-b px-4 pt-3 pb-1 hover:bg-white/5'>
        <div className='h-full'>
          <div className='size-10 overflow-hidden rounded-full'>
            <img src={user_avatar} alt='' />
          </div>
        </div>

        <div className='flex w-full flex-col gap-2 text-[15px]'>
          <div className='flex items-center gap-2'>
            <span className='cursor-pointer font-bold hover:underline'>{truncateStr(name)}</span>
            <span className='text-text-grey'>@{username}</span>
            <span className='hover:bg-blue-sky/20 group ml-auto rounded-full p-1.5'>
              <Ellipsis className='stroke-text-grey group group-hover:stroke-blue-sky size-5' />
            </span>
          </div>
          <div className='mb-2'>{content}</div>
          <ImagesLayout images={images} />

          <div className='flex items-center justify-between'>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='group-hover:bg-blue-sky/15 ml-auto rounded-full p-2'>
                <MessageCircle className='stroke-text-grey group group-hover:stroke-blue-sky size-[19px] stroke-2' />
              </span>
              <span className='group group-hover:text-blue-sky'></span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='ml-auto rounded-full p-2 group-hover:bg-green-300/10'>
                <Repeat2 className='stroke-text-grey group size-[19px] stroke-2 group-hover:stroke-green-300' />
              </span>
              <span className='group group-hover:text-green-300'></span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='ml-auto rounded-full p-2 group-hover:bg-pink-700/15'>
                <Heart className='stroke-text-grey group size-[19px] stroke-2 group-hover:stroke-pink-600' />
              </span>
              <span className='group group-hover:text-pink-600'></span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='group-hover:bg-blue-sky/15 ml-auto rounded-full p-2'>
                <ChartNoAxesColumn className='stroke-text-grey group group-hover:stroke-blue-sky size-[19px] stroke-2' />
              </span>
              <span className='group group-hover:text-blue-sky'>{views}</span>
            </div>

            <div className='text-text-grey flex items-center justify-center gap-3 text-sm'>
              <Bookmark className='stroke-text-grey size-[19px] stroke-2' />
              <Share className='stroke-text-grey size-[19px] stroke-2' />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
