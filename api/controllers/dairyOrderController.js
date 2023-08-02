/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetDairyOrder = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('dairyProductOrders').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No dairy product found with uid ${uid}`
    }
  }

  const _users = await db.collection('users').get()
  const _dairyProducts = await db.collection('products').get()

  const users = []
  _users.forEach(doc => {
    users.push({
      ...doc.data(),
      uid: doc.id
    })
  })

  const dairyProducts = []
  _dairyProducts.forEach(doc => {
    dairyProducts.push({
      ...doc.data(),
      uid: doc.id
    })
  })

  const dairyProductOrder = {
    ...doc.data(),
    uid: doc.id
  }

  dairyProductOrder.owner = users.find(user => user.uid === dairyProductOrder.owner)
  dairyProductOrder.placedBy = users.find(user => user.uid === dairyProductOrder.placedBy)
  dairyProductOrder.product = dairyProducts.find(product => product.uid === dairyProductOrder.product)

  response.status(StatusCodes.OK).json(dairyProductOrder)
}


const DeleteDairyOrder = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()

  const notifications = await db.collection('notifications').where('orderId', '==', uid).get()
  for (const _doc of notifications.docs) {
    await _doc.ref.delete()
  }

  await db.collection('dairyProductOrders').doc(uid).delete()

  response.status(StatusCodes.OK).json({
    message: `Dairy product order with uid ${uid} deleted successfully`
  })
}

const GetAllDairyOrders = async (request, response, next) => {
  const db = admin.firestore()
  const dairyProductOrders = await db.collection('dairyProductOrders').get()
  const _users = await db.collection('users').get()
  const _dairyProducts = await db.collection('products').get()

  const users = []
  _users.forEach(doc => {
    users.push({
      ...doc.data(),
      uid: doc.id
    })
  })

  const dairyProducts = []
  _dairyProducts.forEach(doc => {
    dairyProducts.push({
      ...doc.data(),
      uid: doc.id
    })
  })

  const dairyProductsData = []
  dairyProductOrders.forEach(doc => {
    const dairyProductOrder = {
      ...doc.data(),
      uid: doc.id
    }

    dairyProductOrder.owner = users.find(user => user.uid === dairyProductOrder.owner)
    dairyProductOrder.placedBy = users.find(user => user.uid === dairyProductOrder.placedBy)
    dairyProductOrder.product = dairyProducts.find(product => product.uid === dairyProductOrder.product)

    dairyProductsData.push(dairyProductOrder)
  })

  response.status(StatusCodes.OK).json(dairyProductsData)
}

export {
  GetDairyOrder,
  DeleteDairyOrder,
  GetAllDairyOrders,
}