import ImageContainer from '@/components/layouts/ImageContainer'
import { ReactNode } from 'react'

interface ImagesLayoutProps {
  images: string[]
}

export default function ImagesLayout({ images }: ImagesLayoutProps) {
  const size = images.length
  let items_grid: ReactNode
  switch (size) {
    case 1:
      items_grid = (
        <div className='border-border-grey size-full max-h-[510px] w-3/4 overflow-hidden rounded-xl border'>
          <ImageContainer src={images[0]} alt={images[0]} className='size-full' />
        </div>
      )
      break
    case 2:
      items_grid = (
        <div className='border-border-grey flex size-full h-[290px] gap-[2px] overflow-hidden rounded-xl border'>
          <ImageContainer src={images[0]} alt={images[0]} className='w-1/2' />
          <ImageContainer src={images[1]} alt={images[1]} className='w-1/2' />
        </div>
      )
      break
    case 3:
      items_grid = (
        <div className='border-border-grey flex size-full h-[300px] gap-[2px] overflow-hidden rounded-xl border'>
          <ImageContainer src={images[0]} alt={images[0]} className='h-full w-1/2' />
          <div className='flex w-1/2 flex-col gap-[2px]'>
            <ImageContainer src={images[1]} alt={images[1]} className='h-1/2' />
            <ImageContainer src={images[2]} alt={images[2]} className='h-1/2' />
          </div>
        </div>
      )
      break
    case 4:
      items_grid = (
        <div className='border-border-grey flex size-full h-[500px] flex-wrap overflow-hidden rounded-xl border'>
          <ImageContainer src={images[0]} alt={images[0]} className='size-1/2' />
          <ImageContainer src={images[1]} alt={images[1]} className='size-1/2' />
          <ImageContainer src={images[2]} alt={images[2]} className='size-1/2' />
          <ImageContainer src={images[3]} alt={images[3]} className='size-1/2' />
        </div>
      )
      break
    default:
      if (size > 4) {
        items_grid = (
          <div className='border-border-grey flex size-full h-[500px] flex-wrap overflow-hidden rounded-xl border'>
            <ImageContainer src={images[0]} alt={images[0]} className='size-1/2' />
            <ImageContainer src={images[1]} alt={images[1]} className='size-1/2' />
            <ImageContainer src={images[2]} alt={images[2]} className='size-1/2' />
            <div className='relative size-1/2'>
              <ImageContainer src={images[3]} alt={images[3]} />
              <div className='absolute top-0 left-0 z-10 flex size-full items-center justify-center bg-black/60 text-4xl text-white/80'>
                {size - 3}+
              </div>
            </div>
          </div>
        )
      }
  }
  return items_grid
}
