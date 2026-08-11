const express = require('express');
const menuRouter = require('./routers/menu');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Menu Service is running'
  });
});

app.use('/menus', menuRouter);

module.exports = app;