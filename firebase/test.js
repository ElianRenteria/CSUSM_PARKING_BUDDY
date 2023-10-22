var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://console.firebase.google.com/u/0/project/parkingbuddy-79e1c/firestore/data/~2FParking%20Structure~2FLot%20F"
});

// Access the database and perform operations
const db = admin.firestore();
// Example of reading data
const docRef = db.collection('Users').doc('Mark R');

docRef.get()
  .then((doc) => {
    if (doc.exists) {
      console.log('Document data:', doc.data());
    } else {
      console.log('No such document!');
    }
  })
  .catch((error) => {
    console.log('Error getting document:', error);
  });