import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import LineChart from '/src/components/admin/dashboard/LineChart';
import s from './dashboard.module.scss';
import ToolTip from '/src/components/atoms/Tooltip';
import SelectTag from '/src/components/atoms/SelectTag';
import Spinner from '/src/components/atoms/Spinner';
import { getData } from '/src/pages/api/reqData';
import transformDate, { transformToday } from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { googleOauth } from '/src/pages/api/googleAnalytics/googleOAuth';
import axios from "axios";



export default function DashboardPage() {
  const initialTerm = {
    from: transformToday(),
    to: transformToday(),
    diffDate: 1, // 통계 검색 기간: 1, 7, 30 , 365일
  };
  
  const [term, setTerm] = useState(initialTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState({});
  
  useEffect(() => {
    // 기간에 따른 통계 update
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        const url = `/api/admin/dashBoard?from=${term.from}&to=${term.to}`;
        const res = await getData(url);
        let DATA;
        // const res = DUMMY_RESPONSE; // TEST
        if (res.data) {
          const data = res.data;
          DATA = {
            statistics: {
              newOrderCount: data.newOrderCount || 0,
              newMemberCount: data.newMemberCount || 0,
              visitorCount: 0, // ! ------------------- GOOGLE ANALYTICS 연결필요 -------------------
            },
            orderCount: {
              PAYMENT_DONE:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.PAYMENT_DONE,
                  )[0]?.count) ||
                0,
              FAILED:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.FAILED,
                  )[0]?.count) ||
                0,
              SUBSCRIBE_PENDING: data.orderStatusCountDtoList.length && data.subscribePendingCount,
              DELIVERY_START:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.DELIVERY_START,
                  )[0]?.count) ||
                0,
              CANCEL_REQUEST:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.CANCEL_REQUEST,
                  )[0]?.count) ||
                0,
              RETURN_REQUEST:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.RETURN_REQUEST,
                  )[0]?.count) ||
                0,
              EXCHANGE_REQUEST:
                (data.orderStatusCountDtoList.length &&
                  data.orderStatusCountDtoList?.filter(
                    (order) => order.orderstatus === orderStatus.EXCHANGE_REQUEST,
                  )[0]?.count) ||
                0,
            },
            newOrderInfo: {
              general:
                data.generalOrderCountByMonthList.map((l) => l.generalCount).length > 0
                  ? data.generalOrderCountByMonthList
                      .map((l) => l.generalCount)
                      .reduce((acc, cur) => acc + cur)
                  : 0,
              subscribe:
                data.subscribeOrderCountByMonthList.map((l) => l.subscribeCount).length > 0
                  ? data.subscribeOrderCountByMonthList
                      .map((l) => l.subscribeCount)
                      .reduce((acc, cur) => acc + cur)
                  : 0,
            },
            chart: {
              general: data.generalOrderCountByMonthList.map((list) => ({
                x: list.month,
                y: list.generalCount,
              })),
              subscribe: data.subscribeOrderCountByMonthList.map((list) => ({
                x: list.month,
                y: list.subscribeCount,
              })),
            },
          };
        }

  
  
  
        setIsLoading((prevState) => ({
          ...prevState,
          ga: true,
        }));
        const visitorCount = 0;
        DATA = {
          ...DATA,
          statistics: {
            ...DATA.statistics,
            visitorCount: visitorCount,
          },
        };

        setInfo(DATA);
  
  
        // ! ------------------------------------------------------------------------------------------------
        // ! init Google Analytics
  
  
        await GA_analyticsAuth();
  
  
        // ! ------------------------------------------------------------------------------------------------
        // ! init Google Analytics
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [term]);

  const onChangeSelectHandler = (value) => {
    const today = new Date(transformToday());
    const diffDate = Number(value);
    const curDate = today.getDate();
    const prevDate = new Date(today.setDate(curDate - diffDate)).toISOString();
    setTerm({
      from: transformDate(prevDate),
      to: transformToday(),
      diffDate: diffDate,
    });
  };

  useEffect(() => {
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
 
    //
    // (async ()=>{
    //   try {
    //     const res = await axios({
    //       method: 'GET',
    //       url: 'https://www.googleapis.com/analytics/v3/data/ga?access_token=ya29.a0Aa4xrXOXHKivaWkRIMFAM7_X54p5jdRZhiq3-CGLeWIXOThwTsDdf2pZ8wQampD_OpsACLEFHuPUh6c4F5eX5-32GmVGsxrC-bDcz9QiIA3oti1QZaIt0idowOhdsnEbIZh0eCjQf0JoL-D1IK2Uu_5S33YdEgaCgYKATASARESFQEjDvL9iIhdt6p4yPYDV609wlnXsw0165&ids=ga%3A268912152&metrics=ga%3Ausers&start-date=111daysAgo&end-date=yesterday',
    //     })
    //     console.log(res);
    //   } catch (err) {
    //       console.error(err)
    //   }
    // })();
  
   
    
  }, [isLoading.fetching]);

  const GA_analyticsAuth = async ()=>{
    // ! Oauth 실행하기 ==>
    gapi.analytics.auth.authorize({
      container: 'auth-button',
      clientid: '614732998882-qdvb0g5nuptdpd2c5nftfh4v4ac2mnp9.apps.googleusercontent.com',
    });
    
  }
  
  function queryReports() {
    const VIEW_ID = '268912152'; // ! TEST => 바프독 viewId로 변경하기
    console.log('queryReports 실행')
    gapi.client.request({
      path: '/v4/reports:batchGet',
      root: 'https://analyticsreporting.googleapis.com/',
      method: 'POST',
      body: {
        reportRequests: [
          {
            viewId: VIEW_ID,
            dateRanges: [
              {
                startDate: '7daysAgo',
                endDate: 'today'
              }
            ],
            metrics: [
              {
                name: "activeUsers",
                expression: 'ga:sessions'
              }
            ]
          }
        ]
      }
    }).then(displayResults, console.error.bind(console));
  }
  
  function displayResults(response) {
    console.log(response)
    const formattedJson = JSON.stringify(response.result, null, 2);
    console.log('formattedJson: ',formattedJson)
    document.getElementById('query-output').value = formattedJson;
  }
  
  const googleLogin = () => {
    googleOauth();
  };

  return (
    <>
      
      <meta name="google-signin-client_id" content="614732998882-qdvb0g5nuptdpd2c5nftfh4v4ac2mnp9.apps.googleusercontent.com"/>
      <meta name="google-signin-scope" content="https://www.googleapis.com/auth/analytics.readonly"/>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            (function(w,d,s,g,js,fjs){
              g=w.gapi||(w.gapi={});g.analytics={q:[],ready:function(cb){this.q.push(cb)}};
              js=d.createElement(s);fjs=d.getElementsByTagName(s)[0];
              js.src='https://apis.google.com/js/platform.js';
              fjs.parentNode.insertBefore(js,fjs);js.onload=function(){g.load('analytics')};
            }(window,document,'script'));
          `,
        }}
      />
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper className={s.wrapper}>
          <h1 className={`${s['title']} title_main`}>
            {isLoading.fetching ? <Spinner /> : '대시보드'}
          </h1>
          
          <section className={`${s['cont-top']} cont`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>
                주문현황
                <ToolTip
                  message={'배송완료 및 주문완료된 주문을 제외한 주문리스트'}
                  theme={'white'}
                  messagePosition={'left'}
                  className={s.tooltip}
                />
              </h2>
              {/* ! --------TEST-------TEST*/}
              <p id="auth-button" data-onsuccess="googleLogin"></p>
              <p className="g-signin2" data-onsuccess="queryReports"></p>
            </div>
            <div className={s['cont-section']}>
              <ul className={s.box}>
                <li>
                  <span>결제완료</span>
                  <span>
                    <b>{info.orderCount?.PAYMENT_DONE}</b> 건
                  </span>
                </li>
                <li>
                  <span>결제실패</span>
                  <span>
                    <b>{info.orderCount?.FAILED}</b> 건
                  </span>
                </li>
                <li>
                  <span>구독보류</span>
                  <span>
                    <b>{info.orderCount?.SUBSCRIBE_PENDING}</b> 건
                  </span>
                </li>
              </ul>
              <ul className={s.box}>
                <li>
                  <span>배송중</span>
                  <span>
                    <b>{info.orderCount?.DELIVERY_START}</b> 건
                  </span>
                </li>
              </ul>
              <ul className={s.box}>
                <li>
                  <span>반품요청</span>
                  <span>
                    <b>{info.orderCount?.RETURN_REQUEST}</b> 건
                  </span>
                </li>
                <li>
                  <span>교환요청</span>
                  <span>
                    <b>{info.orderCount?.EXCHANGE_REQUEST}</b> 건
                  </span>
                </li>
                <li>
                  <span>취소요청</span>
                  <span>
                    <b>{info.orderCount?.CANCEL_REQUEST}</b> 건
                  </span>
                </li>
              </ul>
            </div>
          </section>
          <section className={`cont ${s['cont-left']}`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>통계</h2>
              <SelectTag
                name={'period'}
                id={'new-order'}
                className={s['select-period']}
                initialValue={term.diffDate}
                onChange={onChangeSelectHandler}
                options={[
                  { label: '최근 1일', value: 1 },
                  { label: '최근 7일', value: 7 },
                  { label: '최근 30일', value: 30 },
                  { label: '최근 1년', value: 365 },
                ]}
                style={{ width: '90px', minWidth: 'auto' }}
              />
            </div>
            <div className={s['cont-section']}>
              <ul className={s.box}>
                <li>
                  <span>신규주문</span>
                  <div>
                    <span>
                      <b>{info.statistics?.newOrderCount}</b>건
                    </span>
                  </div>
                </li>
                <li>
                  <span>신규가입</span>
                  <div>
                    <span>
                      <b>{info.statistics?.newMemberCount}</b>건
                    </span>
                  </div>
                </li>
                <li>
                  <span>방문자수</span>
                  <div>
                    <span>
                      <b>{isLoading.fetching ? <Spinner /> : `${info.statistics?.visitorCount}`}</b>
                      건
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section className={`cont ${s['cont-right']}`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>
                주문량
                <ToolTip
                  message={'통계섹션에서 선택된 기간에 따른 월별 주문수의 총합'}
                  theme={'white'}
                  messagePosition={'left'}
                  className={s.tooltip}
                />
              </h2>
            </div>
            <div className={s['cont-section']}>
              <div className={s['payment-info']}>
                <ul>
                  <li>
                    <span>일반결제</span>
                    <span>
                      <b>{info.newOrderInfo?.general}</b>건
                    </span>
                  </li>
                  <li>
                    <span>정기결제</span>
                    <span>
                      <b>{info.newOrderInfo?.subscribe}</b>건
                    </span>
                  </li>
                </ul>
              </div>
              <LineChart chartData={info.chart} />
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

export async function getServerSideProps(ctx) {
  return {
    props: {},
  };
}

// const DUMMY_RESPONSE = {
//   data: {
//     newOrderCount: 21,
//     newMemberCount: 4,
//     subscribePendingCount: 9,
//     orderStatusCountDtoList: [
//       {
//         orderstatus: 'CANCEL_REQUEST',
//         count: 4,
//       },
//       {
//         orderstatus: 'DELIVERY_START',
//         count: 3,
//       },
//       {
//         orderstatus: 'EXCHANGE_REQUEST',
//         count: 6,
//       },
//       {
//         orderstatus: 'FAILED',
//         count: 1,
//       },
//       {
//         orderstatus: 'PAYMENT_DONE',
//         count: 2,
//       },
//       {
//         orderstatus: 'RETURN_REQUEST',
//         count: 5,
//       },
//     ],
//     generalOrderCountByMonthList: [
//       {
//         month: '2022-05',
//         generalCount: 2,
//       },
//       {
//         month: '2022-06',
//         generalCount: 3,
//       },
//       {
//         month: '2022-07',
//         generalCount: 12,
//       },
//     ],
//     subscribeOrderCountByMonthList: [
//       {
//         month: '2022-05',
//         subscribeCount: 2,
//       },
//       {
//         month: '2022-06',
//         subscribeCount: 5,
//       },
//       {
//         month: '2022-07',
//         subscribeCount: 3,
//       },
//     ],
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/admin/dashBoard',
//       },
//       profile: {
//         href: '/docs/index.html#resources-admin-dashBoard',
//       },
//     },
//   },
// };
//
//
//
