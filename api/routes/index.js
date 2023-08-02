import express from 'express'

import UserRouter from './userRoutes.js'
import DairyProductRouter from './dariyProductRoutes.js'
import LivestocksRouter from './livestocksRoutes.js'
import ServicesRouter from './servicesRoutes.js'
import LivestockRequestRouter from './livestockRequestRoutes.js'
import DairyOrderRouter from './dairyOrderRoutes.js'
import DVMServiceEnrollmentRouter from './dvmServiceEnrollmentRoutes.js'
import DashboardRouter from './dashboardRoutes.js'
import QueryRouter from './queryRoutes.js'
import PromotionRouter from './promotionRoutes.js'
import PushNotificationRouter from './pushNotificationRoutes.js'

const router = express.Router()

router.use('/users/', UserRouter)
router.use('/dairyProducts/', DairyProductRouter)
router.use('/livestocks/', LivestocksRouter)
router.use('/services/', ServicesRouter)
router.use('/livestockRequests/', LivestockRequestRouter)
router.use('/dairyOrders/', DairyOrderRouter)
router.use('/dvmServiceEnrollments/', DVMServiceEnrollmentRouter)
router.use('/dashboard/', DashboardRouter)
router.use('/queries/', QueryRouter)
router.use('/promotions/', PromotionRouter)
router.use('/pushNotifications/', PushNotificationRouter)

export default router