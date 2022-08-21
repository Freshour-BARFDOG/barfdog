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
  https: 4001,
};

const httpsOptions = {
  key: fs.readFileSync('./certificates/localhost.key'),
  cert: fs.readFileSync('./certificates/localhost.crt'),
};

nextApp
  .prepare()
  .then(() => {
    server.all('*', (req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*"); // CORS 허용
      res.setHeader("Access-Control-Request-Methods", "GET, POST, DELETE"); // CORS 허용
      res.setHeader("Access-Control-Allow-Credentials", "true"); // 쿠키 주고받기 허용
      return handle(req, res);
    });

    http(server).listen(ports.http, (err) => {
      if (err) throw err;
      console.log(`> HTTP Server Running on http://localhost:${ports.http}`);
    });

    https(httpsOptions, server).listen(ports.https, (err) => {
      if (err) throw err;
      console.log(`> HTTPS Server Running on https://localhost:${ports.https}`);
    });
  })
  .catch((err) => {
    console.error('ERROR:::', err.stack);
    process.exit(1);
  });
