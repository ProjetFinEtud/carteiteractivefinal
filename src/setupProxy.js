const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/auth',
    createProxyMiddleware({
      target: 'https://masteregel.alwaysdata.net/server', 
      changeOrigin: true,
    })
  );
  app.use(
    '/user',
    createProxyMiddleware({
      target: 'https://masteregel.alwaysdata.net/server',
      changeOrigin: true,
    })
  );
  app.use(
    '/domaine',
    createProxyMiddleware({
      target: 'https://masteregel.alwaysdata.net/server', 
      changeOrigin: true,
    })
  );
  app.use(
    '/master',
    createProxyMiddleware({
      target: 'https://masteregel.alwaysdata.net/server', 
      changeOrigin: true,
    })
  );
  app.use(
    '/carte',
    createProxyMiddleware({
      target: 'https://masteregel.alwaysdata.net/server', 
      changeOrigin: true,
    })
  );
};
