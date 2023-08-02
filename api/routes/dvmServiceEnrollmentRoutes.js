import express from 'express'
import { GetDVMServiceEnrollment, DeleteDVMServiceEnrollment, GetAllDVMServiceEnrollments } from '../controllers/index.js'

const router = express.Router()

router.route('/:uid').get(GetDVMServiceEnrollment)
router.route('/:uid').delete(DeleteDVMServiceEnrollment)
router.route('/').get(GetAllDVMServiceEnrollments)

export default router