/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'

const GetAllUsers = async (request, response, next) => {
  const accountType = `${request.query.accountType}`.toLowerCase()

  if (!accountType) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing accountType query parameter'
    }
  } else if (accountType !== 'dera' && accountType !== 'dvm' && accountType !== 'consumer') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid accountType query parameter'
    }
  }

  const authData = []
  const users = (await admin.auth().listUsers()).users

  users.forEach(user => {
    authData.push({
      uid: user.uid,
      email: user.email,
    })
  })

  const usersData = []
  const snapshot = await admin.firestore().collection('users').get()
  snapshot.forEach(doc => usersData.push(doc.data()))

  const usersWithAuthData = usersData.map(user => {
    const authUser = authData.find(authUser => authUser.uid === user.uid)
    return {
      ...user,
      ...authUser
    }
  })

  const filteredUsers = usersWithAuthData.filter(user => user.accountType === accountType)
  return response.status(StatusCodes.OK).json({
    users: filteredUsers
  })
}

const GetUser = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const authUser = (await admin.auth().getUser(uid)).toJSON()
  const userData = (await admin.firestore().collection('users').doc(uid).get()).data()

  return response.status(StatusCodes.OK).json({
    uid: authUser.uid,
    email: authUser.email,
    ...userData,
  })
}

const UpdateUser = async (request, response, next) => {
  const uid = `${request.params.uid}`
  const email = `${request.body.email}`
  const password = `${request.body.password}`
  const accountType = `${request.body.accountType}`.toLowerCase()

  const fullname = request.body.fullname
  const address = request.body.address
  const phone = request.body.phone                    // {primary: '', secondary: ''}
  const gender = request.body.gender
  const geoLocation = request.body.geoLocation        // {latitude: '', longitude: ''}
  const profilePhoto = request.body.profilePhoto
  const status = request.body.status                  // pending, active, in-active

  // DERA SPECIFIC
  const aboutUs = request.body.aboutUs
  const bannerPhotos = request.body.bannerPhotos
  const businessName = request.body.businessName

  // DVM SPECIFIC
  const specialization = request.body.specialization
  const yearsOfExperience = request.body.yearsOfExperience

  // DERA AND DVM SPECIFIC
  const paymentWallets = request.body.paymentWallets  // {easyPaisa: {title: '', number: ''}, jazzCash: {title: '', number: ''}, uPaisa: {title: '', number: ''}}
  const socialMediaHandles = request.body.socialMediaHandles // {facebook: '', instagram: '', twitter: '', youtube: '', tiktok: ''}

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  if (accountType !== 'dera' && accountType !== 'dvm' && accountType !== 'consumer') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid accountType body parameter'
    }
  }

  const authPayload = {}
  if (email) authPayload.email = email
  if (password && password.length >= 6) authPayload.password = password

  await admin.auth().updateUser(uid, authPayload)

  const payload = {}
  if (accountType) payload.accountType = accountType
  if (fullname) payload.fullname = fullname
  if (email) payload.email = email
  if (gender) payload.gender = gender
  if (address) payload.address = address
  if (profilePhoto) payload.profilePhoto = profilePhoto
  if (geoLocation) payload.geoLocation = geoLocation
  if (phone) payload.phone = phone
  if (status) payload.status = status

  if (accountType === 'dvm') {
    if (specialization) payload.specialization = specialization
    if (yearsOfExperience) payload.yearsOfExperience = yearsOfExperience
  } else if (accountType === 'dera') {
    if (aboutUs) payload.aboutUs = aboutUs
    if (bannerPhotos) payload.bannerPhotos = bannerPhotos
    if (businessName) payload.businessName = businessName
  }

  if (accountType === 'dvm' || accountType === 'dera') {
    if (paymentWallets) payload.paymentWallets = paymentWallets
    if (socialMediaHandles) payload.socialMediaHandles = socialMediaHandles
  }

  await admin.firestore().collection('users').doc(uid).set({
    ...payload,
    updatedAt: admin.firestore.FieldValue.serverTimestamp()
  }, { merge: true })

  return response.status(StatusCodes.OK).json({
    message: 'User Updated Successfully!'
  })
}

const CreateUser = async (request, response, next) => {
  const email = `${request.body.email}`
  const password = `${request.body.password}`
  const accountType = `${request.body.accountType}`.toLowerCase()

  const fullname = request.body.fullname
  const address = request.body.address
  const phone = request.body.phone                    // {primary: '', secondary: ''}
  const gender = request.body.gender
  const geoLocation = request.body.geoLocation        // {latitude: '', longitude: ''}
  const profilePhoto = request.body.profilePhoto
  const status = request.body.status                  // pending, active, in-active

  // DERA SPECIFIC
  const aboutUs = request.body.aboutUs
  const bannerPhotos = request.body.bannerPhotos
  const businessName = request.body.businessName

  // DVM SPECIFIC
  const specialization = request.body.specialization
  const yearsOfExperience = request.body.yearsOfExperience

  // DERA AND DVM SPECIFIC
  const paymentWallets = request.body.paymentWallets  // {easyPaisa: {title: '', number: ''}, jazzCash: {title: '', number: ''}, uPaisa: {title: '', number: ''}}
  const socialMediaHandles = request.body.socialMediaHandles // {facebook: '', instagram: '', twitter: '', youtube: '', tiktok: ''}

  if (accountType !== 'dera' && accountType !== 'dvm' && accountType !== 'consumer') {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Invalid accountType body parameter'
    }
  }

  const authPayload = {
    email: email,
    password: password,
  }

  const authUser = await admin.auth().createUser(authPayload)

  const payload = {
    uid: authUser.uid,
    accountType: accountType,
    fullname: fullname,
    email: email,
    gender: gender,
    address: address,
    geoLocation: geoLocation,
    phone: phone,
    profilePhoto: profilePhoto,
    status: status,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  }

  if (accountType === 'dvm') {
    payload.specialization = specialization
    payload.yearsOfExperience = yearsOfExperience
  } else if (accountType === 'dera') {
    payload.aboutUs = aboutUs
    payload.bannerPhotos = bannerPhotos
    payload.businessName = businessName
  }

  if (accountType === 'dvm' || accountType === 'dera') {
    payload.paymentWallets = paymentWallets
    payload.socialMediaHandles = socialMediaHandles
  }

  await admin.firestore().collection('users').doc(authUser.uid).set(payload)

  return response.status(StatusCodes.OK).json({
    message: 'User created successfully!'
  })
}

