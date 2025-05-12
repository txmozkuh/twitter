interface ImageContainerProps {
  src: string
  alt: string
  className?: string
  imgClassName?: string
}

export default function ImageContainer({ src, alt, className, imgClassName }: ImageContainerProps) {
  return (
    <div className={className}>
      <img src={src} alt={alt} className={`${imgClassName} size-full object-cover object-center`} />
    </div>
  )
}
