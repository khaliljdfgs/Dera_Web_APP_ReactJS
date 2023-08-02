import express from 'express'
import { GetLivestockRequest, DeleteLivestockRequest, GetAllLivestockRequests } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetLivestockRequest)
router.route('/:uid').delete(DeleteLivestockRequest)
router.route('/').get(GetAllLivestockRequests)

export default router