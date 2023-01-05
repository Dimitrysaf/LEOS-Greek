const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const low = require('lowdb');
const path = require('path');
const FileAsync = require('lowdb/adapters/FileAsync');
const adapter = new FileAsync('mock/db/db.json');
const db = low(adapter);
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use('/legacy', express.static(path.join(__dirname, 'legacy')));

require('./app/routes')(app, db);

app.listen(port, () => {
  console.log('We are live on ' + port);
});
