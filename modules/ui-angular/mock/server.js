const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const low = require('lowdb');
const path = require('path');
const FileAsync = require('lowdb/adapters/FileAsync');
const https = require('https')
const adapter = new FileAsync('mock/db/db.json');
const db = low(adapter);
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

const MUTATING_METHODS = new Set(['POST', 'PUT', 'DELETE', 'PATCH']);
app.use((req, res, next) => {
  if (MUTATING_METHODS.has(req.method) && !req.headers.authorization) {
    return res.status(403).json({ error: 'Forbidden: missing Authorization header' });
  }
  next();
});

require('./app/routes')(app, db);

const options = {
  secureProtocol: 'TLSv1_2_method',
  secureOptions: require("constants").SSL_OP_NO_SSLv2 |
    require("constants").SSL_OP_NO_SSLv3 |
    require("constants").SSL_OP_NO_TLSv1 |
    require("constants").SSL_OP_NO_TLSv1_1,
  minVersion: "TLSv1.2" // Ensures only TLS 1.2 and above are allowed
};

https.createServer(options, app).listen(port, () => {
  console.log('We are live on ' + port);
});
