/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetDVMServiceEnrollment = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const serviceAvailments = await db.collectionGroup('serviceAvailments').get()
  const services = await db.collection('services').get()

  const serviceAvailment = serviceAvailments.docs.find(serviceAvailment => serviceAvailment.id === uid)
  if (!serviceAvailment) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No dvm service enrollment found with uid ${uid}`
    }
  }

  const service = services.docs.find(service => service.id === serviceAvailment.data().serviceId)
  const owner = await db.collection('users').doc(serviceAvailment.data().serviceOfferedBy).get()
  const availedBy = await db.collection('users').doc(serviceAvailment.data().serviceAvailedBy).get()

  const payload = {
    ...serviceAvailment.data(),
    uid: serviceAvailment.id,
    service: service.data(),
    owner: owner.data(),
    availedBy: availedBy.data(),
    totalAvailments: serviceAvailments.docs.filter(serviceAvailment => serviceAvailment.data().serviceId === service.id).length
  }

  response.status(StatusCodes.OK).json(payload)
}

const DeleteDVMServiceEnrollment = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const services = await db.collection('services').get()
  const serviceAvailments = await db.collectionGroup('serviceAvailments').get()

  for (const service of services.docs) {
    const serviceAvailment = serviceAvailments.docs.find(serviceAvailment => serviceAvailment.id === uid)
    if (serviceAvailment) {
      await serviceAvailment.ref.delete()
      break
    }
  }

  response.status(StatusCodes.OK).json({
    message: `Successfully deleted dairy product with uid ${uid}`
  })
}

const GetAllDVMServiceEnrollments = async (request, response, next) => {
  const db = admin.firestore()
  const serviceAvailments = await db.collectionGroup('serviceAvailments').get()
  const services = await db.collection('services').get()
  const users = await db.collection('users').get()

  const dvmServiceAvailmentsData = []
  serviceAvailments.forEach(doc => {
    const serviceAvailment = doc.data()
    serviceAvailment.service = services.docs.find(service => service.id === serviceAvailment.serviceId).data()
    serviceAvailment.owner = users.docs.find(user => user.id === serviceAvailment.serviceOfferedBy).data()
    serviceAvailment.availedBy = users.docs.find(user => user.id === serviceAvailment.serviceAvailedBy).data()

    dvmServiceAvailmentsData.push({
      ...serviceAvailment,
      uid: doc.id
    })
  })

  response.status(StatusCodes.OK).json(dvmServiceAvailmentsData)
}

export {
  GetDVMServiceEnrollment,
  DeleteDVMServiceEnrollment,
  GetAllDVMServiceEnrollments,
}