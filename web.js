
const dev = process.env.NODE_ENV !== "production";
const express = require("express");
const server = express();
const port = parseInt(process.env.PORT, 10) || 4000;
const next = require("next");
const nextApp = next({ dev });
const handle = nextApp.getRequestHandler();


nextApp.prepare().then(() => {
  
  server.all("*", (req, res) => {
    return handle(req, res);
  });

  server.listen(port, (err) => {
    if (err) throw err;
    console.log(`> Server Running on http://localhost:${port}`);
  });

})
  .catch((err) => {
    console.error('ERROR::::::' , err.stack);
    process.exit(1);
  });




// const proxy = require('http-proxy-middleware')


// nextApp.prepare().then(() => {

//   // server.use(express.json());
//   // Express에서 처리할 외부 API가 있는 경우 (middleware 등)

//   server.get('/a', (req, res) => {
//     res.send("Hello, World!");
//     // return nextApp.render(req, res, '/a', req.query);
//   });

//   server.get('/b', (req, res) => {
//     res.writeHead(200, {'Access-Control-Allow-Origin' : '*'})
//     return nextApp.render(req, res, '/b', req.query)
//   });

//   // require("./routes/indexRouter")(server, nextApp);
  
//   // * Express에서 처리한 항목 외 --> Next Js 라우팅으로 넘김
//   server.all("*", (req, res) => {
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header(
//       "Access-Control-Allow-Headers",
//       "Origin, X-Requested-With, Content-Type, Accept, Authorization"
//     );
//     return handle(req, res);
//   });


//   server.listen(port, (err) => {
//     if (err) throw err;
//     console.log(`> Server Running on http://localhost:${port}`);
//   });


// })
// .catch((ex) => {
//   console.error(ex.stack);
//   process.exit(1);
// });



