/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetPromotions = async (request, response, next) => {
  const db = admin.firestore()
  const consumer = await db.collection('configs').doc('consumer').get().then(doc => doc.data())
  const dvm = await db.collection('configs').doc('dvm').get().then(doc => doc.data())

  response.status(StatusCodes.OK).json({
    consumer: consumer.bannerPhotos,
    dvm: dvm.bannerPhotos
  })
}

const UpdatePromotions = async (request, response, next) => {
  const consumer = request.body.consumer
  const dvm = request.body.dvm

  const db = admin.firestore()
  await db.collection('configs').doc('consumer').set({
    bannerPhotos: consumer
  }, { merge: true })

  await db.collection('configs').doc('dvm').set({
    bannerPhotos: dvm
  }, { merge: true })

  response.status(StatusCodes.OK).json({
    message: `Promotions updated successfully`
  })
}

export {
  GetPromotions,
  UpdatePromotions
}