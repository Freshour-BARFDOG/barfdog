import React, { useState } from 'react';
import s from './subscribe.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import { EmptyContMessage } from '/src/components/atoms/emptyContMessage';
import Link from 'next/link';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {subscribeStatus} from "/store/TYPE/subscribeStatus";

export default function ManageSubscribePage() {
  const searchApiUrl = '/api/subscribes';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);

  console.log(itemList);

  const pageInterCeptor = async (res) => {
    console.log(res);
    // res = DUMMY_SUBSCRIBE_LIST_RESPONSE; // ! TEST
    let newPageInfo = {
      totalPages: 0,
      size: 0,
      totalItems: 0,
      currentPageIndex: 1,
      newPageNumber: 1,
      newItemList: [],
    };
  
    if(res?.data?._embedded){
      const pageData = res.data.page;
      const curItemList =
        res.data?._embedded?.querySubscribesDtoList.map((l) => ({
          recipeNames: l.recipeNames,
          subscribeDto: {
            countSkipOneTime: l.subscribeDto.countSkipOneTime,
            countSkipOneWeek: l.subscribeDto.countSkipOneWeek,
            discountCoupon: l.subscribeDto.discountCoupon,
            discountGrade: l.subscribeDto.discountGrade,
            dogName: l.subscribeDto.dogName,
            nextPaymentDate: l.subscribeDto.nextPaymentDate,
            nextPaymentPrice: l.subscribeDto.nextPaymentPrice,
            pictureUrl: l.subscribeDto.pictureUrl,
            plan: l.subscribeDto.plan,
            subscribeId: l.subscribeDto.subscribeId,
            status: l.subscribeDto.status,
          },
        })) || [];
      
  
      newPageInfo = {
        totalPages: pageData.totalPages,
        size: pageData.size,
        totalItems: pageData.totalElements,
        currentPageIndex: pageData.number,
        newPageNumber: pageData.number + 1,
        newItemList: curItemList,
      };
    }
   
    return newPageInfo;
  };

  const onMovePageLoading = (e) => {
    e.propertyIsEnumerable();
    const btn = e.currentTarget;
    const targetId = btn.dataset.subscribeId;
    setIsLoading((prevState) => ({
      ...prevState,
      [targetId]: true,
    }));
  };

  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>구독관리</section>
            <section>
              {isLoading.fetching ? (
                <Spinner />
              ) : itemList.length === 0 ? (
                <EmptyContMessage
                  message={'구독 중인 반려견이 없습니다.'}
                  options={{ button: { url: '/surveyGuide', label: '정기구독 시작하기' } }}
                />
              ) : (
                <ul>
                  {itemList.map((item, index) => (
                    <li key={`subscribe-item-${index}`} className={s.content}>
                      <div className={s.flex_box}>
                        <div className={s.col_1}>
                          <figure className={`${s.image} img-wrap`}>
                            {item.subscribeDto.pictureUrl && (
                              <Image
                                src={item.subscribeDto.pictureUrl}
                                objectFit="cover"
                                layout="fill"
                                alt={`반려견 프로필 이미지`}
                              />
                            )}
                            <span className={s.dogName}>{item.subscribeDto.dogName}</span>
                          </figure>
                          <div className={s.text}>
                            {(item.subscribeDto.countSkipOneTime > 0 ||
                              item.subscribeDto.countSkipOneWeek > 0) && (
                              <p className={s.skipInfo}>
                                {item.subscribeDto.countSkipOneTime > 0 && (
                                  <em className={s.red_box_text}>1회 건너뛰기 </em>
                                )}
                                {item.subscribeDto.countSkipOneWeek > 0 && (
                                  <em className={s.red_box_text}>1주 건너뛰기 </em>
                                )}
                              </p>
                            )}

                            <p>
                              {item.subscribeDto.plan &&
                                subscribePlanType[item.subscribeDto.plan].KOR}
                              &nbsp;/ &nbsp;{item.recipeNames}
                            </p>
                            <span className={s.text2}>
                              총{' '}
                              {item.subscribeDto.plan &&
                                subscribePlanType[item.subscribeDto.plan].totalNumberOfPacks}
                              팩&nbsp;/&nbsp;
                              {item.subscribeDto.plan &&
                                subscribePlanType[item.subscribeDto.plan].weeklyPaymentCycle}
                              주 정기결제
                            </span>
                          </div>
                        </div>
                        <div className={s.grid}>
                          <div className={s.col_2}>
                            <span className={s.text2}>다음 결제일</span>
                            <span className={s.text3}>
                              {transformDate(item.subscribeDto?.nextPaymentDate)}
                            </span>
                          </div>
                          <div className={s.col_3}>
                            <span className={s.text2}>다음 결제금액</span>
                            <span className={s.text3}>
                              {transformLocalCurrency(
                                item.subscribeDto.nextPaymentPrice -
                                  (item.subscribeDto.discountCoupon +
                                    item.subscribeDto.discountGrade),
                              )}
                              원
                            </span>
                          </div>

                          <div className={s.col_4}>
                            {item.subscribeDto.status === subscribeStatus.SUBSCRIBING ? (
                              <Link
                                href={`/mypage/subscribe/${item.subscribeDto.subscribeId}`}
                                passHref
                              >
                                <a
                                  className={s.btn}
                                  onClick={onMovePageLoading}
                                  data-subscribe-id={item.subscribeDto.subscribeId}
                                >
                                  {isLoading[item.subscribeDto.subscribeId] ? (
                                    <Spinner />
                                  ) : (
                                    '관리하기'
                                  )}
                                </a>
                              </Link>
                            ) : (
                              <Link
                                href={`/mypage/dogs`}
                                passHref
                              >
                                <a
                                  className={`${s.btn1} pointColor`}
                                >
                                  {isLoading[item.subscribeDto.subscribeId] ? (
                                    <Spinner />
                                  ) : (
                                    '구독하기'
                                  )}
                                </a>
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
            <section className={s.pagination_box}>
              <PaginationWithAPI
                apiURL={searchApiUrl}
                size={searchPageSize}
                setItemList={setItemList}
                setIsLoading={setIsLoading}
                pageInterceptor={pageInterCeptor}
              />
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}

// let DUMMY_SUBSCRIBE_LIST_RESPONSE = {
//   data: {
//     _embedded: {
//       querySubscribesDtoList: [
//         {
//           subscribeDto: {
//             subscribeId: 2924,
//             pictureUrl:
//               'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=685&q=80',
//             skipCount: 0,
//             dogName: '몽몽이',
//             plan: 'HALF',
//             nextPaymentDate: '2022-08-14T09:56:37.437',
//             nextPaymentPrice: 320000,
//           },
//           recipeNames: '램앤덕',
//           _links: {
//             query_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2924',
//             },
//             skip_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2924/skip',
//             },
//           },
//         },
//         {
//           subscribeDto: {
//             subscribeId: 2936,
//             pictureUrl:
//               'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
//             skipCount: 3,
//             dogName: '슈',
//             plan: 'FULL',
//             nextPaymentDate: '2022-08-24T09:56:37.45',
//             nextPaymentPrice: 163000,
//           },
//           recipeNames: '스타트,터키비프',
//           _links: {
//             query_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2936',
//             },
//             skip_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2936/skip',
//             },
//           },
//         },
//         {
//           subscribeDto: {
//             subscribeId: 2948,
//             pictureUrl:
//               'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
//             skipCount: 0,
//             dogName: '몽실이',
//             plan: 'TOPPING',
//             nextPaymentDate: '2022-08-12T09:56:37.463',
//             nextPaymentPrice: 78000,
//           },
//           recipeNames: '터키비프',
//           _links: {
//             query_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2948',
//             },
//             skip_subscribe: {
//               href: 'http://localhost:8080/api/subscribes/2948/skip',
//             },
//           },
//         },
//       ],
//     },
//     page: {
//       size: 5,
//       totalElements: 13,
//       totalPages: 3,
//       number: 1,
//     },
//   },
// };
//
// let DUMMY_SUBSCRIBE_DETAIL_RESPONSE = {
//   data: {
//     subscribeDto: {
//       id: 3106,
//       dogName: '김바프',
//       subscribeCount: 3,
//       plan: 'FULL',
//       oneMealRecommendGram: 101.0,
//       nextPaymentDate: '2022-07-28T09:56:38.693',
//       nextPaymentPrice: 120000,
//       nextDeliveryDate: '2022-07-30',
//       usingMemberCouponId: 3104,
//       couponName: '관리자 직접 발행 쿠폰2',
//       discount: 3000,
//     },
//     subscribeRecipeDtoList: [
//       {
//         recipeId: 13,
//         recipeName: '스타트',
//       },
//       {
//         recipeId: 14,
//         recipeName: '터키비프',
//       },
//     ],
//     memberCouponDtoList: [
//       {
//         memberCouponId: 3104,
//         name: '관리자 직접 발행 쿠폰2',
//         discountType: 'FIXED_RATE',
//         discountDegree: 10,
//         availableMaxDiscount: 10000,
//         availableMinPrice: 5000,
//         remaining: 3,
//         expiredDate: '2022-07-25T09:56:38.693',
//       },
//     ],
//     recipeDtoList: [
//       {
//         id: 13,
//         name: '스타트',
//         description: '레시피 설명',
//         pricePerGram: 48.234,
//         gramPerKcal: 1.23456,
//         inStock: true,
//         imgUrl: 'http://localhost:8080/display/recipes?filename=스타트2.jpg',
//       },
//       {
//         id: 14,
//         name: '터키비프',
//         description: '레시피 설명',
//         pricePerGram: 48.234,
//         gramPerKcal: 1.23456,
//         inStock: true,
//         imgUrl: 'http://localhost:8080/display/recipes?filename=터키비프2.jpg',
//       },
//       {
//         id: 15,
//         name: '덕램',
//         description: '레시피 설명',
//         pricePerGram: 48.234,
//         gramPerKcal: 1.23456,
//         inStock: true,
//         imgUrl: 'http://localhost:8080/display/recipes?filename=덕램2.jpg',
//       },
//       {
//         id: 16,
//         name: '램비프',
//         description: '레시피 설명',
//         pricePerGram: 48.234,
//         gramPerKcal: 1.23456,
//         inStock: true,
//         imgUrl: 'http://localhost:8080/display/recipes?filename=램비프2.jpg',
//       },
//     ],
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/subscribes/3106',
//       },
//       profile: {
//         href: '/docs/index.html#resources-query-subscribe',
//       },
//     },
//   },
// };
