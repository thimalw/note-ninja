const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/v1', require('./src/routes'));

// TODO: get port from config/env
app.listen(3000, () => {
  console.log('Server is listening on port 3000');
});