import ImagesLayout from '@/components/layouts/ImagesLayout'
import CommentEditor from '@/components/ui/CommentEditor'
import { getTweetDetail } from '@/services/tweet'
import { useQuery } from '@tanstack/react-query'

import { ArrowLeft, Bookmark, Ellipsis, Heart, MessageCircle, Repeat2, Share } from 'lucide-react'
import { useParams } from 'react-router-dom'
// import { useParams } from 'react-router-dom'

export default function TweetDetail() {
  const { id } = useParams()
  const { data: postDetail } = useQuery({
    queryKey: ['post', 'detail'],
    queryFn: () => getTweetDetail(id!)
  })
  return (
    <div className='w-full'>
      <div className='sticky top-0 left-0 flex items-center bg-black p-4'>
        <span className='rounded-full p-2.5 hover:bg-white/10'>
          <ArrowLeft size={20} />
        </span>
        <span className='ml-9 text-xl font-bold'>Post</span>
      </div>
      <div className='border-border-grey flex w-full cursor-pointer gap-2 border-b px-4 pt-3 pb-1 hover:bg-white/5'>
        <div className='flex w-full flex-col gap-2 text-[15px]'>
          <div className='flex items-start gap-2'>
            <div className='size-10 overflow-hidden rounded-full'>
              <img src={postDetail?.data.tweet[0].user.avatar} alt='' />
            </div>
            <div className='flex flex-col'>
              <span className='cursor-pointer font-bold hover:underline'>{postDetail?.data.tweet[0].user.name}</span>
              <span className='text-text-grey'>@{postDetail?.data.tweet[0].user.username}</span>
            </div>
            <span className='hover:bg-blue-sky/20 group ml-auto rounded-full p-1.5'>
              <Ellipsis className='stroke-text-grey group group-hover:stroke-blue-sky size-5' />
            </span>
          </div>
          <div className='mb-2'>{postDetail?.data.tweet[0].content}</div>
          <ImagesLayout images={postDetail?.data.tweet[0].medias || []} />

          <div className='text-text-grey flex gap-2 text-[15px]'>
            <span>12:03 AM · May 2, 2025</span>
            <span className='flex items-start gap-1'>
              <span className='text-[14px] font-semibold text-white'>{postDetail?.data.tweet[0].views}</span>
              Views
            </span>
          </div>

          <div className='border-border-grey flex items-center justify-between border-y py-1'>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='group-hover:bg-blue-sky/15 ml-auto rounded-full p-2'>
                <MessageCircle className='stroke-text-grey group group-hover:stroke-blue-sky size-[22.5px] stroke-2' />
              </span>
              <span className='group group-hover:text-blue-sky'>{postDetail?.data.comment?.length || 0}</span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='ml-auto rounded-full p-2 group-hover:bg-green-300/10'>
                <Repeat2 className='stroke-text-grey group size-[22.5px] stroke-2 group-hover:stroke-green-300' />
              </span>
              <span className='group group-hover:text-green-300'></span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='ml-auto rounded-full p-2 group-hover:bg-pink-700/15'>
                <Heart className='stroke-text-grey group size-[22.5px] stroke-2 group-hover:stroke-pink-600' />
              </span>
              <span className='group group-hover:text-pink-600'>{postDetail?.data.tweet[0].like_amount}</span>
            </div>
            <div className='text-text-grey group flex items-center justify-center text-sm'>
              <span className='group-hover:bg-blue-sky/15 ml-auto rounded-full p-2'>
                <Bookmark className='stroke-text-grey group-hover:stroke-blue-sky size-[22.5px] stroke-2' />
              </span>
              <span className='group group-hover:text-blue-sky'>{postDetail?.data.tweet[0].bookmark_amount}</span>
            </div>
            <div className='text-text-grey group flex items-center justify-center gap-3 text-sm'>
              <span className='group-hover:bg-blue-sky/15 ml-auto rounded-full p-2'>
                <Share className='stroke-text-grey group-hover:stroke-blue-sky size-[22.5px] stroke-2' />
              </span>
            </div>
          </div>
          <div className='flex gap-4 py-2'>
            <div className='h-full'>
              <div className='size-10 overflow-hidden rounded-full'>
                <img src={postDetail?.data.tweet[0].user.avatar} alt='' />
              </div>
            </div>
            <CommentEditor />
          </div>
        </div>
      </div>
    </div>
  )
}
