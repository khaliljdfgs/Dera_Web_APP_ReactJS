/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetLivestockRequest = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('livestocks').doc(uid.split('@index')[0]).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock request found with uid ${uid}`
    }
  }

  const livestockdata = doc.data()
  if (livestockdata.requests.length > Number(uid.split('@index')[1]) + 1) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock request found with uid ${uid}`
    }
  }

  const users = await db.collection('users').get()
  livestockdata.owner = users.docs.find(user => user.id === livestockdata.owner).data()
  livestockdata.requestedBy = users.docs.find(user => user.id === livestockdata.requests[uid.split('@index')[1]]).data()

  response.status(StatusCodes.OK).json({
    ...livestockdata,
    uid: `${doc.id}@index${uid.split('@index')[1]}`
  })
}


const DeleteLivestockRequest = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('livestocks').doc(uid.split('@index')[0]).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock request found with uid ${uid}`
    }
  }

  const livestockdata = doc.data()
  if (livestockdata.requests.length > Number(uid.split('@index')[1]) + 1) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock request found with uid ${uid}`
    }
  }

  const __requests = livestockdata.requests.filter((request, index) => index !== Number(uid.split('@index')[1]))
  await db.collection('livestocks').doc(uid.split('@index')[0]).set({
    requests: __requests
  }, { merge: true })

  response.status(StatusCodes.OK).json({
    message: `Livestock request with uid ${uid} deleted successfully`
  })
}

const GetAllLivestockRequests = async (request, response, next) => {
  const db = admin.firestore()
  const livestocks = await db.collection('livestocks').get()
  const users = await db.collection('users').get()

  const livestockRequestsData = []
  livestocks.forEach(doc => {
    const livestock = doc.data()
    livestock.owner = users.docs.find(user => user.id === livestock.owner).data()

    livestock.requests?.forEach((request, index) => {
      livestockRequestsData.push({
        ...livestock,
        requestedBy: users.docs.find(user => user.id === request).data(),
        uid: `${doc.id}@index${index}`
      })
    })
  })

  response.status(StatusCodes.OK).json(livestockRequestsData)
}

export {
  GetLivestockRequest,
  DeleteLivestockRequest,
  GetAllLivestockRequests,
}