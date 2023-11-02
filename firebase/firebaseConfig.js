import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAVT3d8_D82CKGZ2FpYlwL9rUJfU6jB44o",
  authDomain: "parkingbuddy-79e1c.firebaseapp.com",
  databaseURL: "https://parkingbuddy-79e1c-default-rtdb.firebaseio.com",
  projectId: "parkingbuddy-79e1c",
  storageBucket: "parkingbuddy-79e1c.appspot.com",
  messagingSenderId: "128031451819",
  appId: "1:128031451819:web:0d0508e6998e4cce71a5ee"
};

// Initialize Firebase

firebase.initializeApp(firebaseConfig);


export default firebase;
