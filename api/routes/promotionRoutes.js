import express from 'express'
import { GetPromotions, UpdatePromotions } from '../controllers/index.js'

const router = express.Router()

router.get('/', GetPromotions)
router.post('/', UpdatePromotions)

export default router