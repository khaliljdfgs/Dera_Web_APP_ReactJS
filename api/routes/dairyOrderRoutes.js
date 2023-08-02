import express from 'express'
import { GetDairyOrder, DeleteDairyOrder, GetAllDairyOrders } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetDairyOrder)
router.route('/:uid').delete(DeleteDairyOrder)
router.route('/').get(GetAllDairyOrders)

export default router