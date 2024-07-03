import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import AdminLayout from '/src/components/admin/AdminLayout';
import { AdminContentWrapper } from '/src/components/admin/AdminWrapper';
import LineChart from '/src/components/admin/dashboard/LineChart';
import s from './dashboard.module.scss';
import ToolTip from '/src/components/atoms/Tooltip';
import SelectTag from '/src/components/atoms/SelectTag';
import Spinner from '/src/components/atoms/Spinner';
import { getCookieSSR, getData } from '/src/pages/api/reqData';
import transformDate, { transformToday } from '/util/func/transformDate';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { useGoogleAnalytics } from '/src/pages/api/googleAnalytics/useGoogleAnalytics';
import { getGoogleAuthUrl } from '/src/pages/api/googleAnalytics/getGoogleAuthUrl';
import { cookieType } from '/store/TYPE/cookieType';
import { deleteCookie, setCookie } from '/util/func/cookie';
import { useRouter } from 'next/router';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { inquiryStatusType } from '/store/TYPE/inquiry/inquiryStatusType';
import { filterObjectKeys } from '/util/func/filter/filterTypeFromObejct';
import { IndicateDot } from '../../../components/icon/indicateDot';
import SearchBar from '/src/components/admin/form/searchBar';
import SearchRadio from '/src/components/admin/form/searchBar/SearchRadio';
import SearchDateTime from '/src/components/admin/form/searchBar/SearchDateTime';
import SearchTextWithCategory from '/src/components/admin/form/searchBar/SearchTextWithCategory';
import dayjs from 'dayjs';
import RevenueChart from '/src/components/admin/dashboard/RevenueChart';
import SubCancelPieChart from '../../../components/admin/dashboard/SubCancelPieChart';
import SubscriberByRecipePieChart from '../../../components/admin/dashboard/SubscriberByRecipePieChart';
import SubscriberByPlanPieChart from '../../../components/admin/dashboard/SubscriberByPlanPieChart';
import MemberChart from '../../../components/admin/dashboard/MemberChart';
import SearchTermRadio from '../../../components/admin/form/searchBar/SearchTermRadio';
import OrderCountChart from '../../../components/admin/dashboard/OrderCountChart';
import SalesByRecipePieChart from '../../../components/admin/dashboard/SalesByRecipePieChart';
import popupWindow from '@util/func/popupWindow';
import Link from 'next/link';
import SubscribeSumGramByRecipe from '../../../components/admin/dashboard/SubscribeSumGramByRecipe';

