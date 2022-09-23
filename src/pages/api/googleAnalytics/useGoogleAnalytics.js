import { useAnalyticsApi, useAuthorize, useData } from 'react-use-analytics-api';
import {useEffect, useState} from 'react';


// 웹 서버 애플리케이션용 OAuth 2.0 사용 공식문서(Node.js)
// https://developers.google.com/identity/protocols/oauth2/web-server


// GA 라이브러리 문서
// https://justinmahar.github.io/react-use-analytics-api/useData

export function useGoogleAnalytics(token, diffDate = 0) {
  const { ready, gapi, authorized, error } = useAnalyticsApi();
  const [data, setData] = useState({});
  const [authorizeCalled, setAuthorizeCalled] = useState(false);
  
  const onSuccess = (res)=>{
    // console.log('Data query response:', res);
    const allDatas = res.rows;
    const todayIndex = res.rows.length -1;
    const totalUsers = allDatas.filter((data, index)=> index !== todayIndex).map((data)=>Number(data[1])).reduce((acc,cur)=>acc+cur);
    const result = {
      totalUsers,
      originData: res,
    }
    setData(result);
  }
  
  
  const authorize = useAuthorize(gapi, {
    serverAuth:{
      access_token:token,
    }
  });
  
 
  const query = {
    metrics: 'ga:users',
    dimensions: 'ga:date',
    'start-date': `${diffDate}daysAgo`, // 최근 n일 = 당일(today) 제외
    'end-date': 'today',
    ids: 'ga:'+process.env.NEXT_PUBLIC_GOOGLE_VIEWID,
  };
  
  const execute = useData(
    gapi,
    query,
    onSuccess,
    response => console.error('Data query error:', response)
  );
  
  
  
  useEffect(() => {
    // INIT
    if (ready && !error && !authorizeCalled) {
      authorize();
      setAuthorizeCalled(true);
      
    }
  }, [authorize, error, ready]);
  
  useEffect( () => {
    // UPDATE DATA
    execute();
  }, [execute, diffDate] );
  
  
  return data ;
}



