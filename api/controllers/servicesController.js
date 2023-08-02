/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetService = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('services').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No service found with uid ${uid}`
    }
  }

  const service = doc.data()
  const owner = await db.collection('users').doc(service.owner).get()
  service.owner = owner.data()

  response.status(StatusCodes.OK).json({
    ...service,
    uid: doc.id
  })
}

const UpdateService = async (request, response, next) => {
  const uid = `${request.params.uid}`
  const serviceCharges = request.body.serviceCharges
  const serviceChargesPer = request.body.serviceChargesPer
  const serviceDescription = request.body.serviceDescription
  const serviceImage = request.body.serviceImage
  const serviceTitle = request.body.serviceTitle
  const serviceType = request.body.serviceType

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const payload = {}
  if (serviceCharges) payload.serviceCharges = serviceCharges
  if (serviceChargesPer) payload.serviceChargesPer = serviceChargesPer
  if (serviceDescription) payload.serviceDescription = serviceDescription
  if (serviceImage) payload.serviceImage = serviceImage
  if (serviceTitle) payload.serviceTitle = serviceTitle
  if (serviceType) payload.serviceType = serviceType

  await admin.firestore().collection('services').doc(uid).set({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  response.status(StatusCodes.OK).json({
    message: `Service with uid ${uid} updated successfully`
  })
}

const DeleteService = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('services').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No service found with uid ${uid}`
    }
  }

  const service = doc.data()
  const serviceImage = service?.serviceImage?.split('/').pop().split('?')[0]
  if (serviceImage) {
    const serviceImageRef = admin.storage().bucket().file(serviceImage)
    await serviceImageRef.delete()
  }

  const serviceAvailments = (await doc.ref.collection('serviceAvailments').get()).docs
  for (const serviceAvailment of serviceAvailments) {
    await serviceAvailment.ref.delete()
  }

  const notifications = await db.collection('notifications').where('serviceId', '==', uid).get()
  for (const _doc of notifications.docs) {
    await _doc.ref.delete()
  }

  await doc.ref.delete()

  response.status(StatusCodes.OK).json({
    message: `Service with uid ${uid} deleted successfully`
  })
}

const GetAllServices = async (request, response, next) => {
  const db = admin.firestore()
  const services = await db.collection('services').get()
  const users = await db.collection('users').get()

  const servicesData = []
  services.forEach(doc => {
    const service = doc.data()
    const owner = users.docs.find(user => user.id === service.owner).data()
    service.owner = owner
    servicesData.push({
      ...service,
      uid: doc.id
    })
  })

  response.status(StatusCodes.OK).json(servicesData)
}

export {
  GetService,
  UpdateService,
  DeleteService,
  GetAllServices,
}