import express from 'express'
import { GetUserStats, GetDairyProductStats, GetLivestockStats } from '../controllers/index.js'

const router = express.Router()

router.route('/userStats').get(GetUserStats)
router.route('/dairyProductStats').get(GetDairyProductStats)
router.route('/livestockStats').get(GetLivestockStats)

export default router