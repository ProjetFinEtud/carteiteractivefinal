import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
const firebaseConfig = {
  apiKey: "AIzaSyD-oOSNHydT6OJhYv3eGl1VaAmfAVOWslo",
  authDomain: "chategel-cb469.firebaseapp.com",
  projectId: "chategel-cb469",
  databaseURL: "https://chat-egel-default-rtdb.europe-west1.firebasedatabase.app/",
  storageBucket: "chategel-cb469.appspot.com",
  messagingSenderId: "53024394820",
  appId: "1:53024394820:web:31dbf637cb966b15633611",
  measurementId: "G-XD6KL5JD2S"
};


const firebaseApp = firebase.initializeApp(firebaseConfig);


const database = firebaseApp.database();

export { firebaseApp, database };



