// src/setupProxy.ts
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app: any) {
    // Proxy the first API route
    app.use(
        '/api/start-charger-connection',  
        createProxyMiddleware({
            target: 'https://iparkchargingwebappbackend.onrender.com:8080',  
            // target: 'http://185.96.163.154:8080',  
            changeOrigin: true,
            secure: false  
        })
    );

    // Proxy the second API route
    /* app.use(
        '/api/route2',  
        createProxyMiddleware({
            target: 'http://backend-api-url.com',  
            changeOrigin: true,
            secure: false  
        })
    ); */

    // Add more API routes as needed
};
