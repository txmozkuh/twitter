import { uploadImageController } from '@/controllers/medias.controllers'
import { validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const mediaRouter = Router()

mediaRouter.post('/upload-image', validateRequest, uploadImageController)

export default mediaRouter
