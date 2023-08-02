import express from 'express'
import { CreateUser, GetUser, UpdateUser, DeleteUser, GetAllUsers } from '../controllers/index.js'

const router = express.Router()

router.route('/').post(CreateUser)
router.route('/:uid').get(GetUser)
router.route('/:uid').patch(UpdateUser)
router.route('/:uid').delete(DeleteUser)
router.route('/').get(GetAllUsers)

export default router