export default function DashboardPage({ ga }) {
  const now = dayjs();
  const yesterday = now.subtract(1, 'day');

  const initialDate = {
    // from: dayjs('2000-01-01T00:00:00').format('YYYY-MM-DD-HH-mm'),
    //! default (오늘)
    from: now.format('YYYY-MM-DD') + '-00-00', // 1일 전
    to: now.format('YYYY-MM-DD-HH-mm'), // 오늘
    term: 'day',
  };

  const router = useRouter();

  const [date, setDate] = useState(initialDate);
  const [salesByRecipeZero, setSalesByRecipeZero] = useState(false);

  const [isLoading, setIsLoading] = useState({
    fetching: false,
    ga: false,
  });
  const [isGraphLoading, setIsGraphLoading] = useState(false);
  const [info, setInfo] = useState({});
  const [recipeInfo, setRecipeList] = useState({});
  const googleApiToken = ga?.token;
  // const gaData = useGoogleAnalytics(googleApiToken, term.diffDate);

  useEffect(() => {
    // Google Analytics DATA
    // URL에 TOKEN있을 경우, Cookie 저장 => 쿠키 숨김처리
    const googleApiTokenInUrl = router.query?.token;
    if (googleApiTokenInUrl) {
      setCookie(
        cookieType.GOOGLE_ANALYTICS_TOKEN,
        googleApiToken,
        'sec',
        ga.expires_in || 3600,
      );
      window.location.search = '';
    }
    // 토큰있을 경우에만 > info > googla analytics TotalUser 업데이트
    if (!googleApiToken) return;

    // setInfo((data) => ({
    //   ...data,
    //   statistics: {
    //     ...data.statistics,
    //     visitorCount: gaData?.totalUsers || '-',
    //   },
    // }));

    setIsLoading((prev) => ({
      ...prev,
      ga: false,
    }));
  }, [router]);
  // }, [router, gaData]);

  const fetchData = async (graphInterval) => {
    try {
      const url = `/api/admin/dashBoard/stats?from=${date.from}&to=${date.to}&graphInterval=${graphInterval}`;
      const res = await getData(url);
      let DATA;
      // console.log('res.data~~~~~', res);

      // 레시피 리스트 GET
      const getRecipeInfoApiUrl = '/api/recipes';
      const recipeInfoResponse = await getData(getRecipeInfoApiUrl, 'admin');
      const recipeInfo =
        recipeInfoResponse.data?._embedded?.recipeListResponseDtoList;
      setRecipeList(recipeInfo);

      // console.log('res.recipeInfo!!!!!!', recipeInfo);

      if (res.data) {
        const data = res.data;
        // console.log('응답 성공~~~~~', res.data);

        // ### 레시피별 매출액 없음 ###
        const isSalesByRecipeZero =
          Array.isArray(data.salesByRecipeDtoList) &&
          data.salesByRecipeDtoList.every((item) => item.sales === 0);
        setSalesByRecipeZero(isSalesByRecipeZero);

        // ### 레시피별 구독자 수 카운팅 ###
        const recipeCount = {};

        data.subscribeStatsDto.subscriberByRecipeDtoList.forEach((recipe) => {
          const names = recipe.recipeName
            .split(', ')
            .map((name) => name.trim());
          names.forEach((name) => {
            if (!recipeCount[name]) {
              recipeCount[name] = 0;
            }
            recipeCount[name] += recipe.count;
          });
        });

        // ### 현재 구독자 레시피별 한 끼 무게 총합 ###
        let matchedSumGramByRecipeResult = [];
        let seenRecipes = new Set(); // 중복제거

        recipeInfo.forEach((recipe) => {
          data.subscribeStatsDto.subscribeSumGramByRecipeDtoList.forEach(
            (item) => {
              if (
                item.recipeName === recipe.name &&
                !seenRecipes.has(recipe.name)
              ) {
                matchedSumGramByRecipeResult.push({
                  recipeName: recipe.name,
                  sum: item.sum,
                });
                seenRecipes.add(recipe.name);
              }
            },
          );
        });

        DATA = {
          from: data.from,
          to: data.to,
          totalOrderCount: data.totalOrderCount,
          totalSales: data.totalSales,
          totalMemberCount: data.graphDto?.totalMemberCount,
          lastLoginCount: data.graphDto?.lastLoginCount,

          salesByRecipe: Object.fromEntries(
            recipeInfo.map((recipe) => [
              recipe.name,
              (data.salesByRecipeDtoList.length &&
                data.salesByRecipeDtoList.filter(
                  (item) => item.recipeName === recipe.name,
                )[0]?.sales) ||
                0,
            ]),
          ),

          orderCount: {
            // 결제 완료
            PAYMENT_DONE:
              (data.orderStatusStatsDtoList.length &&
                data.orderStatusStatsDtoList?.filter(
                  (order) => order.orderStatus === orderStatus.PAYMENT_DONE,
                )[0]?.count) ||
              0,
            // 결제 실패
            FAILED:
              (data.orderStatusStatsDtoList.length &&
                data.orderStatusStatsDtoList?.filter(
                  (order) => order.orderStatus === orderStatus.FAILED,
                )[0]?.count) ||
              0,

            // 예약 결제 실패
            FAILED_RESERVED_PAYMENT:
              (data.orderStatusStatsDtoList.length &&
                data.orderStatusStatsDtoList?.filter(
                  (order) =>
                    order.orderStatus === orderStatus.FAILED_RESERVED_PAYMENT,
                )[0]?.count) ||
              0,

            // 주문 확인 (DELIVERY_READY + PRODUCING)
            ORDER_CONFIRM:
              (data.orderStatusStatsDtoList.length &&
                data.orderStatusStatsDtoList?.filter(
                  (order) => order.orderStatus === orderStatus.DELIVERY_READY,
                )[0]?.count +
                  data.orderStatusStatsDtoList?.filter(
                    (order) => order.orderStatus === orderStatus.PRODUCING,
                  )[0]?.count) ||
              0,

            // 구매 확정 (CONFIRM)
            CONFIRM:
              (data.orderStatusStatsDtoList.length &&
                data.orderStatusStatsDtoList?.filter(
                  (order) => order.orderStatus === orderStatus.CONFIRM,
                )[0]?.count) ||
              0,
          },

          deliveryCount: {
            // 배송 예정
            DELIVERY_BEFORE_COLLECTION:
              (data.deliveryStatusStatsDtoList.length &&
                data.deliveryStatusStatsDtoList?.filter(
                  (order) =>
                    order.deliveryStatus ===
                    orderStatus.DELIVERY_BEFORE_COLLECTION,
                )[0]?.count) ||
              0,

            // 배송 시작
            DELIVERY_START:
              (data.deliveryStatusStatsDtoList.length &&
                data.deliveryStatusStatsDtoList?.filter(
                  (order) =>
                    order.deliveryStatus === orderStatus.DELIVERY_START,
                )[0]?.count) ||
              0,

            // 배송 완료
            DELIVERY_DONE:
              (data.deliveryStatusStatsDtoList.length &&
                data.deliveryStatusStatsDtoList?.filter(
                  (order) => order.deliveryStatus === orderStatus.DELIVERY_DONE,
                )[0]?.count) ||
              0,
          },

          // *** 구독 현황 ***
          subscribeStats: {
            totalSubscriberCount: data.subscribeStatsDto.totalSubscriberCount,
            totalSubscribeCount: data.subscribeStatsDto.totalSubscribeCount,
            totalSubscribeSales: data.subscribeStatsDto.totalSubscribeSales,
            newSubscribeCount: data.subscribeStatsDto.newSubscribeCount,
            avgPaymentPrice: data.subscribeStatsDto.avgPaymentPrice,
            subscribeCancelCount: data.subscribeStatsDto.subscribeCancelCount,

            //~ 구독 상태
            subscribeStatusStats: {
              // 설문 완료
              SURVEY_COMPLETED:
                (data.subscribeStatsDto.subscribeStatusStatsDtoList.length &&
                  data.subscribeStatsDto.subscribeStatusStatsDtoList?.filter(
                    (order) =>
                      order.subscribeStatus ===
                      subscribeStatus.SURVEY_COMPLETED,
                  )[0]?.count) ||
                0,
              // 결제 전
              BEFORE_PAYMENT:
                (data.subscribeStatsDto.subscribeStatusStatsDtoList.length &&
                  data.subscribeStatsDto.subscribeStatusStatsDtoList?.filter(
                    (order) =>
                      order.subscribeStatus === subscribeStatus.BEFORE_PAYMENT,
                  )[0]?.count) ||
                0,
              // 구독 중
              SUBSCRIBING:
                (data.subscribeStatsDto.subscribeStatusStatsDtoList.length &&
                  data.subscribeStatsDto.subscribeStatusStatsDtoList?.filter(
                    (order) =>
                      order.subscribeStatus === subscribeStatus.SUBSCRIBING,
                  )[0]?.count) ||
                0,
              // 구독 보류
              SUBSCRIBE_PENDING:
                (data.subscribeStatsDto.subscribeStatusStatsDtoList.length &&
                  data.subscribeStatsDto.subscribeStatusStatsDtoList?.filter(
                    (order) =>
                      order.subscribeStatus ===
                      subscribeStatus.SUBSCRIBE_PENDING,
                  )[0]?.count) ||
                0,
              // 구독 취소
              SUBSCRIBE_CANCEL:
                (data.subscribeStatsDto.subscribeStatusStatsDtoList.length &&
                  data.subscribeStatsDto.subscribeStatusStatsDtoList?.filter(
                    (order) =>
                      order.subscribeStatus ===
                      subscribeStatus.SUBSCRIBE_CANCEL,
                  )[0]?.count) ||
                0,
            },

            // 구독취소 카운팅
            subCancelReasonCount:
              data.subscribeStatsDto.subscribeCancelReasonDtoList,
          },

          // 플랜별 현재 구독자 수
          subscriberByPlan: data.subscribeStatsDto.subscriberByPlanDtoList,

          // 레시피별 현재 구독자 수
          subscriberByRecipe: recipeCount, // ### 위에서 계산

          subscribeSumGramByRecipe: matchedSumGramByRecipeResult, // ### 위에서 계산

          // *** 일반구매 현황 ***
          generalOrderStats: {
            totalGeneralOrderSales:
              data.generalOrderStatsDto.totalGeneralOrderSales || 0,
            newGeneralOrderCount:
              data.generalOrderStatsDto.newGeneralOrderCount,

            //~ 취소, 반품, 교환 카운팅
            generalOrderCount: {
              // 구매 확정
              CONFIRM:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) => order.generalOrderStatus === orderStatus.CONFIRM,
                  )[0]?.count) ||
                0,

              // 취소 요청
              CANCEL_REQUEST:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus === orderStatus.CANCEL_REQUEST,
                  )[0]?.count) ||
                0,
              // 취소 완료 (CANCEL_PAYMENT + CANCEL_DONE_BUYER + CANCEL_DONE_SELLER)
              CANCEL_DONE:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus === orderStatus.CANCEL_PAYMENT,
                  )[0]?.count +
                    data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                      (order) =>
                        order.generalOrderStatus ===
                        orderStatus.CANCEL_DONE_BUYER,
                    )[0]?.count +
                    data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                      (order) =>
                        order.generalOrderStatus ===
                        orderStatus.CANCEL_DONE_SELLER,
                    )[0]?.count) ||
                0,

              // 반품 요청
              RETURN_REQUEST:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus === orderStatus.RETURN_REQUEST,
                  )[0]?.count) ||
                0,
              // 반품 완료 (RETURN_DONE_BUYER + RETURN_DONE_SELLER)
              RETURN_DONE:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus ===
                      orderStatus.RETURN_DONE_BUYER,
                  )[0]?.count) +
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.orderStatus === orderStatus.RETURN_DONE_SELLER,
                  )[0]?.count || 0,

              // 교환 요청
              EXCHANGE_REQUEST:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus === orderStatus.EXCHANGE_REQUEST,
                  )[0]?.count) ||
                0,
              // 교환 완료(EXCHANGE_DONE_SELLER + EXCHANGE_DONE_BUYER)
              EXCHANGE_DONE:
                (data.generalOrderStatsDto.generalOrderStatusStatsDtoList
                  .length &&
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus ===
                      orderStatus.EXCHANGE_DONE_SELLER,
                  )[0]?.count) +
                  data.generalOrderStatsDto.generalOrderStatusStatsDtoList?.filter(
                    (order) =>
                      order.generalOrderStatus ===
                      orderStatus.EXCHANGE_DONE_BUYER,
                  )[0]?.count || 0,
            },
          },

          // *** 문의 사항 ***
          questionStats: {
            unansweredCount: data.questionStatsDto.unansweredCount,
            answeredCount: data.questionStatsDto.answeredCount,
          },

          // *** 그래프 ***
          graphDto: {
            // 신규 회원
            memberCountByDate: data.graphDto.memberCountByDateDtoList,
            // 주문량
            orderCountByDate: data.graphDto.orderCountByDateDtoList,
            // 매출액
            salesCountByDate: data.graphDto.salesCountByDateDtoList,
          },
        };

        // console.log('DATA~~~~', DATA);
        setInfo(DATA);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));

      setIsGraphLoading(false);
    }
  };

  useEffect(() => {
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: true,
      ga: !!googleApiToken, // 토큰이 있을 경우에만 loading 활성
    }));
    // 기간에 따른 통계 update
    fetchData(date.term);
  }, [date.from, date.to, router]);

  // "검색" 버튼 클릭 시, get 요청
  const onChangeSelectHandler = (value) => {
    setIsLoading((prevState) => ({
      ...prevState,
      fetching: true,
      ga: !!googleApiToken,
    }));
    // 기간에 따른 통계 update
    fetchData(date.term);
  };

  const activeGoogleAuth = () => {
    const searchForActivatingGoogleOauth = '?activeGoogleOauth=true';
    window.location.search = searchForActivatingGoogleOauth;
  };

  const deleteGoogleOauthToken = async () => {
    if (!confirm('구글연동을 해지하시겠습니까?')) return;
    const origin = window.location.origin;
    await fetch(origin + '/api/googleAnalytics/deleteToken', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ token: googleApiToken }),
    })
      .then((res) => {
        // console.log(res);
        alert('구글 연동해제');
        deleteCookie(cookieType.GOOGLE_ANALYTICS_TOKEN);
        window.location.reload();
      })
      .catch((err) => {
        if (err) {
          alert('구글 연동해제에 실패하였습니다.');
        }
      });
  };

  // SearchDateTime에 보내줄 state
  const [dateStart, setDateStart] = useState(dayjs().startOf('day'));
  const [dateEnd, setDateEnd] = useState(dayjs());
  const [isReset, setIsReset] = useState(false);

  const onResetSearchValues = () => {
    setDate(initialDate);
    setDateStart(dayjs().startOf('day'));
    setIsReset(true);
  };

  // console.log('info>>>', info);
  // console.log('date>>>', date);
  // console.log('salesByRecipeZero>>>', salesByRecipeZero);

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <>
      <MetaTitle title="대시보드" admin={true} />
      <AdminLayout>
        <AdminContentWrapper className={s.wrapper}>
          <h1 className={`${s['title']} ${s['main']} title_main`}>
            대시보드
            {!googleApiToken && (
              <button
                className={`admin_btn solid basic_m ${s.google}`}
                type={'button'}
                onClick={activeGoogleAuth}
              >
                GA활성화
              </button>
            )}
            {googleApiToken && (
              <button
                className={`admin_btn line basic_m ${s.google}`}
                type={'button'}
                onClick={deleteGoogleOauthToken}
              >
                GA 비활성
              </button>
            )}
          </h1>
          <section className={`${s['cont-top']} cont`}>
            <SearchBar
              onReset={onResetSearchValues}
              onSearch={onChangeSelectHandler}
            >
              <SearchDateTime
                title={'조회기간'}
                date={date}
                setDate={setDate}
                dateStart={dateStart}
                setDateStart={setDateStart}
                dateEnd={dateEnd}
                setDateEnd={setDateEnd}
                isReset={isReset}
                setIsReset={setIsReset}
                isLoading={isLoading}
                fetchData={fetchData}
                tooltip={
                  <ToolTip
                    message={
                      '좌측 조회기간은 우측 조회기간보다 과거시점이어야 합니다.'
                    }
                    messagePosition={'left'}
                  />
                }
              />
            </SearchBar>
          </section>

          <div className={s.cont_wrapper}>
            <section className={`${s['cont-left']} cont`}>
              <div className={s['title-section']}>
                <h2 className={s.title}>주문현황</h2>
              </div>

              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <ul className={s.box}>
                    <li>
                      <span>총 주문 수</span>
                      <span>
                        <b>{info.totalOrderCount}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>총 매출액</span>
                      <span>
                        <b>
                          {info.totalSales &&
                            transformLocalCurrency(info.totalSales)}
                        </b>{' '}
                        원
                      </span>
                    </li>
                    <li className={s.pie_chart_wrapper}>
                      <span>레시피별 매출</span>
                      {salesByRecipeZero ? (
                        <div style={{ color: '#a9a9a9' }}>
                          기간 내 매출이 없습니다.
                        </div>
                      ) : (
                        <SalesByRecipePieChart chartData={info.salesByRecipe} />
                      )}
                    </li>
                  </ul>
                  <ul className={s.box}>
                    <li>
                      <span>결제 완료</span>
                      <span>
                        <b>{info.orderCount?.PAYMENT_DONE}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>주문 확인</span>
                      <span>
                        <b>{info.orderCount?.ORDER_CONFIRM}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>구매 확정</span>
                      <span>
                        <b>{info.orderCount?.CONFIRM}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>결제 실패</span>
                      <span>
                        <b>{info.orderCount?.FAILED}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>예약결제 실패</span>
                      <span>
                        <b>{info.orderCount?.FAILED_RESERVED_PAYMENT}</b> 건
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </section>

            {/* === 배송 상태 === */}
            <section className={`${s['cont-mid']} cont`}>
              <div className={s['title-section']}>
                <h2 className={s.title}>배송상태 현황</h2>
              </div>

              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <ul className={s.box}>
                    <li>
                      <span>배송 예정</span>
                      <span>
                        <b>{info.deliveryCount?.DELIVERY_BEFORE_COLLECTION}</b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>배송 중</span>
                      <span>
                        <b>{info.deliveryCount?.DELIVERY_START}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>배송 완료</span>
                      <span>
                        <b>{info.deliveryCount?.DELIVERY_DONE}</b> 건
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* === 일반구매 현황 === */}
          <div className={s.cont_wrapper}>
            <section className={`${s['cont-left']} cont`}>
              <div className={s['title-section']}>
                <h2 className={s.title}>일반구매 현황</h2>
              </div>

              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <ul className={s.box}>
                    <li>
                      <span>신규 주문 수</span>
                      <span>
                        <b>{info.generalOrderStats?.newGeneralOrderCount}</b> 건
                      </span>
                    </li>
                    <li>
                      <span>총 매출액</span>
                      <span>
                        <b>
                          {info.generalOrderStats?.totalGeneralOrderSales &&
                            transformLocalCurrency(
                              info.generalOrderStats?.totalGeneralOrderSales,
                            )}
                        </b>{' '}
                        원
                      </span>
                    </li>
                  </ul>
                  <ul className={s.box}>
                    <li>
                      <span>구매 확정</span>
                      <span>
                        <b>
                          {info.generalOrderStats?.generalOrderCount.CONFIRM}
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>취소 요청</span>
                      <span>
                        <b>
                          {
                            info.generalOrderStats?.generalOrderCount
                              .CANCEL_REQUEST
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>취소 완료</span>
                      <span>
                        <b>
                          {
                            info.generalOrderStats?.generalOrderCount
                              .CANCEL_DONE
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>반품 요청</span>
                      <span>
                        <b>
                          {' '}
                          {
                            info.generalOrderStats?.generalOrderCount
                              .RETURN_REQUEST
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>반품 완료</span>
                      <span>
                        <b>
                          {
                            info.generalOrderStats?.generalOrderCount
                              .RETURN_DONE
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>교환 요청</span>
                      <span>
                        <b>
                          {
                            info.generalOrderStats?.generalOrderCount
                              .EXCHANGE_REQUEST
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                    <li>
                      <span>교환 완료</span>
                      <span>
                        <b>
                          {
                            info.generalOrderStats?.generalOrderCount
                              .EXCHANGE_DONE
                          }
                        </b>{' '}
                        건
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </section>

            {/* === 1:1 문의 === */}
            <section className={`${s['cont-mid']} cont`}>
              <div className={s['title-section']}>
                <h2 className={s.title}>1:1 문의</h2>
              </div>
              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <ul className={s.box}>
                    <li>
                      <span>답변 대기</span>
                      <span>
                        <b>{info.questionStats?.unansweredCount}</b> 건{' '}
                        {info.questionStats?.unansweredCount > 0 && (
                          <IndicateDot pos={{ right: -2, top: 3 }} size={5} />
                        )}
                      </span>
                    </li>
                    <li>
                      <span>답변 완료</span>
                      <span>
                        <b>{info.questionStats?.answeredCount}</b> 건
                      </span>
                    </li>
                  </ul>
                </div>
              )}
            </section>
          </div>

          {/* === 구독 현황 === */}
          <div className={s.graph_wrapper}>
            <section className={`${s['cont-row']} cont`}>
              <div className={s['title-section']}>
                <h2 className={s.title}>구독 현황</h2>
              </div>

              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <div className={s.box_section}>
                    <ul className={s.box}>
                      <li>
                        <span>구독 수</span>
                        <span>
                          <b>{info.subscribeStats?.totalSubscribeCount}</b> 건
                        </span>
                      </li>
                      <li>
                        <span>구독자 수</span>
                        <span>
                          <b>{info.subscribeStats?.totalSubscriberCount}</b> 명
                        </span>
                      </li>
                      <li>
                        <span>신규 구독주문 수</span>
                        <span>
                          <b>{info.subscribeStats?.newSubscribeCount}</b> 건
                        </span>
                      </li>
                      <li>
                        <span>이탈 구독자 수</span>
                        <span>
                          <b>{info.subscribeStats?.subscribeCancelCount}</b> 명
                        </span>
                      </li>
                    </ul>

                    <ul className={s.box}>
                      <li>
                        <span>총 매출액</span>
                        <span>
                          <b>
                            {info.subscribeStats?.totalSubscribeSales &&
                              transformLocalCurrency(
                                Math.round(
                                  info.subscribeStats?.totalSubscribeSales,
                                ),
                              )}
                          </b>{' '}
                          원
                        </span>
                      </li>
                      <li>
                        <span>전체 구독 평균 결제액</span>
                        <span>
                          <b>
                            {info.subscribeStats?.avgPaymentPrice &&
                              transformLocalCurrency(
                                Math.round(
                                  info.subscribeStats?.avgPaymentPrice,
                                ),
                              )}
                          </b>{' '}
                          원
                        </span>
                      </li>
                    </ul>

                    <ul className={s.box}>
                      <li>
                        <span>설문 완료</span>
                        <span>
                          <b>
                            {
                              info.subscribeStats?.subscribeStatusStats
                                .SURVEY_COMPLETED
                            }
                          </b>{' '}
                          명
                        </span>
                      </li>
                      <li>
                        <span>구독 전</span>
                        <span>
                          <b>
                            {
                              info.subscribeStats?.subscribeStatusStats
                                .BEFORE_PAYMENT
                            }
                          </b>{' '}
                          명
                        </span>
                      </li>
                      <li>
                        <span>구독 중</span>
                        <span>
                          <b>
                            {
                              info.subscribeStats?.subscribeStatusStats
                                .SUBSCRIBING
                            }
                          </b>{' '}
                          명
                        </span>
                      </li>
                      <li>
                        <span>구독 보류</span>
                        <span>
                          <b>
                            {
                              info.subscribeStats?.subscribeStatusStats
                                .SUBSCRIBE_PENDING
                            }
                          </b>{' '}
                          명
                        </span>
                      </li>
                      <li>
                        <span>구독 취소</span>
                        <span>
                          <b>
                            {
                              info.subscribeStats?.subscribeStatusStats
                                .SUBSCRIBE_CANCEL
                            }
                          </b>{' '}
                          명
                        </span>
                      </li>
                    </ul>
                  </div>

                  {/* *** 구독 그래프 *** */}
                  <div className={s.sub_graph_wrapper}>
                    <ul className={s.box_graph_one}>
                      <li>
                        <span>구독취소 사유</span>

                        <Link href={`/bf-admin/popup/subCancel`} passHref>
                          <a
                            target="_blank"
                            className="admin_btn basic_s solid"
                            onClick={onPopupHandler}
                          >
                            상세보기
                          </a>
                        </Link>
                        <SubCancelPieChart
                          chartData={info.subscribeStats?.subCancelReasonCount}
                        />
                      </li>
                    </ul>

                    <ul className={s.box_graph_two}>
                      <li>
                        <span>플랜별 현재 구독자 수</span>
                        <SubscriberByPlanPieChart
                          chartData={info.subscriberByPlan}
                        />
                      </li>
                    </ul>
                  </div>

                  <div className={s.sub_graph_wrapper}>
                    <ul className={s.box_graph_three}>
                      <li>
                        <span>레시피별 현재 구독자 수</span>
                        <SubscriberByRecipePieChart
                          chartData={info.subscriberByRecipe}
                        />
                      </li>
                    </ul>

                    <ul className={s.box_graph_four}>
                      <li>
                        <span>구독자 레시피별 한 끼 무게 총합</span>
                        <SubscribeSumGramByRecipe
                          chartData={info.subscribeSumGramByRecipe}
                        />
                      </li>
                    </ul>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* ~~~ 그래프 ~~~ */}
          <div className={s.graph_wrapper}>
            <div className={s.search_radio}>
              <SearchTermRadio
                searchValue={date}
                setSearchValue={setDate}
                name="term"
                idList={['day', 'month', 'year']}
                labelList={['일별', '월별', '연도별']}
                value={date.term}
                fetchData={fetchData}
                isGraphLoading={isGraphLoading}
                setIsGraphLoading={setIsGraphLoading}
              />
            </div>
            <section className={`cont ${s['cont-right']}`} id={'chart-section'}>
              <div className={s['title-section']}>
                {/* ~~~ (1) 신규 회원 그래프 ~~~ */}
                <h2 className={s.title}>
                  회원
                  <ToolTip
                    message={
                      '필드를 클릭하면 그래프를 선택적으로 활성화할 수 있습니다.'
                    }
                    theme={'white'}
                    messagePosition={'left'}
                    className={s.tooltip}
                  />
                </h2>
              </div>
              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <div className={s['payment-info']}>
                    <ul>
                      <li>
                        <span>전체 회원 수</span>
                        <span>
                          <strong>{info?.totalMemberCount}</strong>명
                        </span>
                      </li>
                      <li>
                        <span>전체 구독자 수</span>
                        <span>
                          <strong>
                            {info.subscribeStats?.totalSubscriberCount}
                          </strong>
                          명
                        </span>
                      </li>
                    </ul>
                    <span>
                      기간 내 로그인한 회원 수&nbsp;&nbsp;
                      <strong>{info?.lastLoginCount}</strong>명
                    </span>
                  </div>

                  <div className={s.chart_container}>
                    <MemberChart
                      chartData={info.graphDto?.memberCountByDate}
                      from={info.from}
                      to={info.to}
                      isGraphLoading={isGraphLoading}
                      setIsGraphLoading={setIsGraphLoading}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ~~~ (2) 주문량 그래프 ~~~ */}
            <section className={`cont ${s['cont-right']}`} id={'chart-section'}>
              <div className={s['title-section']}>
                <h2 className={s.title}>
                  주문량
                  <ToolTip
                    message={
                      '필드를 클릭하면 그래프를 선택적으로 활성화할 수 있습니다.'
                    }
                    theme={'white'}
                    messagePosition={'left'}
                    className={s.tooltip}
                  />
                </h2>
              </div>
              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <div className={s.chart_container}>
                    <OrderCountChart
                      chartData={info.graphDto?.orderCountByDate}
                      from={info.from}
                      to={info.to}
                      isGraphLoading={isGraphLoading}
                      setIsGraphLoading={setIsGraphLoading}
                    />
                  </div>
                </div>
              )}
            </section>

            {/* ~~~ (3) 매출 그래프 ~~~ */}
            <section className={`cont ${s['cont-right']}`} id={'chart-section'}>
              <div className={s['title-section']}>
                <h2 className={s.title}>
                  매출액
                  <ToolTip
                    message={
                      '필드를 클릭하면 그래프를 선택적으로 활성화할 수 있습니다.'
                    }
                    theme={'white'}
                    messagePosition={'left'}
                    className={s.tooltip}
                  />
                </h2>
              </div>
              {isLoading.fetching ? (
                <div className={s.spinner_wrapper}>
                  <Spinner />
                </div>
              ) : (
                <div className={s['cont-section']}>
                  <div className={s['payment-info']}>
                    <ul>
                      <li>
                        <span>전체</span>
                        <span>
                          <strong>
                            {info.totalSales &&
                              transformLocalCurrency(info.totalSales)}
                          </strong>
                          원
                        </span>
                      </li>
                      <li>
                        <span>일반</span>
                        <span>
                          <strong>
                            {info.generalOrderStats?.totalGeneralOrderSales &&
                              transformLocalCurrency(
                                info.generalOrderStats?.totalGeneralOrderSales,
                              )}
                          </strong>
                          원
                        </span>
                      </li>
                      <li>
                        <span>구독</span>
                        <span>
                          <strong>
                            {info.subscribeStats?.totalSubscribeSales &&
                              transformLocalCurrency(
                                Math.round(
                                  info.subscribeStats?.totalSubscribeSales,
                                ),
                              )}{' '}
                          </strong>
                          원
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className={s.chart_container}>
                    <RevenueChart
                      chartData={info.graphDto?.salesCountByDate}
                      from={info.from}
                      to={info.to}
                      isGraphLoading={isGraphLoading}
                      setIsGraphLoading={setIsGraphLoading}
                    />
                  </div>
                </div>
              )}
            </section>
          </div>
        </AdminContentWrapper>
      </AdminLayout>
    </>
  );
}
export async function getServerSideProps({ req, query }) {
  let token = getCookieSSR(req, cookieType.GOOGLE_ANALYTICS_TOKEN) || null; // 구글 API 토큰
  let expires_in = null; // 구글 API 토큰 만료시간

  // // console.log('query: ',query)
  if (query.token && query.token !== 'undefined') {
    token = query.token || null;
  }

  if (query.expires_in && query?.expires_in !== 'undefined') {
    expires_in = query.expires_in || null;
  }

  const activeGoogleOauth = query.activeGoogleOauth === 'true';

  if (activeGoogleOauth) {
    const googleAuthUrl = getGoogleAuthUrl();
    return {
      redirect: {
        destination: googleAuthUrl,
        permanent: false,
      },
    };
  }

  return {
    props: {
      ga: {
        token,
        expires_in,
      },
    },
  };
}
