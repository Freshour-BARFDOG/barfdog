// const dev = process.env.NODE_ENV !== "production";
// const { createProxyMiddleware } = require("http-proxy-middleware");
//
// module.exports = function (app) {
//   if(dev){
//     app.use(
//       "/api/*",
//       createProxyMiddleware({
//         target: "http://211.219.225.118:9999",
//         changeOrigin: true,
//         // pathRewrite: {
//         //   "^/api": "/api",
//         //   // axios또는 fetch 설정 시 --> api는 '' 공백으로 대체되어 호출하게 된다.
//         // },
//       }));
//   }
//
// };
