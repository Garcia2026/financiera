import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getAnalytics } from "firebase/analytics"

const firebaseConfig = {
  apiKey: "AIzaSyAfg7VAw2F6umMmYBY0r0aL09OHXgqGHgI",
  authDomain: "fincontrol-app.firebaseapp.com",
  projectId: "fincontrol-app",
  storageBucket: "fincontrol-app.appspot.com",
  messagingSenderId: "714910121771",
  appId: "1:714910121771:web:be6f6fe8dc7de987528f6e",
  measurementId: "G-TB4C5Z2Q29"
}

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const analytics = getAnalytics(app)

export { auth, db, analytics }
