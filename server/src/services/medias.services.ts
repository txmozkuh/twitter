import { handleUploadImage, parseVideo } from '@/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import fs from 'fs'
import cloudinary from '@/utils/cloudinary'
import { UploadApiOptions } from 'cloudinary'
import { error } from 'console'
import { result } from 'lodash'

class MediaService {
  async handleUploadImage(req: Request, uploadOptions: UploadApiOptions) {
    const image = await handleUploadImage(req)
    const iamgeName = image.newFilename.split('.')[0]
    await sharp(image.filepath).avif().toFile(`uploads/${iamgeName}.avif`)
    fs.unlink(image.filepath, (err) => {
      console.error(err)
    })
    try {
      const result = await cloudinary.uploader.upload(`uploads/${iamgeName}.avif`, uploadOptions)
      return result.secure_url
    } catch (error) {
      console.error(error)
    }
  }

  async handleDeleteImage(publicId: string) {
    try {
      const result = await cloudinary.uploader.destroy(publicId)
      return result
    } catch (error) {
      console.error(error)
    }
  }

  async handleUploadVideo(req: Request, uploadOptions: UploadApiOptions) {
    const videoFile = await parseVideo(req)
    const result = await cloudinary.uploader.upload(videoFile.filepath, {
      resource_type: 'video',
      folder: 'test',
      chunk_size: 50 * 1024 * 1024
    })
    return result.url
  }
}

const mediaService = new MediaService()
export default mediaService
