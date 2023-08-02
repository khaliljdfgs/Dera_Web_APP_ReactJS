/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetQuery = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('queries').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No query found with uid ${uid}`
    }
  }

  const querydata = doc.data()
  const submittedBy = await db.collection('users').doc(querydata.submittedBy).get()

  response.status(StatusCodes.OK).json({
    ...querydata,
    submittedBy: submittedBy.data(),
    uid: doc.id
  })
}

const DeleteQuery = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('queries').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No livestock request found with uid ${uid}`
    }
  }

  await db.collection('queries').doc(uid).delete()

  response.status(StatusCodes.OK).json({
    message: `Query with uid ${uid} deleted successfully`
  })
}

const GetQueries = async (request, response, next) => {
  const db = admin.firestore()
  const queries = await db.collection('queries').get()
  const users = await db.collection('users').get()

  const queriesData = []
  queries.forEach(doc => {
    const querydata = doc.data()
    const submittedBy = users.docs.find(user => user.id === querydata.submittedBy).data()
    queriesData.push({
      ...querydata,
      submittedBy,
      uid: doc.id
    })
  })

  response.status(StatusCodes.OK).json(queriesData)
}

export {
  GetQuery,
  GetQueries,
  DeleteQuery
}