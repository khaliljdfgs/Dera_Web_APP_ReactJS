/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetLivestock = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('livestocks').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock found with uid ${uid}`
    }
  }

  const livestock = doc.data()
  const owner = await db.collection('users').doc(livestock.owner).get()
  livestock.owner = owner.data()

  const soldOutTo = livestock.soldOutTo ? await db.collection('users').doc(livestock.soldOutTo).get() : null

  response.status(StatusCodes.OK).json({
    ...livestock,
    uid: doc.id,
    soldOutTo: soldOutTo?.exists ? soldOutTo.data() : null
  })
}

const UpdateLivestock = async (request, response, next) => {
  const uid = `${request.params.uid}`
  const liveStockCategory = request.body.liveStockCategory
  const liveStockDescription = request.body.liveStockDescription
  const liveStockFeatures = request.body.liveStockFeatures
  const liveStockPhotos = request.body.liveStockPhotos
  const liveStockPrice = request.body.liveStockPrice
  const liveStockStatus = request.body.liveStockStatus
  const liveStockTitle = request.body.liveStockTitle

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const payload = {}
  if (liveStockCategory) payload.liveStockCategory = liveStockCategory
  if (liveStockDescription) payload.liveStockDescription = liveStockDescription
  if (liveStockFeatures) payload.liveStockFeatures = liveStockFeatures
  if (liveStockPhotos) payload.liveStockPhotos = liveStockPhotos
  if (liveStockPrice) payload.liveStockPrice = liveStockPrice
  if (liveStockStatus) payload.liveStockStatus = liveStockStatus
  if (liveStockTitle) payload.liveStockTitle = liveStockTitle

  await admin.firestore().collection('livestocks').doc(uid).set({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  response.status(StatusCodes.OK).json({
    message: `Livestock with uid ${uid} updated successfully`
  })
}

const DeleteLivestock = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('livestocks').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock found with uid ${uid}`
    }
  }

  const livestock = doc.data()
  for (const liveStockPhoto of livestock?.liveStockPhotos) {
    const __path = liveStockPhoto?.split('/').pop().split('?')[0]
    if (__path) {
      const liveStockPhotoRef = admin.storage().bucket().file(__path)
      await liveStockPhotoRef.delete()
    }
  }

  const notifications = await db.collection('notifications').where('productId', '==', uid).get()
  for (const _doc of notifications.docs) {
    await _doc.ref.delete()
  }

  await doc.ref.delete()

  response.status(StatusCodes.OK).json({
    message: `Livestock with uid ${uid} deleted successfully`
  })
}

const GetAllLivestocks = async (request, response, next) => {
  const db = admin.firestore()
  const livestocks = await db.collection('livestocks').get()
  const users = await db.collection('users').get()

  const livestocksData = []
  livestocks.forEach(doc => {
    const livestock = doc.data()
    const owner = users.docs.find(user => user.id === livestock.owner).data()
    livestock.owner = owner
    livestocksData.push({
      ...livestock,
      uid: doc.id
    })
  })

  response.status(StatusCodes.OK).json(livestocksData)
}

export {
  GetLivestock,
  UpdateLivestock,
  DeleteLivestock,
  GetAllLivestocks,
}