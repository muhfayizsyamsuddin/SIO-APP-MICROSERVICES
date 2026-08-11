const express = require('express');

const app = express();

app.use(express.json());

const userRouter = require('./routers/user');
const authRouter = require('./routers/auth');

app.use('/users', userRouter);
app.use('/auth', authRouter);

app.get('/health', (req, res) => {
  res.json({
    service: 'user-service',
    status: 'OK'
  });
});

module.exports = app;