const DeleteUser = async (request, response, next) => {
  const uid = `${request.params.uid}`

  if (!uid) {
    throw {
      statusCode: StatusCodes.BAD_REQUEST,
      message: 'Missing uid query parameter'
    }
  }

  const user = (await admin.firestore().collection('users').doc(uid).get()).data()
  const profilePhoto = user.profilePhoto

  if (profilePhoto) {
    const bucket = admin.storage().bucket()
    const filename = profilePhoto.split('/').pop().split('?')[0]
    if (filename) await bucket.file(filename).delete()
  }

  await admin.auth().deleteUser(uid)

  if (user.accountType === 'dvm') {
    const services = (await admin.firestore().collection('services').where('owner', '==', uid).get()).docs
    for (const service of services) {
      const serviceData = service.data()
      const serviceImage = serviceData.serviceImage

      if (serviceImage) {
        const bucket = admin.storage().bucket()
        const filename = serviceImage.split('/').pop().split('?')[0]
        if (filename) await bucket.file(filename).delete()
      }

      const serviceAvailments = (await service.ref.collection('serviceAvailments').get()).docs
      for (const serviceAvailment of serviceAvailments) {
        await serviceAvailment.ref.delete()
      }

      await service.ref.delete()
    }
  }

  if (user.accountType === 'dera') {
    const products = (await admin.firestore().collection('products').where('owner', '==', uid).get()).docs
    for (const product of products) {
      const productData = product.data()
      const productImage = productData.productImage

      if (productImage) {
        const bucket = admin.storage().bucket()
        const filename = productImage.split('/').pop().split('?')[0]
        if (filename) await bucket.file(filename).delete()
      }

      await product.ref.delete()
    }

    const livestocks = (await admin.firestore().collection('livestocks').where('owner', '==', uid).get()).docs
    for (const livestock of livestocks) {
      const livestockData = livestock.data()
      const liveStockPhotos = livestockData.liveStockPhotos

      for (const liveStockPhoto of liveStockPhotos) {
        const bucket = admin.storage().bucket()
        const filename = liveStockPhoto.split('/').pop().split('?')[0]
        if (filename) await bucket.file(filename).delete()
      }

      await livestock.ref.delete()
    }

    const dairyProductOrders = (await admin.firestore().collection('dairyProductOrders').where('owner', '==', uid).get()).docs
    for (const dairyProductOrder of dairyProductOrders) {
      await dairyProductOrder.ref.delete()
    }

    const services = (await admin.firestore().collection('services').get()).docs
    for (const service of services) {
      const serviceAvailments = (await service.ref.collection('serviceAvailments').where('serviceAvailedBy', '==', uid).get()).docs
      for (const serviceAvailment of serviceAvailments) {
        await serviceAvailment.ref.delete()
      }
    }
  }

  if (user.accountType === 'consumer') {
    const dairyProductOrders = (await admin.firestore().collection('dairyProductOrders').where('placedBy', '==', uid).get()).docs
    for (const dairyProductOrder of dairyProductOrders) {
      await dairyProductOrder.ref.delete()
    }

    const livestocks = (await admin.firestore().collection('livestocks').get()).docs
    for (const livestock of livestocks) {
      const livestockData = livestock.data()
      const requests = livestockData.requests || []

      const index = requests.indexOf(uid)
      if (index > -1) {
        requests.splice(index, 1)
      }

      await livestock.ref.set({ requests: requests }, { merge: true })
    }
  }

  const chats = (await admin.firestore().collection('chats').get()).docs
  for (const chat of chats) {
    const chatData = chat.data()
    const sender = chatData.sender
    const receiver = chatData.receiver

    if (sender === uid || receiver === uid) {
      const messages = (await chat.ref.collection('messages').get()).docs
      for (const message of messages) {
        await message.ref.delete()
      }
      await chat.ref.delete()
    }
  }

  const notifications = (await admin.firestore().collection('notifications').get()).docs
  for (const notification of notifications) {
    const notificationData = notification.data()
    const sender = notificationData.sender
    const receiver = notificationData.receiver

    if (sender === uid || receiver === uid) {
      await notification.ref.delete()
    }
  }

  const queries = (await admin.firestore().collection('queries').get()).docs
  for (const query of queries) {
    const queryData = query.data()

    if (queryData.submittedBy === uid) {
      await query.ref.delete()
    }
  }

  await admin.firestore().collection('users').doc(uid).delete()

  return response.status(StatusCodes.OK).json({
    message: 'User deleted successfully!'
  })
}


export {
  CreateUser,
  GetUser,
  UpdateUser,
  DeleteUser,
  GetAllUsers,
}