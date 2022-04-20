const express = require("express");
const next = require("next");
const port = parseInt(process.env.PORT, 10) || 4000;
const dev = process.env.NODE_ENV !== "production";

const app = next({ dev });
const handle = app.getRequestHandler();


app.prepare().then(() => {
    const server = express();
    // server.use(express.json());

    // Express에서 처리할 외부 API가 있는 경우 (middleware 등)
    server.get('/a', (req, res) => {
      return app.render(req, res, '/a', req.query);
    });

    server.get('/b', (req, res) => {
      return app.render(req, res, '/b', req.query)
    });

    // require("./routes/indexRouter")(server, app);

    // Express에서 처리한 항목 외 --> Next Js 라우팅으로 넘김
    server.all("*", (req, res) => {
      return handle(req, res);
    });


    server.listen(port, (err) => {
      console.log(port);
      if (err) throw err;
      console.log("> Ready on http://localhost:" + port);
    });
  })
  .catch((ex) => {
    console.error(ex.stack);
    process.exit(1);
  });
