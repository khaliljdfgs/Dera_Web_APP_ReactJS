import admin from 'firebase-admin'
import ADMIN_CREDENTIALS from './credentials.js'

admin.initializeApp({
  credential: admin.credential.cert(ADMIN_CREDENTIALS),
  storageBucket: 'gs://dera-dfce2.appspot.com'
})