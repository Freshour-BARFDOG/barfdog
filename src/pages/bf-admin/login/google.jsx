import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useAnalyticsApi, useAuthorize, useSignOut } from 'react-use-analytics-api';
import { GoogleLogin, GoogleOAuthProvider, useGoogleLogin } from '@react-oauth/google';
import { google } from 'googleapis';

export default function GoogleLoginPage(props) {
  const { ready, gapi, authorized, error } = useAnalyticsApi();
  const [authorizeCalled, setAuthorizeCalled] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const authDiv = React.useRef(null);

  const authorize = useAuthorize(gapi, {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    container: 'authorize-container-id',
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
    console.log('credentialResponse: ', credentialResponse);
    const isSuccess = !!credentialResponse.clientId;
    setIsLogin(isSuccess);
    if (!isSuccess) {
      alert('구글 로그인에 실패하였습니다.');
    } else {
      // startGapi();
    }
  };

  const startGapi = () => {
    const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
    gapi.client.init({
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
      scope: SCOPES,
    });
    console.log(gapi.client);
  };

  return (
    <>
      <MetaTitle title="구글 로그인" admin={true} />
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}>
        {!isLogin && (
          <GoogleLogin
            onSuccess={onLogin}
            onError={() => {
              console.log('Login Failed');
            }}
            type={'icon'}
            size={'small'}
            shape={'circle'}
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
    </>
  );
}

export async function getServerSideProps() {
  /**
   * To use OAuth2 authentication, we need access to a CLIENT_ID, CLIENT_SECRET, AND REDIRECT_URI
   * from the client_secret.json file. To get these credentials for your application, visit
   * https://console.cloud.google.com/apis/credentials.
   */

  const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
  const redir_URL = 'http://localhost:4000/bf-admin/dashboard';

  const oauth2Client = new google.auth.OAuth2(clientId, client_secret, redir_URL);

  // Access scopes for read-only Drive activity.
  const scopes = ['https://www.googleapis.com/auth/drive.metadata.readonly'];

  // Generate a url that asks permissions for the Drive activity scope
  const authorizationUrl = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
    /** Pass in the scopes array defined above.
     * Alternatively, if only one scope is needed, you can pass a scope URL as a string */
    scope: scopes,
    // Enable incremental authorization. Recommended as a best practice.
    include_granted_scopes: true,
  });

  console.log('authorizationUrl', authorizationUrl);

  if (authorizationUrl) {
    return {
      redirect: {
        destination: authorizationUrl,
        permanent: false,
      },
    };
  }
  // console.log(res);
  return {};
}
