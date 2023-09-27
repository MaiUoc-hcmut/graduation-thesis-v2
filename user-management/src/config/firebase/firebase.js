const serviceAccount = require('./creds.json');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const firebaseConfig = {
    apiKey: "AIzaSyA9e8LElTTdOqQGgsNyfW4bAY50DzuWpPs",
    authDomain: "study365-a3ffe.firebaseapp.com",
    projectId: "study365-a3ffe",
    storageBucket: "study365-a3ffe.appspot.com",
    messagingSenderId: "594995981304",
    appId: "1:594995981304:web:05f3463e75d6a3bf18c40d",
    measurementId: "G-ZKNB53RPEY"
};

const storage = admin.storage();

module.exports = { storage, firebaseConfig };