import { uploadImageController, uploadVideoController } from '@/controllers/medias.controllers'
import { accessTokenValidator, validateRequest } from '@/middlewares/user.middlewares'
import { Router } from 'express'
const mediaRouter = Router()

/**
 * @swagger
 *   /medias/upload-image:
 *     post:
 *       summary: Store an image in Cloudinary
 *       description: Upload an image to Cloudinary using form data.
 *       tags:
 *         - Medias
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - img
 *               properties:
 *                 img:
 *                   type: string
 *                   format: binary
 *                   description: Image file to upload
 *       responses:
 *         '200':
 *           description: Successfully storing an image
 *         '400':
 *           description: Failed to request
 */

mediaRouter.post('/upload-image', accessTokenValidator, validateRequest, uploadImageController)

/**
 * @swagger
 *   /medias/upload-video:
 *     post:
 *       summary: Store a video in Cloudinary
 *       description: Upload a video to Cloudinary using form data.
 *       tags:
 *         - Medias
 *       security:
 *         - bearerAuth: []
 *       requestBody:
 *         required: true
 *         content:
 *           multipart/form-data:
 *             schema:
 *               type: object
 *               required:
 *                 - video
 *               properties:
 *                 video:
 *                   type: string
 *                   format: binary
 *                   description: Video file to upload
 *       responses:
 *         '200':
 *           description: Successfully storing a video
 *         '400':
 *           description: Failed to request
 */

mediaRouter.post('/upload-video', accessTokenValidator, validateRequest, uploadVideoController)

export default mediaRouter
