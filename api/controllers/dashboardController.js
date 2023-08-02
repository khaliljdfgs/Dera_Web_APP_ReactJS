/* eslint-disable no-throw-literal */
import { StatusCodes } from 'http-status-codes'
import admin from 'firebase-admin'
import moment from 'moment'
import { Timestamp } from 'firebase/firestore'

const GetUserStats = async (request, response, next) => {
  const db = admin.firestore()

  const _users = await db.collection('users').get()
  const users = []
  _users.forEach(user => users.push({ ...user.data(), uid: user.id }))

  const usersCreatedInLast10Days = []
  users.forEach(user => {
    if (user.accountType === 'admin') return

    const userCreatedDate = moment(new Timestamp(
      user.createdAt._seconds,
      user.createdAt._nanoseconds
    ).toDate())

    const currentDate = moment()
    const diffInDays = moment(currentDate).diff(userCreatedDate, 'days')

    if (diffInDays <= 14) usersCreatedInLast10Days.push(user)
  })

  const totalUsers = users.length
  const totalDVMUsers = users.filter(user => user.accountType === 'dvm').length
  const totalDeraUsers = users.filter(user => user.accountType === 'dera').length
  const totalConsumerUsers = users.filter(user => user.accountType === 'consumer').length

  const dashboardStats = {
    allTime: [
      {
        name: 'DVM',
        total: totalDVMUsers,
        pending: users.filter(user => user.status === 'pending' && user.accountType === 'dvm').length,
        active: users.filter(user => user.status === 'active' && user.accountType === 'dvm').length,
        suspended: users.filter(user => user.status === 'suspended' && user.accountType === 'dvm').length,
      },
      {
        name: 'Dera',
        total: totalDeraUsers,
        pending: users.filter(user => user.status === 'pending' && user.accountType === 'dera').length,
        active: users.filter(user => user.status === 'active' && user.accountType === 'dera').length,
        suspended: users.filter(user => user.status === 'suspended' && user.accountType === 'dera').length,
      },
      {
        name: 'Consumer',
        total: totalConsumerUsers,
        pending: users.filter(user => user.status === 'pending' && user.accountType === 'consumer').length,
        active: users.filter(user => user.status === 'active' && user.accountType === 'consumer').length,
        suspended: users.filter(user => user.status === 'suspended' && user.accountType === 'consumer').length,
      },
    ],
    last14Days: [
      {
        name: 'DVM',
        pending: usersCreatedInLast10Days.filter(user => user.status === 'pending' && user.accountType === 'dvm').length,
        active: usersCreatedInLast10Days.filter(user => user.status === 'active' && user.accountType === 'dvm').length,
        suspended: usersCreatedInLast10Days.filter(user => user.status === 'suspended' && user.accountType === 'dvm').length,
      },
      {
        name: 'Dera',
        pending: usersCreatedInLast10Days.filter(user => user.status === 'pending' && user.accountType === 'dera').length,
        active: usersCreatedInLast10Days.filter(user => user.status === 'active' && user.accountType === 'dera').length,
        suspended: usersCreatedInLast10Days.filter(user => user.status === 'suspended' && user.accountType === 'dera').length,
      },
      {
        name: 'Consumer',
        pending: usersCreatedInLast10Days.filter(user => user.status === 'pending' && user.accountType === 'consumer').length,
        active: usersCreatedInLast10Days.filter(user => user.status === 'active' && user.accountType === 'consumer').length,
        suspended: usersCreatedInLast10Days.filter(user => user.status === 'suspended' && user.accountType === 'consumer').length,
      },
    ],
    totalUsers,
    totalAdmin: users.filter(user => user.accountType === 'admin').length,
  }

  response.status(StatusCodes.OK).json(dashboardStats)
}

const GetDairyProductStats = async (request, response, next) => {
  const db = admin.firestore()

  const dairyProducts = await db.collection('products').get()
  const dairyProductOrders = await db.collection('dairyProductOrders').get()

  const dairyProductsData = []
  dairyProducts.forEach(dairyProduct => dairyProductsData.push({ ...dairyProduct.data(), id: dairyProduct.id }))

  const dairyProductOrdersData = []
  dairyProductOrders.forEach(dairyProductOrder => dairyProductOrdersData.push({ ...dairyProductOrder.data(), id: dairyProductOrder.id }))

  let avgPrice = 0
  for (let i = 0; i < dairyProductsData.length; i++) avgPrice += Number(dairyProductsData[i].productPrice)
  avgPrice = (avgPrice / dairyProductsData.length)

  const dairyProductStats = {
    products: [
      {
        name: 'Subscription',
        value: dairyProductsData.filter(dairyProduct => dairyProduct.orderType.isSubscription && !dairyProduct.orderType.isSingleOrder).length,
      },
      {
        name: 'Single Order',
        value: dairyProductsData.filter(dairyProduct => dairyProduct.orderType.isSingleOrder && !dairyProduct.orderType.isSubscription).length,
      },
      {
        name: 'Both',
        value: dairyProductsData.filter(dairyProduct => dairyProduct.orderType.isSubscription && dairyProduct.orderType.isSingleOrder).length,
      },
    ],
    totalProducts: dairyProductsData.length,
    totalOrders: dairyProductOrdersData.length,
    totalSubscriptionBasedOrders: dairyProductOrdersData.filter(dairyProductOrder => dairyProductOrder.isSubscription).length,
    totalSingleOrderBasedOrders: dairyProductOrdersData.filter(dairyProductOrder => dairyProductOrder.isSingleOrder).length,
    avgPrice: avgPrice,
    totalMorningOrders: dairyProductOrdersData.filter(dairyProductOrder => `${dairyProductOrder.deliveryTime}`.toLowerCase() === 'morning').length,
    totalEveningOrders: dairyProductOrdersData.filter(dairyProductOrder => `${dairyProductOrder.deliveryTime}`.toLowerCase() === 'evening').length,
  }

  response.status(StatusCodes.OK).json(dairyProductStats)
}

const GetLivestockStats = async (request, response, next) => {
  const db = admin.firestore()

  const livestock = await db.collection('livestocks').get()
  const livestockData = []
  livestock.forEach(livestock => livestockData.push({ ...livestock.data(), id: livestock.id }))

  const livestockStats = {
    totalLivestocks: livestockData.length,
    livestock: [
      {
        name: 'Available',
        value: livestockData.filter(livestock => `${livestock.liveStockStatus}`.toLowerCase() === 'available').length,
      },
      {
        name: 'Sold-Out',
        value: livestockData.filter(livestock => `${livestock.liveStockStatus}`.toLowerCase() === 'sold-out').length,
      },
      {
        name: 'Rejected',
        value: livestockData.filter(livestock => `${livestock.liveStockStatus}`.toLowerCase() === 'rejected').length,
      },
      {
        name: 'Pending',
        value: livestockData.filter(livestock => `${livestock.liveStockStatus}`.toLowerCase() === 'pending').length,
      },
    ],
  }

  response.status(StatusCodes.OK).json(livestockStats)
}

export {
  GetUserStats,
  GetDairyProductStats,
  GetLivestockStats
}