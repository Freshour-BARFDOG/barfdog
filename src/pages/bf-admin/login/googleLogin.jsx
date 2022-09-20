import React, {useEffect, useState} from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import {useAnalyticsApi, useAuthorize, useSignOut} from "react-use-analytics-api";
import {GoogleLogin, GoogleOAuthProvider, useGoogleLogin} from "@react-oauth/google";

export default function GoogleLoginPage (props) {
  
  const { ready, gapi, authorized, error } = useAnalyticsApi();
  const [authorizeCalled, setAuthorizeCalled] = useState( false );
  const [isLogin, setIsLogin] = useState(false);
  
  const authDiv = React.useRef(null);


  
  const authorize = useAuthorize(gapi, {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    container: "authorize-container-id",
  });
  useEffect(() => {
    if (ready && !error && !authorizeCalled) {
      authorize();
      setAuthorizeCalled(true);
    }
    // ! GA: Analytics > Reporting > Reporting API v4 > Reporting API v4
    // init google Oauth : GA를 사용하기 위한 Oauth
    // const GA_init = document.createElement('script');
    // GA_init.src = 'https://apis.google.com/js/api.js';
    // GA_init.type = 'text/javascript';
    //
    // const GA_Oauth = document.createElement('script');
    // GA_Oauth.src = 'https://apis.google.com/js/client.js?onload=authorize';
    // GA_Oauth.type = 'text/javascript';
    //
    // document.head.appendChild(GA_init);
    // document.head.appendChild(GA_Oauth);
    
  }, [authorize, authorizeCalled, error, ready]);
  
  
  const onLogin = (credentialResponse) => {
    console.log('credentialResponse: ',credentialResponse);
    const isSuccess = !!credentialResponse.clientId;
    setIsLogin(isSuccess);
    if (!isSuccess) {
      console.error('구글 로그인에 실패하였습니다.');
    } else {
      console.log('시작하자');
      
      
    }
  };
  
  const onScriptLoadSuccess = () => {
    console.log('onScriptLoadSuccess')
  }
  
  const onScriptLoadError = () => {
    console.log('onScriptLoadError');
    window.location.reload();
  }
  
  return <>
    <MetaTitle title="구글 로그인" admin={true} />
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID} onScriptLoadSuccess={onScriptLoadSuccess} onScriptLoadError={onScriptLoadError}>
      {!isLogin && (
        <GoogleLogin
          type={'icon'}
          size={'small'}
          shape={'circle'}
          onSuccess={onLogin}
          onError={() => {
            console.log('Login Failed');
          }}
          cookiePolicy={'single_host_origin'}
          useOneTap
          auto_select /* 자동 로그인 기능*/
        />
      )}
      <div id="authorize-container-id" ref={authDiv} />
    </GoogleOAuthProvider>
      {/*<script*/}
      {/*  dangerouslySetInnerHTML={{*/}
      {/*    __html: `*/}
      {/*      (function(w,d,s,g,js,fjs){*/}
      {/*        g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};*/}
      {/*        js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];*/}
      {/*        js.src='https://apis.google.com/js/platform.js';*/}
      {/*        js.async=true;*/}
      {/*        fjs.parentNode.insertBefore(js,fjs);*/}
      {/*        js.onload=function(){g.load('analytics')};*/}
      {/*      }(window,document,'script'));*/}
      {/*    `,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<script src="https://accounts.google.com/gsi/client" async defer onLoad={googleLoaded}></script>*/}
      {/*<script*/}
      {/*  dangerouslySetInnerHTML={{*/}
      {/*    __html: `*/}
      {/*      (function(w,d,s,g,js,fjs){*/}
      {/*        js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];*/}
      {/*        js.src='https://accounts.google.com/gsi/client';*/}
      {/*        js.async=true;*/}
      {/*        fjs.parentNode.insertBefore(js,fjs);*/}
      {/*      }(window,document,'script'));*/}
      {/*    `,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*<meta*/}
      {/*  name="google-signin-client_id"*/}
      {/*  content={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}*/}
      {/*/>*/}
      {/*<GoogleLoginButton/>*/}
     
    </>;
}