import "/styles/global/global.scss";
import axios from 'axios';
axios.defaults.baseURL = process.env.NEXT_PUBLIC_SERVER_BASE_URL;
// axios.defaults.headers.common["Authorization"] = 'AUTH_TOKEN';
axios.defaults.headers.post["Content-Type"] =
axios.defaults.headers.post["Content-Type"] =
"application/x-www-form-urlencoded";
 axios.defaults.withCredentials = true;
// console.log('BASE URL : ',axios.defaults.baseURL);






// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : 최초실행
//👉 공통된 Data Fetching이 필요하다면 _app.js에 getInitialProps를 붙이면 된다.


// import axios from "axios";

// const Page = ({ stars }) => {
//   return <div> stars: {stars} </div>;
// };

// Page.getInitialProps = async (ctx) => {
// 해당 페이지에 getInitialProps를 사용해서 data를 받아온다
//   const { data } = await axios.get("...url");

//   return { stars: data };
// };

// export default Page;



function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />
}

export default MyApp;