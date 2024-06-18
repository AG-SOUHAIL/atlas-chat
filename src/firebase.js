import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase, serverTimestamp } from "firebase/database";
import firebase from "firebase/compat/app";
import 'firebase/compat/database'


const firebaseConfig = {
    apiKey: "AIzaSyCjmfZmFwsVxy27oZRho6tx5dl8TRBg0Zs",
    authDomain: "atlas-chat-85d66.firebaseapp.com",
    projectId: "atlas-chat-85d66",
    storageBucket: "atlas-chat-85d66.appspot.com",
    messagingSenderId: "666526248009",
    appId: "1:666526248009:web:72fa4290f324dc98236398",
    measurementId: "G-SRXZDB55T1"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();
export default database;

const app = initializeApp(firebaseConfig);
export const gb = getDatabase();
export const db = firebase.database();
export const auth = getAuth();
export const storage = getStorage();
export {serverTimestamp};
