const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(
  createProxyMiddleware({
    target: 'http://user-service:3001',
    changeOrigin: true,
    pathFilter: ['/auth', '/users']
  })
);

app.use(
  createProxyMiddleware({
    target: 'http://menu-service:3002',
    changeOrigin: true,
    pathFilter: '/menus'
  })
);

app.use(
  createProxyMiddleware({
    target: 'http://order-service:3003',
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