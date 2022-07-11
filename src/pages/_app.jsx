import {Provider} from "react-redux";
import store from "@store/index";
import "@styles/global/global.scss";
import AuthInterceptor from "@store/auth-interceptor";
import '/src/pages/api/axios.config';
import {ModalContextProvider} from '@store/modal-context';
import ChannelTalkProvider from "/src/pages/api/channelTalk/ChannelTalkProvider";
import GAProvider from "/src/pages/api/googleAnalytics/GAProvider";

// Server Only File (client에서 사용하는 로직 사용불가)
// Next JS : 최초실행
//👉 공통된 Data Fetching이 필요하다면 _app.js에 getInitialProps를 붙이면 된다.

function MyApp({Component, pageProps}) {

  return (
    <GAProvider>
      <Provider store={store}>
        <AuthInterceptor>
          <ChannelTalkProvider>
            <ModalContextProvider>
              <Component {...pageProps} />
            </ModalContextProvider>
          </ChannelTalkProvider>
        </AuthInterceptor>
      </Provider>
    </GAProvider>
  );
}

export default MyApp;