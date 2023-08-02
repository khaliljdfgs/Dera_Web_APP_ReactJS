import express from 'express'
import { GetService, UpdateService, DeleteService, GetAllServices } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetService)
router.route('/:uid').patch(UpdateService)
router.route('/:uid').delete(DeleteService)
router.route('/').get(GetAllServices)

export default router