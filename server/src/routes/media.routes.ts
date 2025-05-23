import { uploadImageController, uploadVideoController } from '@/controllers/medias.controllers'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const mediaRouter = Router()

mediaRouter.post('/upload-image', accessTokenValidator, validateRequest, uploadImageController)

mediaRouter.post('/upload-video', accessTokenValidator, validateRequest, uploadVideoController)
export default mediaRouter
