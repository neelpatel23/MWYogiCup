import { initializeApp } from "firebase/app";
import { getAuth, getReactNativePersistence, initializeAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDPC8dMs2jTmU9LNLaoPkKB0WYhvGiYgF0",
    authDomain: "mwyogicup-9320c.firebaseapp.com",
    projectId: "mwyogicup-9320c",
    storageBucket: "mwyogicup-9320c.appspot.com",
    messagingSenderId: "690502272348",
    appId: "1:690502272348:web:a8a5d12b46a479ea8c6d99",
    measurementId: "G-FGF7VNCRQ5"
  };
const app = initializeApp(firebaseConfig);

initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});


export const auth = getAuth();
export const database = getFirestore();
export const storage = getStorage();  