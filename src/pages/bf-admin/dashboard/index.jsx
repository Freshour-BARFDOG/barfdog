import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import LineChart, { data } from '/src/components/admin/dashboard/LineChart';
import s from './dashboard.module.scss';
import ToolTip from '/src/components/atoms/Tooltip';
import SelectTag from '/src/components/atoms/SelectTag';
import Spinner from '/src/components/atoms/Spinner';
import { getData } from '/src/pages/api/reqData';
import { transformToday } from '/util/func/transformDate';
import {orderStatus} from "/store/TYPE/orderStatusTYPE";

export default function DashboardPage() {
  // 관리자 페이지 관련
  // /api/admin/dashBoard?from=2022-07-19&to=2022-07-26

  const initialTerm = {
    from: transformToday(),
    to: transformToday(),
  };
  // 1일,  7일 ,30일, 전체
  const [term, setTerm] = useState(initialTerm);
  const [isLoading, setIsLoading] = useState(false);
  const [info, setInfo] = useState( {} );
  
  console.log(info)
  useEffect(() => {
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        const url = `/api/admin/dashBoard?from=${term.from}&to=${term.to}`;
        // const res = await getData(url);
        const res = DUMMY_RESPONSE;

        if (res.data) {
          const data = res.data;
          const DATA = {
            statistics:{
              newOrderCount: data.newOrderCount,
              newMemberCount:data.newMemberCount,
              visitorCount: 0,  // ! ------------------- GOOGLE ANALYTICS 연결필요 -------------------
            },
            orderCount: {
              PAYMENT_DONE: data.orderStatusCountDtoList.length && data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.PAYMENT_DONE)[0]?.count || 0,
              FAILED: data.orderStatusCountDtoList.length && data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.FAILED)[0]?.count || 0,
              SUBSCRIBE_PENDING: data.orderStatusCountDtoList.length &&data.subscribePendingCount,
              DELIVERY_START: data.orderStatusCountDtoList.length &&data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.DELIVERY_START)[0]?.count || 0,
              CANCEL_REQUEST: data.orderStatusCountDtoList.length &&data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.CANCEL_REQUEST)[0]?.count || 0,
              RETURN_REQUEST: data.orderStatusCountDtoList.length &&data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.RETURN_REQUEST)[0]?.count || 0,
              EXCHANGE_REQUEST: data.orderStatusCountDtoList.length &&data.orderStatusCountDtoList?.filter(order=>order.orderstatus === orderStatus.EXCHANGE_REQUEST)[0]?.count || 0,
            },
            orderInfo: {
              general: data.generalOrderCountByMonthList.map(l=>l.generalCount).length > 0 ? data.generalOrderCountByMonthList.map(l=>l.generalCount).reduce((acc, cur)=>acc+cur) : 0,
              subscribe: data.subscribeOrderCountByMonthList.map(l=>l.subscribeCount).length > 0 ? data.subscribeOrderCountByMonthList.map(l=>l.subscribeCount).reduce((acc, cur)=>acc+cur) : 0,
            },
            graph:{
              general: data.generalOrderCountByMonthList.map((list)=>({month:list.month, count:list.generalCount})),
              subscribe: data.subscribeOrderCountByMonthList.map((list)=>({month:list.month, count:list.subscribeCount})),
            },
          };
          setInfo(DATA);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
    
    
  }, [term]);
  
  const onChangeSelectHandler = (value, id)=>{
  // calc before day
    const today = new Date(transformToday());
    const prevDay = Number(value);
    console.log(today)
    console.log(today.getDate());
    
    
  }


  return (
    <>
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
                      <b>{info.statistics?.visitorCount}</b>건
                    </span>
                  </div>
                </li>
              </ul>
            </div>
          </section>
          <section className={`cont ${s['cont-right']}`}>
            <div className={s['title-section']}>
              <h2 className={s.title}>
                신규주문
                <ToolTip
                  message={'Google Analytics 데이터를 기반으로 한 통계입니다.'}
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
                      <b>{info.orderInfo?.general}</b>건
                    </span>
                  </li>
                  <li>
                    <span>정기결제</span>
                    <span>
                      <b>{info.orderInfo?.subscribe}</b>건
                    </span>
                  </li>
                </ul>
              </div>
              {/*<LineChart chartData={info.orderInfo?.graph} />*/}
            </div>
          </section>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}

const DUMMY_RESPONSE = {
  data: {
    newOrderCount: 21,
    newMemberCount: 4,
    subscribePendingCount: 9,
    orderStatusCountDtoList: [
      {
        orderstatus: 'CANCEL_REQUEST',
        count: 4,
      },
      {
        orderstatus: 'DELIVERY_START',
        count: 3,
      },
      {
        orderstatus: 'EXCHANGE_REQUEST',
        count: 6,
      },
      {
        orderstatus: 'FAILED',
        count: 1,
      },
      {
        orderstatus: 'PAYMENT_DONE',
        count: 2,
      },
      {
        orderstatus: 'RETURN_REQUEST',
        count: 5,
      },
    ],
    generalOrderCountByMonthList: [
      {
        month: '2022-05',
        generalCount: 2,
      },
      {
        month: '2022-04',
        generalCount: 3,
      },
      {
        month: '2022-07',
        generalCount: 12,
      },
    ],
    subscribeOrderCountByMonthList: [
      {
        month: '2022-05',
        subscribeCount: 2,
      },
      {
        month: '2022-06',
        subscribeCount: 5,
      },
      {
        month: '2022-07',
        subscribeCount: 3,
      },
    ],
    _links: {
      self: {
        href: 'http://localhost:8080/api/admin/dashBoard',
      },
      profile: {
        href: '/docs/index.html#resources-admin-dashBoard',
      },
    },
  },
};
