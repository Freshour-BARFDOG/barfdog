import { Provider } from "react-redux";
import store from "@store/index";
import "@styles/global/global.scss";
import AuthInterceptor from "@util/hook/auth-interceptor";
import apiSet from '@api/axios.config'


// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : 최초실행
//👉 공통된 Data Fetching이 필요하다면 _app.js에 getInitialProps를 붙이면 된다.


function MyApp({ Component, pageProps }) {

  return (
    <Provider store={store}>
      <AuthInterceptor>
        <Component {...pageProps} />
      </AuthInterceptor>
    </Provider>
  );
}

export default MyApp;