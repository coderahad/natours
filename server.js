// const express = require('express');
// const server = express();
const app = require('./app');

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});
