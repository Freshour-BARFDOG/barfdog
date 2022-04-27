const dev = process.env.NODE_ENV !== "production";
const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  console.log(dev);
  if(dev){
    app.use(
      "/api",
      createProxyMiddleware({
        target: "http://211.219.225.118:9999",
        changeOrigin: true,
        pathRewrite: {
          "^/api": "/api", // URL ^/api -> 공백 변경
        },
      })
    );
  }

};
