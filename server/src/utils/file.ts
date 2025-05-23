import { Request } from 'express'
import fs from 'fs'
import formidable, { File, errors as formidableErrors } from 'formidable'
import path from 'path'
import WrappedError from '@/utils/error'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import { error } from 'console'
import { reject } from 'lodash'

export const initFolder = () => {
  if (!fs.existsSync(path.resolve('uploads'))) {
    fs.mkdirSync('uploads', { recursive: true })
  }
}

export const getPublicId = (url: string) => {
  const result = url.substring(0, url.lastIndexOf('.')).split('/')
  return `${result[result.length - 2]}/${result[result.length - 1]}`
}

export const handleUploadImage = async (req: Request) => {
  const form = formidable({
    // uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 1000 * 1024, // 300kb,
    filter: ({ name, originalFilename, mimetype }) => {
      const filter = !!name && !!originalFilename && !!mimetype && mimetype.startsWith('image/')
      if (!filter) {
        form.emit('error' as any, new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Sai định dạng file ảnh') as any)
      }
      return filter
    }
  })
  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) reject(err)
      if (!files.image) {
        return reject(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Không tìm thấy file'))
      }

      resolve((files.image as File[])[0])
    })
  })
}

export const parseVideo = async (req: Request) => {
  const form = formidable({
    // uploadDir: path.resolve('uploads'),
    maxFiles: 1,
    keepExtensions: true,
    maxFileSize: 100 * 1024 * 1024, // 100mb,
    filter: ({ name, originalFilename, mimetype }) => {
      const isVideo = !!name && !!originalFilename && !!mimetype && mimetype.startsWith('video/')
      if (!isVideo) {
        form.emit('error' as any, new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Sai định dạng file video') as any)
      }
      return isVideo
    }
  })

  return new Promise<File>((resolve, reject) => {
    form.parse(req, (err, fields, files) => {
      if (err) {
        if (err.code === 1009 || err.message.includes('maxTotalFileSize')) {
          return reject(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Vượt quá kích thước file tối đa 100MB'))
        }
        reject(err)
      }
      if (!files.video) {
        return reject(new WrappedError(HTTP_STATUS.BAD_REQUEST, 'Không tìm thấy file'))
      }
      resolve((files.video as File[])[0])
    })
  })
}
