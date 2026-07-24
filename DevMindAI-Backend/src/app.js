import express from 'express'
import { attachAuthContext } from './common/middleware/auth.middleware.js'

const app = express()
app.use(express.json())
app.use(attachAuthContext)

export default app