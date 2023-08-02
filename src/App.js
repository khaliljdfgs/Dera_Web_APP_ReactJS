import React from 'react'
import { Routes, Route } from 'react-router-dom'
import './App.css'

import { useNavigate } from 'react-router-dom'

// Global Context is also saved in ProtectedRoute
import { ProtectedRoute, Layout } from './components'

import {
  Login,
  Dashboard,
  PageNotFound,
  // USERS MANAGEMENT
  Consumers, ConsumerInfo,
  Deras, DeraInfo,
  DVMs, DVMInfo,
  // LISTINGS MANAGEMENT
  DairyProducts, DairyProductInfo,
  Livestocks, LivestockInfo,
  DVMServices, DVMServiceInfo,
  // TRANSACTIONS
  DairyOrders, DairyOrderInfo,
  LivestockRequests, LivestockRequestInfo,
  DVMServiceEnrollments, DVMServiceEnrollmentInfo,
  // OTHERS
  Queries, QueryInfo,
  PushNotifications,
  Promotions,
} from './pages/index'

const RedirectFromHomePage = () => {
  const navigate = useNavigate()
  React.useEffect(() => {
    navigate('/Admin')
  }, [navigate])

  return <></>
}

const App = () => {
  return (
    <Routes>
      <Route path='/' element={<RedirectFromHomePage />} />
      <Route path='/Admin' element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path='/Admin/*' element={<PageNotFound />} />

        {/* USERS MANAGEMENT */}
        <Route path='/Admin/Consumers' element={<Consumers />} />
        <Route path='/Admin/ConsumerInfo/' element={<ConsumerInfo />} />
        <Route path='/Admin/ConsumerInfo/:id' element={<ConsumerInfo />} />
        <Route path='/Admin/Deras' element={<Deras />} />
        <Route path='/Admin/DeraInfo/' element={<DeraInfo />} />
        <Route path='/Admin/DeraInfo/:id' element={<DeraInfo />} />
        <Route path='/Admin/DVMs' element={<DVMs />} />
        <Route path='/Admin/DVMInfo/' element={<DVMInfo />} />
        <Route path='/Admin/DVMInfo/:id' element={<DVMInfo />} />

        {/* LISTINGS MANAGEMENT */}
        <Route path='/Admin/DairyProducts' element={<DairyProducts />} />
        <Route path='/Admin/DairyProductInfo' element={<DairyProductInfo />} />
        <Route path='/Admin/DairyProductInfo/:id' element={<DairyProductInfo />} />
        <Route path='/Admin/Livestocks' element={<Livestocks />} />
        <Route path='/Admin/LivestockInfo' element={<LivestockInfo />} />
        <Route path='/Admin/LivestockInfo/:id' element={<LivestockInfo />} />
        <Route path='/Admin/Services' element={<DVMServices />} />
        <Route path='/Admin/ServiceInfo' element={<DVMServiceInfo />} />
        <Route path='/Admin/ServiceInfo/:id' element={<DVMServiceInfo />} />

        {/* TRANSACTIONS */}
        <Route path='/Admin/DairyOrders' element={<DairyOrders />} />
        <Route path='/Admin/DairyOrderInfo' element={<DairyOrderInfo />} />
        <Route path='/Admin/DairyOrderInfo/:id' element={<DairyOrderInfo />} />
        <Route path='/Admin/LivestockRequests' element={<LivestockRequests />} />
        <Route path='/Admin/LivestockRequestInfo' element={<LivestockRequestInfo />} />
        <Route path='/Admin/LivestockRequestInfo/:id' element={<LivestockRequestInfo />} />
        <Route path='/Admin/ServiceEnrollments' element={<DVMServiceEnrollments />} />
        <Route path='/Admin/ServiceEnrollmentInfo' element={<DVMServiceEnrollmentInfo />} />
        <Route path='/Admin/ServiceEnrollmentInfo/:id' element={<DVMServiceEnrollmentInfo />} />

        {/* OTHERS */}
        <Route path='/Admin/Queries' element={<Queries />} />
        <Route path='/Admin/QueryInfo' element={<QueryInfo />} />
        <Route path='/Admin/QueryInfo/:id' element={<QueryInfo />} />
        <Route path='/Admin/PushNotifications' element={<PushNotifications />} />
        <Route path='/Admin/Promotions' element={<Promotions />} />
      </Route>

      <Route path='/Admin/Login' element={<Login />} />
      <Route path='*' element={<PageNotFound />} />
    </Routes>
  )
}

export default App
