import { useAnalyticsApi, useAuthorize, useData } from 'react-use-analytics-api';
import {useEffect, useState} from 'react';

export function useGoogleAnalytics(props) {
  const { ready, gapi, authorized, error } = useAnalyticsApi();
  const [data, setData] = useState({});

  const authorize = useAuthorize(gapi, {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    container: 'authorize-container-id',
  });
  useEffect(() => {
    if (ready && !error) {
      gapi.client.load('analytics', 'v3').then(() => {
        // Get a list of all Google Analytics accounts for this user
        console.log(gapi.client.analytics.management.accounts.list());
        gapi.client.analytics.management.accounts.list().then();
      });
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
  }, [authorize, error, ready]);

  return data;
}
