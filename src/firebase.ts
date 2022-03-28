// import firebase from 'firebase/compat/app'
import {initializeApp} from 'firebase/app'
import { getAuth, GoogleAuthProvider } from 'firebase/auth'
import 'firebase/compat/firestore';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyD672vvxD5qh54XedndPmOpouR5Iw7nI_4",
    authDomain: "react-e-commerce-typescript.firebaseapp.com",
    projectId: "react-e-commerce-typescript",
    storageBucket: "react-e-commerce-typescript.appspot.com",
    messagingSenderId: "220942706013",
    appId: "1:220942706013:web:a000976bb07f9d4b24f4b4"
};

const app = initializeApp(firebaseConfig)

const auth = getAuth(app)

const provider = new GoogleAuthProvider()

const db = getFirestore(app)

export {auth,provider,db} 

