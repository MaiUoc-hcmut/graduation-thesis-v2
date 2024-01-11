const express = require('express');
const db = require('./config/db')
const route = require('./routes')
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
route(app)



app.listen(3001, () => {
    console.log('Listenning on port 3001');
});
