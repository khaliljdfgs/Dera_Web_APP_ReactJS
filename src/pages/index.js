import Login from './Login/Login'
import Dashboard from './Dashboard/Dashboard'
import PageNotFound from './PageNotFound'

// USERS MANAGEMENT
import Consumers from './UsersManagement/Consumers/Consumers'
import ConsumerInfo from './UsersManagement/Consumers/ConsumerInfo'
import Deras from './UsersManagement/Deras/Deras'
import DeraInfo from './UsersManagement/Deras/DeraInfo'
import DVMs from './UsersManagement/DVMs/DVMs'
import DVMInfo from './UsersManagement/DVMs/DVMInfo'

// LISTINGS MANAGEMENT
import DairyProducts from './ListingsManagement/DairyProducts/DairyProducts'
import DairyProductInfo from './ListingsManagement/DairyProducts/DairyProductInfo'
import Livestocks from './ListingsManagement/Livestocks/Livestocks'
import LivestockInfo from './ListingsManagement/Livestocks/LivestockInfo'
import DVMServices from './ListingsManagement/DVMServices/DVMServices'
import DVMServiceInfo from './ListingsManagement/DVMServices/DVMServiceInfo'

// TRANSACTIONS
import DairyOrders from './Transactions/DairyOrders/DairyOrders'
import DairyOrderInfo from './Transactions/DairyOrders/DairyOrderInfo'
import LivestockRequests from './Transactions/LivestockRequests/LivestockRequests'
import LivestockRequestInfo from './Transactions/LivestockRequests/LivestockRequestInfo'
import DVMServiceEnrollments from './Transactions/DVMServiceEnrollments/DVMServiceEnrollments'
import DVMServiceEnrollmentInfo from './Transactions/DVMServiceEnrollments/DVMServiceEnrollmentInfo'

// OTHERS
import Queries from './Others/Queries/Queries'
import QueryInfo from './Others/Queries/QueryInfo'
import PushNotifications from './Others/PushNotifications/PushNotifications'
import Promotions from './Others/Promotions/Promotions'

export {
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
  Promotions
}