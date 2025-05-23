import { ErrorCode } from '@/constants/enums'
import { HTTP_STATUS } from '@/constants/httpStatusCode'
import mediaService from '@/services/medias.services'
import { SuccessData } from '@/types/response'
import WrappedError from '@/utils/error'
import { handleUploadImage } from '@/utils/file'
import { NextFunction, Request, Response } from 'express'
import formidable from 'formidable'
import path from 'path'

//Single Image Upload
export const uploadImageController = async (
  req: Request,
  res: Response<SuccessData<{ url: string }>>,
  next: NextFunction
) => {
  const imageUrl = await mediaService.handleUploadImage(req, {})

  res.status(200).json({
    success: true,
    message: 'Image uploaded successfully',
    data: {
      url: imageUrl!
    }
  })
}

export const uploadVideoController = async (
  req: Request,
  res: Response<SuccessData<{ url: string }>>,
  next: NextFunction
) => {
  try {
    const videoUrl = await mediaService.handleUploadVideo(req, {})
    res.json({
      success: true,
      message: 'Test upload Video ',
      data: {
        url: videoUrl!
      }
    })
  } catch (error) {
    next(error)
  }
}
