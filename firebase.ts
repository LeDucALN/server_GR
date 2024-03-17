const firebase = require("firebase/app");
const { 
  getAuth, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
 } = require("firebase/auth");

const apiKey = process.env.FIREBASE_API_KEY;
firebase.initializeApp({
    apiKey: "AIzaSyDQqqarKIhnDi4nS9puqyzKK4KPyepE9rY",
    authDomain: "driver-c46cb.firebaseapp.com",
    projectId: "driver-c46cb",
    storageBucket: "driver-c46cb.appspot.com",
    messagingSenderId: "539574035558",
    appId: "1:539574035558:web:2049c7a6eba10368fe79a7",
    measurementId: "G-855PZ19PYK"
});

const auth = getAuth();

const addUser = (email: any, password: any) => createUserWithEmailAndPassword(auth, email, password);
const authenticate = (email: any, password: any) => signInWithEmailAndPassword(auth, email, password);

export { addUser, authenticate };

// exports.addUser = (email: any, password: any) =>
//   createUserWithEmailAndPassword(auth, email, password);

// exports.authenticate = (email: any, password: any) =>
//   signInWithEmailAndPassword(auth, email, password);