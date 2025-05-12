import { ErrorCode } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import mediaService from '@/services/medias.services'
import WrappedError from '@/utils/error'
import { handleUploadImage } from '@/utils/file'
import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'

//Single Image Upload
export const uploadImageController = async (req: Request, res: Response, next: NextFunction) => {
  const imageUrl = await mediaService.handleUploadImage(req, {})
  
  res.status(200).json({
    message: 'Image uploaded successfully',
    data: {
      imageUrl: imageUrl
    }
  })
}
