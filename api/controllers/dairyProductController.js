/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetDairyProduct = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('products').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No dairy product found with uid ${uid}`
    }
  }

  const dairyProduct = doc.data()
  const owner = await db.collection('users').doc(dairyProduct.owner).get()
  dairyProduct.owner = owner.data()

  response.status(StatusCodes.OK).json({
    ...dairyProduct,
    uid: doc.id
  })
}

const UpdateDairyProduct = async (request, response, next) => {
  const uid = `${request.params.uid}`
  const orderType = request.body.orderType
  const priceUnit = request.body.priceUnit
  const productCategory = request.body.productCategory
  const productDescription = request.body.productDescription
  const productImage = request.body.productImage
  const productName = request.body.productName
  const productPrice = request.body.productPrice

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const payload = {}
  if (orderType) payload.orderType = orderType
  if (priceUnit) payload.priceUnit = priceUnit
  if (productCategory) payload.productCategory = productCategory
  if (productDescription) payload.productDescription = productDescription
  if (productImage) payload.productImage = productImage
  if (productName) payload.productName = productName
  if (productPrice) payload.productPrice = productPrice

  await admin.firestore().collection('products').doc(uid).set({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  response.status(StatusCodes.OK).json({
    message: `Dairy product with uid ${uid} updated successfully`
  })
}

const DeleteDairyProduct = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const db = admin.firestore()
  const doc = await db.collection('products').doc(uid).get()
  if (!doc.exists) {
    throw {
      statusCode: StatusCodes.NOT_FOUND,
      message: `No dairy product found with uid ${uid}`
    }
  }

  const dairyProduct = doc.data()
  const productImage = dairyProduct?.productImage?.split('/').pop().split('?')[0]
  if (productImage) {
    const productImageRef = admin.storage().bucket().file(productImage)
    await productImageRef.delete()
  }

  const dairyProductOrders = await db.collection('dairyProductOrders').where('product', '==', uid).get()
  for (const _doc of dairyProductOrders.docs) {
    await _doc.ref.delete()
  }

  const notifications = await db.collection('notifications').where('productId', '==', uid).get()
  for (const _doc of notifications.docs) {
    await _doc.ref.delete()
  }

  await doc.ref.delete()

  response.status(StatusCodes.OK).json({
    message: `Dairy product with uid ${uid} deleted successfully`
  })
}

const GetAllDairyProducts = async (request, response, next) => {
  const db = admin.firestore()
  const dariyProducts = await db.collection('products').get()
  const users = await db.collection('users').get()

  const dairyProductsData = []
  dariyProducts.forEach(doc => {
    const dairyProduct = doc.data()
    const owner = users.docs.find(user => user.id === dairyProduct.owner).data()
    dairyProduct.owner = owner
    dairyProductsData.push({
      ...dairyProduct,
      uid: doc.id
    })
  })

  response.status(StatusCodes.OK).json(dairyProductsData)
}

export {
  GetDairyProduct,
  UpdateDairyProduct,
  DeleteDairyProduct,
  GetAllDairyProducts,
}