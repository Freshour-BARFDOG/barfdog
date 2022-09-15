const { createServer: http } = require('http');
const { createServer: https } = require('https');
const express = require('express');
const server = express();
const fs = require('fs');
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const ports = {
  http: 4000,
  // https: 4001,
};

// const httpsOptions = {
//   key: fs.readFileSync('./certificates/localhost.key'),
//   cert: fs.readFileSync('./certificates/localhost.crt'),
// };

nextApp
  .prepare()
  .then(() => {
    
    server.all('*', (req, res) => {
      const barfdogApiUrl = dev ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCT
      console.log(barfdogApiUrl);
      res.setHeader("Access-Control-Allow-Credentials", true); // 쿠키 주고받기 허용
      res.setHeader("Access-Control-Allow-Origin", barfdogApiUrl); // CORS 허용
      res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT"); // CORS 허용
      res.setHeader(
        'Access-Control-Allow-Headers',
        'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      )
      return handle(req, res);
    });

    http(server).listen(ports.http, (err) => {
      if (err) throw err;
      console.log(`> HTTP Server Running on http://localhost:${ports.http}`);
    });

    // https(httpsOptions, server).listen(ports.https, (err) => {
    //   if (err) throw err;
    //   console.log(`> HTTPS Server Running on https://localhost:${ports.https}`);
    // });
  })
  .catch((err) => {
    console.error('ERROR:::', err.stack);
    process.exit(1);
  });
