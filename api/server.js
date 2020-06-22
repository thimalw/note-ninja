const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

// TODO: get mongodb URL from config/env
// mongoose.connect('mongodb://localhost:27017/noteninja', { useNewUrlParser: true }, (err) => {
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/noteninja', { useNewUrlParser: true }, (err) => {
  app.use(cors());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.use('/api/v1', require('./src/routes'));

  var port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log('Server is listening on port ' + port);
  });
});
