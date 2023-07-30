import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getStorage } from 'firebase/storage'
const firebaseConfig = {
  apiKey: 'AIzaSyDzTw8rsv15VqWY6EHitfTTB-S4vr3uUiE',
  authDomain: 'resme-neel.firebaseapp.com',
  projectId: 'resme-neel',
  storageBucket: 'resme-neel.appspot.com',
  messagingSenderId: '460667884722',
  appId: '1:460667884722:web:93d67708ef0c5fe723a5ab',
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)

export { auth, db, storage }
