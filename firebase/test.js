var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://parkingbuddy-79e1c-default-rtdb.firebaseio.com"
});

// Access the database and perform operations
const db = admin.database();
const ref = db.ref("/"); // Replace 'your_database_path' with the actual path in your database

// Example of reading data
ref.once("value", function(snapshot) {
  console.log(snapshot.val());
  admin.app().delete(); // Cleanup - optional
});