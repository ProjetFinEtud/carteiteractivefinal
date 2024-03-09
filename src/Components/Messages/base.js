import firebase from 'firebase/compat/app';
import 'firebase/compat/database';
console.log(`${process.env.REACT_APP_AUTHDOMAINEFIREBASE}`)
const firebaseConfig = {
  apiKey:`${process.env.REACT_APP_APIKEYFIREBASE}`,
  authDomain:`${process.env.REACT_APP_AUTHDOMAINEFIREBASE}`,
  projectId: `${process.env.REACT_APP_PROJECTIDFIREBASE}`,
  databaseURL:`${process.env.REACT_APP_DATABASEFIREBASE}`,
  storageBucket:`${process.env.REACT_APP_STORAGEBUCKETFIREBASE}`,
  messagingSenderId: `${process.env.REACT_APP_MESSAGINSENDERIDFIREBASE}`,
  appId:`${process.env.REACT_APP_APPIDFIREBASE}`,
  measurementId: `${process.env.REACT_APP_MESUREMENTIDFIREBASE}`
};

// Initialisation de l'application Firebasey
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Récupération de l'instance de la base de données
const database = firebaseApp.database();

export { firebaseApp, database };



