import express from 'express'
import { GetLivestock, UpdateLivestock, DeleteLivestock, GetAllLivestocks } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetLivestock)
router.route('/:uid').patch(UpdateLivestock)
router.route('/:uid').delete(DeleteLivestock)
router.route('/').get(GetAllLivestocks)

export default router