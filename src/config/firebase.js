import { getApp, getApps, initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAuth } from 'firebase/auth'

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyAy4uyjNpPdSuGY2KaLPnFOMJb1n7dKmlA",
  authDomain: "dera-dfce2.firebaseapp.com",
  projectId: "dera-dfce2",
  storageBucket: "dera-dfce2.appspot.com",
  messagingSenderId: "59856671342",
  appId: "1:59856671342:web:7fa762cc805f04f54dcc7f"
}

const FirebaseApp = !getApps().length ? initializeApp(FIREBASE_CONFIG) : getApp()
const Authentication = getAuth(FirebaseApp)

const Firestore = getFirestore(FirebaseApp)
const Storage = getStorage(FirebaseApp)

export { Authentication, Firestore, Storage }