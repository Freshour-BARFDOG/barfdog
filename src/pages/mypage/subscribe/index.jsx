import React, { useCallback, useState } from 'react';
import s from './subscribe.module.scss';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
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
import { subscribeStatus } from '/store/TYPE/subscribeStatus';
import { calcSubscribeNextPaymentPrice } from '/util/func/subscribe/calcSubscribeNextPaymentPrice';
import { getDefaultPagenationInfo } from '/util/func/getDefaultPagenationInfo';
import { useRouter } from 'next/router';
import { SubscribeStatusTag } from '/src/components/subscribe/SubscribeStatusTag';
import { formattedProductionAndReceivingDate } from '../../../../util/func/formattedProductionAndReceivingDate';

export default function ManageSubscribePage() {
  const router = useRouter();
  const searchApiUrl = '/api/subscribes';
  const searchPageSize = 10;
  const [isLoading, setIsLoading] = useState({});
  const [itemList, setItemList] = useState([]);

  const pageInterceptor = useCallback((res, option = { itemQuery: null }) => {
    // res = DUMMY__RESPONSE; // ! TEST
    // console.log(res);
    return getDefaultPagenationInfo(res?.data, 'querySubscribesDtoList', {
      pageSize: searchPageSize,
    });
  }, []);

  const onMovePageLoading = (e) => {
    e.propertyIsEnumerable();
    const btn = e.currentTarget;
    const targetId = btn.dataset.subscribeId;
    setIsLoading((prevState) => ({
      ...prevState,
      [targetId]: true,
    }));
  };

  // 패키지 기간 계산
  function calculatePackagePeriod(startDate, subscriptionMonth) {
    const start = new Date(startDate);
    const end = new Date(start);
    end.setMonth(end.getMonth() + subscriptionMonth);

    const formattedStart = `${start.getFullYear()}/${String(
      start.getMonth() + 1,
    ).padStart(2, '0')}/${String(start.getDate()).padStart(2, '0')}`;
    const formattedEnd = `${end.getFullYear()}/${String(
      end.getMonth() + 1,
    ).padStart(2, '0')}/${String(end.getDate()).padStart(2, '0')}`;

    // return `${formattedStart} ~ ${formattedEnd}`;
    return ` ~${formattedEnd}`;
  }

  const onPrevPage = () => {
    router.push('/mypage');
  };

  console.log(itemList);

  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            <header>
              <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
                <Image
                  src={'/img/order/left_arrow.svg'}
                  alt="left_arrow"
                  width={24}
                  height={24}
                  onClick={onPrevPage}
                />
              </div>
            </header>
            <section className={s.title}>
              <div>구독관리</div>
              <div className={s.title_info}>
                결제가 이미 이루어진 경우,
                <br /> 플랜 및 레시피 변경 시 재결제가 이뤄질 수 있습니다.
              </div>
            </section>
            <section className={s.subscribe_list}>
              {isLoading.fetching ? (
                <Spinner />
              ) : itemList.length === 0 ? (
                <EmptyContMessage
                  message={'구독 중인 반려견이 없습니다.'}
                  options={{
                    button: { url: '/survey', label: '정기구독 시작하기' },
                  }}
                />
              ) : (
                <ul className={s.content_container}>
                  {itemList
                    .filter(
                      (item) => item.subscribeDto.status === 'SUBSCRIBING',
                    )
                    .sort(
                      (a, b) =>
                        b.subscribeDto.subscribeId - a.subscribeDto.subscribeId,
                    )
                    .map((item, index) => (
                      <li key={`subscribe-item-${index}`} className={s.content}>
                        <div className={s.title_box}>
                          <h3>
                            {item.subscribeDto.dogName}(이)의 AI 추천 식단
                          </h3>
                          {/* 구독 상태 */}
                          <div className={s.tags}>
                            <SubscribeStatusTag
                              status={item.subscribeDto.status}
                            />
                          </div>
                        </div>

                        {/* 다음 배송일(nextDeliveryDate)이 없으면, 오늘 구독했을 경우로 계산 */}
                        <div className={s.date_wrapper}>
                          <p>
                            생산 예정일:{' '}
                            {
                              formattedProductionAndReceivingDate(
                                item.subscribeDto.nextDeliveryDate,
                              ).formattedProductionDate
                            }
                          </p>
                          <p>|</p>
                          <p>
                            수령 예정일:{' '}
                            {
                              formattedProductionAndReceivingDate(
                                item.subscribeDto.nextDeliveryDate,
                              ).formattedReceivingDate
                            }
                          </p>
                        </div>

                        <div className={s.flex_box}>
                          {item.subscribeDto.subscriptionMonth && (
                            <p>
                              - 현재 패키지:{' '}
                              {item.subscribeDto.subscriptionMonth}개월
                            </p>
                          )}

                          <p>
                            - 현재 플랜:{' '}
                            {item.subscribeDto.plan &&
                              subscribePlanType[item.subscribeDto.plan].KOR}
                          </p>

                          <p>- 현재 레시피: {item.recipeNames}</p>

                          {/* 총{' '}
                            {item.subscribeDto.plan &&
                              subscribePlanType[item.subscribeDto.plan]
                                .totalNumberOfPacks}
                            팩&nbsp;/&nbsp;
                            {item.subscribeDto.plan &&
                              subscribePlanType[item.subscribeDto.plan]
                                .weeklyPaymentCycle}
                            주 정기결제 */}

                          {item.subscribeDto.subscriptionMonth ? (
                            <>
                              <span className={s.text3}>
                                - 패키지 금액:{' '}
                                {transformLocalCurrency(
                                  item.subscribeDto?.packagePrice,
                                ) + '원' || ' -'}
                              </span>
                              <span className={s.text3}>
                                {' '}
                                - 패키지 기간:
                                {calculatePackagePeriod(
                                  item.subscribeDto?.startDate,
                                  item.subscribeDto?.subscriptionMonth,
                                ) +
                                  ' (' +
                                  item.subscribeDto?.shippingLeft +
                                  '회 남음)' || ' -'}
                              </span>
                            </>
                          ) : (
                            <>
                              {' '}
                              <span className={s.text3}>
                                {' '}
                                - 다음 결제일:
                                {transformDate(
                                  item.subscribeDto?.nextPaymentDate,
                                ) || ' -'}
                              </span>
                              <span className={s.text2}>
                                - 구독 금액:{' '}
                                {transformLocalCurrency(
                                  calcSubscribeNextPaymentPrice({
                                    originPrice:
                                      item.subscribeDto.nextPaymentPrice,
                                    discountCoupon:
                                      item.subscribeDto.discountCoupon,
                                    discountGrade:
                                      item.subscribeDto.discountGrade,
                                    overDiscount:
                                      item.subscribeDto.overDiscount,
                                  }),
                                )}
                                원
                              </span>{' '}
                            </>
                          )}
                        </div>

                        <div className={s.col_4}>
                          <Link
                            href={`/mypage/subscribe/benefit/${item.subscribeDto.subscribeId}`}
                            passHref
                          >
                            <a
                              className={s.btn}
                              onClick={onMovePageLoading}
                              data-subscribe-id={item.subscribeDto.subscribeId}
                            >
                              패키지 혜택
                            </a>
                          </Link>

                          <Link
                            href={`/mypage/subscribe/${item.subscribeDto.subscribeId}`}
                            passHref
                          >
                            <a
                              className={s.btn}
                              onClick={onMovePageLoading}
                              data-subscribe-id={item.subscribeDto.subscribeId}
                            >
                              변경 하기
                              <Image
                                src={'/img/order/right_arrow.svg'}
                                alt="right_arrow"
                                width={12}
                                height={12}
                              />
                            </a>
                          </Link>
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
      </LayoutWithoutFooter>
    </>
  );
}
