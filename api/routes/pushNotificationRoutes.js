import express from 'express'
import { SendNotification } from '../controllers/index.js'

const router = express.Router()

router.post('/', SendNotification)

export default router