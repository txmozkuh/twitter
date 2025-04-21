import { handleUploadImage } from '@/utils/file'
import { Request } from 'express'
import sharp from 'sharp'
import fs from 'fs'
import cloudinary from '@/utils/cloudinary'

class MediaService {
  async handleUploadImage(req: Request, folder: string) {
    const image = await handleUploadImage(req)
    const iamgeName = image.newFilename.split('.')[0]
    await sharp(image.filepath).jpeg({ mozjpeg: true }).toFile(`uploads/${iamgeName}.jpg`)
    fs.unlink(image.filepath, (err) => {
      console.error(err)
    })
    try {
      const result = await cloudinary.uploader.upload(`uploads/${iamgeName}.jpg`, {
        folder,
        transformation: { width: 200, height: 200 }
      })
      return result.secure_url
    } catch (error) {
      console.error(error)
    }
  }
}

const mediaService = new MediaService()
export default mediaService
