import React, {useCallback, useState} from 'react';
import s from './subscribe.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import PaginationWithAPI from '/src/components/atoms/PaginationWithAPI';
import Spinner from '/src/components/atoms/Spinner';
import {EmptyContMessage} from '/src/components/atoms/emptyContMessage';
import Link from 'next/link';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {subscribeStatus} from "/store/TYPE/subscribeStatus";
import {calcSubscribeNextPaymentPrice} from "/util/func/subscribe/calcSubscribeNextPaymentPrice";
import {getDefaultPagenationInfo} from "/util/func/getDefaultPagenationInfo";

export default function ManageSubscribePage() {
  const searchApiUrl = '/api/subscribes';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);

  
  const pageInterceptor = useCallback((res, option={itemQuery: null}) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'querySubscribesDtoList', {pageSize: searchPageSize});
  },[]);

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
                                calcSubscribeNextPaymentPrice(
                                  {originPrice: item.subscribeDto.nextPaymentPrice, discountCoupon: item.subscribeDto.discountCoupon, discountGrade:item.subscribeDto.discountGrade, overDiscount: item.subscribeDto.overDiscount}
                              ))}원
                            </span>
                          </div>

                          <div className={s.col_4}>
                            {item.subscribeDto.status === subscribeStatus.SUBSCRIBING || item.subscribeDto.status === subscribeStatus.SUBSCRIBE_PENDING ? (
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
                pageInterceptor={pageInterceptor}
              />
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
    </>
  );
}
