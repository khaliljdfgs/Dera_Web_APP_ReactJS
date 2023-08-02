/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const SendNotification = async (request, response, next) => {
  const title = request.body.title
  const content = request.body.content
  const accountType = request.body.accountType
  const photo = request.body.photo
  const readMore = request.body.readMore

  const payload = {
    type: 'admin-notification',
    title: title,
    content: content,
    photo: photo,
    readMore: readMore || ''
  }

  let users = []
  if (accountType === 'dera') {
    users = await admin.firestore().collection('users').where('accountType', '==', 'dera').get()
  } else if (accountType === 'dvm') {
    users = await admin.firestore().collection('users').where('accountType', '==', 'dvm').get()
  } else if (accountType === 'consumer') {
    users = await admin.firestore().collection('users').where('accountType', '==', 'consumer').get()
  }

  for (const user of users.docs) {
    await admin.firestore().collection('notifications').add({
      ...payload,
      receiver: user.id,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    })
  }

  response.status(StatusCodes.OK).json({
    message: 'Notification sent successfully'
  })
}

export {
  SendNotification
}