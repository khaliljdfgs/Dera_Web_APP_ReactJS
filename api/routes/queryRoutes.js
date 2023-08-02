import express from 'express'
import { GetQuery, GetQueries, DeleteQuery } from '../controllers/index.js'

const router = express.Router()

router.get('/', GetQueries)
router.get('/:uid', GetQuery)
router.delete('/:uid', DeleteQuery)

export default router