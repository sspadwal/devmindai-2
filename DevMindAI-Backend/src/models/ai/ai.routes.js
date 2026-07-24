import express from 'express'
import { generateArticle, generateBlogtitle, generateImage, removeImageObject, removeBackground } from './ai.controller.js'
import upload from '../../common/config/multer.js'
import { requireAuth } from '../../common/middleware/auth.middleware.js'

const aiRoutes = express.Router()

aiRoutes.use(requireAuth)

aiRoutes.post('/generate-article', generateArticle)
aiRoutes.post('/generate-blog-title', generateBlogtitle)
aiRoutes.post('/generate-image', generateImage)
aiRoutes.post('/remove-image-object', upload.single('image'), removeImageObject)
aiRoutes.post('/remove-background', upload.single('image'), removeBackground)

export { aiRoutes }