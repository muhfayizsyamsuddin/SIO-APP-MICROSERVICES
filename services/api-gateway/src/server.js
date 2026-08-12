const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  cors({
    origin: 'http://localhost:5173',
  })
);

app.use(
  createProxyMiddleware({
    target: 'http://sio-user-service:3001',
    changeOrigin: true,
    pathFilter: ['/auth', '/users']
  })
);

app.use(
  createProxyMiddleware({
    target: 'http://sio-menu-service:3002',
    changeOrigin: true,
    pathFilter: '/menus'
  })
);

app.use(
  createProxyMiddleware({
    target: 'http://sio-order-service:3003',
    changeOrigin: true,
    pathFilter: '/orders'
  })
);

app.get('/health', (req, res) => {
  res.json({
    service: 'api-gateway',
    status: 'OK'
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
});