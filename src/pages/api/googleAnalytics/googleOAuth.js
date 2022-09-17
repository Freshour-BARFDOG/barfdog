export function googleOauth() {
  // Handles the authorization flow.
  // `immediate` should be false when invoked from the button click.
  const CLIENT_ID = '977291702808-drjsc474igbigifrjsq2kbm0endo7o6p.apps.googleusercontent.com'; // <-- 발급받은 Client ID 입력 (ClientID발급: https://console.cloud.google.com/)

  // Set authorized scope.
  const SCOPES = ['https://www.googleapis.com/auth/analytics.readonly'];

  const authData = {
    client_id: CLIENT_ID,
    scope: SCOPES,
    immediate: false,
  };

  gapi.auth.authorize(authData, function (response) {
    console.log(response);

    if (response.error) {
      alert('로그인 에러가 있습니다.');
    } else {
      queryAccounts();
    }
  });
}

function queryAccounts() {
  // Load the Google Analytics client library.
  gapi.client.load('analytics', 'v3').then(function () {
    // Get a list of all Google Analytics accounts for this user
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
