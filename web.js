const { createServer: http } = require('http');
const express = require('express');
const server = express();
const next = require('next');
const dev = process.env.NODE_ENV !== 'production';
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();

const ports = {
  http: 4000,
  // https: 4001,
};


nextApp
  .prepare()
  .then(() => {
    server.all('*', (req, res) => {
      // const barfdogApiUrl = dev ? process.env.NEXT_PUBLIC_API_URL_DEV : process.env.NEXT_PUBLIC_API_URL_PRODUCT
      // // console.log('BARFDOG API URL: ',barfdogApiUrl);
      // res.setHeader("Access-Control-Allow-Credentials", true); // 쿠키 주고받기 허용
      // res.setHeader("Access-Control-Allow-Origin", barfdogApiUrl); // CORS 허용
      // res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT"); // CORS 허용
      // res.setHeader(
      //   'Access-Control-Allow-Headers',
      //   'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
      // )
      return handle(req, res);
    });

    http(server).listen(ports.http, (err) => {
      if (err) throw err;
      // console.log(`> HTTP Server Running on http://localhost:${ports.http}`);
    });
  })
  .catch((err) => {
    console.error('WEB.JS > ERROR:', err.stack);
    process.exit(1);
  });
