import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import React, { useEffect, useState } from 'react';


/* OAUTH 사용방법 https://github.com/MomenSherif/react-oauth#authorization-code-flow
*
* */
export default function GoogleLoginButton() {
  const [isLogin, setIsLogin] = useState(false);
  
  
  const onLogin = (credentialResponse) => {
    console.log(credentialResponse);
    const isSuccess = !!credentialResponse.clientId;
    setIsLogin(isSuccess);
    if (!isSuccess) {
      console.error('구글 로그인에 실패하였습니다.');
    } else {
      googleOauth();
    }
  };

  return (
    <>
      <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLINET_ID}>
        {!isLogin && (
          <GoogleLogin
            buttonText="구글로그인"
            onSuccess={onLogin}
            onError={() => {
              console.log('Login Failed');
            }}
            cookiePolicy={'single_host_origin'}
          />
        )}
      </GoogleOAuthProvider>
      {/*<button type={'button'} className="g-signin2" data-onsuccess="onSignIn" data-theme="dark"></button>*/}
      {/*<div id="g_id_onload"*/}
      {/*     data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}*/}
      {/*     data-callback="handleCredentialResponse">*/}
      {/*</div>*/}
      {/*<button type={'button'} className="g-signin2" data-onsuccess="onSignIn"></button>*/}
      {/*<div className="g_id_signin" data-type="standard"></div>*/}
      <div
        id="g_id_onload"
        data-client_id={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID}
        data-callback="handleCredentialResponse"
      ></div>
      <button
        type={'button'}
        className="g_id_signin"
        data-type="standard"
        data-size="large"
        data-theme="outline"
        data-text="sign_in_with"
        data-shape="rectangular"
      ></button>
    </>
  );
}

function googleOauth() {
  // Handles the authorization flow.
  // Set authorized scope.
  const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];
  const authData = {
    client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    scope: SCOPES,
    immediate: true,
  };

  gapi.auth.authorize(authData, function (response) {
    console.log(response);

    if (response.error) {
      console.error('로그인 에러가 있습니다.');
    } else {
      queryAccounts();
    }
  });
}

function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(() => {
    // Get a list of all Google Analytics accounts for this user
    console.log(gapi.client.analytics.management.accounts.list());
    gapi.client.analytics.management.accounts.list().then(handleAccounts);
  });
}

function handleAccounts(response) {
  console.log(response);
  // Handles the response from the accounts list method.
  if (response.result.items && response.result.items.length) {
    // Get the first Google Analytics account.
    const firstAccountId = response.result.items[0].id;

    // Query for properties.
    queryProperties(firstAccountId);
  } else {
    console.log('No accounts found for this user.');
  }
}

function queryProperties(accountId) {
  // Get a list of all the properties for the account.
  gapi.client.analytics.management.webproperties
    .list({ accountId: accountId })
    .then(handleProperties)
    .then(null, function (err) {
      // Log any errors.
      console.log(err);
    });
}

function handleProperties(response) {
  // Handles the response from the webproperties list method.
  if (response.result.items && response.result.items.length) {
    // Get the first Google Analytics account
    const firstAccountId = response.result.items[0].accountId;

    // Get the first property ID
    const firstPropertyId = response.result.items[0].id;

    // Query for Views (Profiles).
    queryProfiles(firstAccountId, firstPropertyId);
  } else {
    console.log('No properties found for this user.');
  }
}

function queryProfiles(accountId, propertyId) {
  // Get a list of all Views (Profiles) for the first property
  // of the first Account.
  gapi.client.analytics.management.profiles
    .list({
      accountId: accountId,
      webPropertyId: propertyId,
    })
    .then(handleProfiles)
    .then(null, function (err) {
      // Log any errors.
      console.log(err);
    });
}

function handleProfiles(response) {
  // Handles the response from the profiles list method.
  if (response.result.items && response.result.items.length) {
    // Get the first View (Profile) ID.
    const firstProfileId = response.result.items[0].id;
    // Query the Core Reporting API.
    queryCoreReportingApi(firstProfileId);
  } else {
    console.log('No views (profiles) found for this user.');
  }
}

function queryCoreReportingApi(profileId) {
  // Query the Core Reporting API for the number sessions for
  // the past seven days.
  gapi.client.analytics.data.ga
    .get({
      ids: 'ga:' + profileId,
      // ## 조회 시작일자
      'start-date': '2020-03-03',
      // ## 조회 마지막일자
      'end-date': '2020-03-09',
      // ##  -- 사용자, 신규 방문자, 세션, 이탈률, 평균세션시간(초), 페이지뷰 수, 세션당 페이지수, 사용자당 세션 수
      metrics:
        'ga:users,ga:newUsers,ga:sessions,ga:bounceRate,ga:avgSessionDuration,ga:pageviews,ga:pageviewsPerSession,ga:sessionsPerUser',
      // ##  -- 소스 , 매체
      dimensions: 'ga:source,ga:medium',
    })
    .then(function (response) {
      const formattedJson = JSON.stringify(response.result, null, 2);
      document.getElementById('query-output').value = formattedJson;
    })
    .then(null, function (err) {
      // Log any errors.
      console.log(err);
    });
}
