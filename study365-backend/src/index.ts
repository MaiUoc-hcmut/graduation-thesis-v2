const express = require('express');
const db = require('./config/db')
db.connect()
console.log(db.connect);


const app = express();

app.listen(3000, () => {
  console.log('Listenning on port 3000');
});
