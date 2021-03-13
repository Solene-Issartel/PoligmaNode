const express = require('express');
const bodyParser = require('body-parser');
var cors = require('cors')

var communes = require('./routes/communes');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors())

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/communes',communes);

app.listen(port, () => console.log(`Listening on port ${port}`));