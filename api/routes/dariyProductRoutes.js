import express from 'express'
import { GetDairyProduct, UpdateDairyProduct, DeleteDairyProduct, GetAllDairyProducts } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetDairyProduct)
router.route('/:uid').patch(UpdateDairyProduct)
router.route('/:uid').delete(DeleteDairyProduct)
router.route('/').get(GetAllDairyProducts)

export default router