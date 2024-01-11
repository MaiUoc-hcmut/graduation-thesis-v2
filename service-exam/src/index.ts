const express = require('express');
const db = require('./config/db')
const route1 = require('./routes')
const bodyParser = require('body-parser')
const cors = require('cors');

require('dotenv').config()

db.connect()

const app = express();

app.use(cors());
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
route1(app)



app.listen(3002, () => {
  console.log('Listenning on port 3001');
});
