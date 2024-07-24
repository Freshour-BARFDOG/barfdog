import React, { useCallback, useEffect, useState } from 'react';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import { subscriptionMonthType } from '../../../store/TYPE/subscriptionMonthType';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import ToolTip from '/src/components/atoms/Tooltip';
import { calcOrdersheetPrices } from './calcOrdersheetPrices';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import { subscribePlanType } from '../../../store/TYPE/subscribePlanType';

export default function OrdersheetPaymentList({
  info,
  form,
  setForm,
  formErrors,
  setFormErrors,
  onActivleModalHandler,
  orderType,
  subscriptionMonthTypeKey,
}) {
  const getDeliveryCount = (type) => {
    if (type.VALUE === null) {
      return 1;
    } else if (
      info.subscribeDto.plan === 'FULL' ||
      info.subscribeDto.plan === 'TOPPING_FULL'
    ) {
      return type.fullDeliveryCount;
    } else if (
      info.subscribeDto.plan === 'HALF' ||
      info.subscribeDto.plan === 'TOPPING_HALF'
    ) {
      return type.halfDeliveryCount;
    } else return 1;
  };

  const getMonthDiscount = (value) => {
    for (const key in subscriptionMonthType) {
      if (subscriptionMonthType[key].VALUE === value) {
        return subscriptionMonthType[key].discount;
      }
    }
    return null;
  };

  const subscriptionMonthItems = Object.keys(subscriptionMonthType).map(
    (key) => {
      const type = subscriptionMonthType[key];

      return {
        id: key,
        value: type.VALUE,
        label: type.VALUE === 6 && 'best',
        title: type.KOR,
        bodyDescHTML: {
          row1: type.discount && (
            <p>
              <span className={s.text_highlight}>{type.discount}%</span> 할인
            </p>
          ),
          row2: type.freeKit && (
            <>
              <p>
                진단 기기 <span>{type.freeKit}회</span> 무료
              </p>
              <ToolTip
                message={`반려견의 장내 환경을 들여다 볼 수 있는 바프독 장내 미생물 진단키트를 무료로 제공해드립니다! (진단 시 보고서 기본 제공)`}
                messagePosition={'left'}
                wordBreaking={true}
              />
            </>
          ),
          row3: type.freeTopper && (
            <>
              <p>
                토퍼 랜덤 <span>{type.freeTopper}회</span> 무료
              </p>
              <ToolTip
                message={`식사 위에 토핑으로 올릴 수 있는 건강한 토퍼 제품을 무료로 제공해드립니다! (바프레드, 바프화이트, 터메릭슈퍼큐브, 치킨스프, 머쉬룸스프 중 랜덤 증정)`}
                messagePosition={'left'}
                wordBreaking={true}
              />
            </>
          ),
          row4: type.freeSkip && <p>건너 뛰기 무제한</p>,
          row5: type.freeDelivery && <p>무료 배송</p>,
          row6:
            type.fullDeliveryCount && info.subscribeDto.plan === 'FULL'
              ? `(${type.fullDeliveryCount}회 배송)`
              : type.fullDeliveryCount && info.subscribeDto.plan === 'HALF'
              ? `(${type.halfDeliveryCount}회 배송)`
              : '', // 배송횟수
          row7: type.freeKit && ( // 진단기기 가격 (하나당 98,000원)
            <div className={s.price_info}>
              <span>
                {/* {transformLocalCurrency(98000)} * {type.freeKit}회 ={' '} */}
                {transformLocalCurrency(98000 * type.freeKit)}원
              </span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row8: type.freeTopper && ( // 토퍼 가격 (하나당 16,000원)
            <div className={s.price_info}>
              <span>{transformLocalCurrency(16000 * type.freeTopper)}원</span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row9: type.freeDelivery && ( // 배송 가격
            <div className={s.price_info}>
              <span>
                {transformLocalCurrency(50000 * getDeliveryCount(type))}원
              </span>
              <p className={s.origin_price}>0원</p>
            </div>
          ),
          row10: type.freeSkip && (
            <div className={s.benefit_info}>
              <div className={s.benefit_title}>
                <p>구독 건너 뛰기</p>
              </div>
              <div className={s.price_info}>
                <p className={s.origin_price}>무제한</p>
              </div>
            </div>
          ),
        },
      };
    },
  );

  const calcResult = useCallback(
    calcOrdersheetPrices(
      form,
      orderType,
      {
        deliveryFreeConditionPrice: info.freeCondition,
      },
      info,
    ),
    [form, orderType],
  );

  console.log('calcResult____', calcResult);

  return (
    <>
      {/* 3. 할인 금액 */}
      <section className={s.discount}>
        {/* 1) 쿠폰 */}
        <div className={s.coupon_list}>
          <div>쿠폰</div>
          <button
            type={'button'}
            className={`${s['coupons']}`}
            data-modal-type={'coupons'}
            onClick={onActivleModalHandler}
          >
            <b>쿠폰 적용 &gt; </b>
          </button>
        </div>

        {/* 2) 적립금 */}
        <OrdersheetReward
          orderType={'subscribe'}
          id={'discountReward'}
          info={info}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        />
      </section>

      <section className={s.total_price}>
        <div className={s.total_price_wrapper}>
          <div className={s.total_price_text}>
            <h2>총 결제금액</h2>
            <div>
              {/* 총 결제금액 = 1개원가*배송횟수 - 할인금액 - 1개원가*배송횟수*플랜할인율(플랜할인금액)  */}
              {transformLocalCurrency(
                info.subscribeDto?.originPrice *
                  getDeliveryCount(
                    subscriptionMonthType[subscriptionMonthTypeKey],
                  ) -
                  calcResult?.discountTotal -
                  Math.floor(
                    info.subscribeDto.originPrice *
                      getDeliveryCount(
                        subscriptionMonthType[subscriptionMonthTypeKey],
                      ) *
                      (info.subscribeDto.discountPlan / 100),
                  ),
              )}
              원
            </div>
          </div>
          <div className={s.monthly_price}>
            일{' '}
            {form.subscriptionMonth
              ? transformLocalCurrency(
                  Math.round(
                    (form.orderPrice - calcResult?.discountTotal) /
                      form.subscriptionMonth /
                      30,
                  ),
                )
              : transformLocalCurrency(
                  Math.round(
                    (form.orderPrice - calcResult?.discountTotal) / 30,
                  ),
                )}
            원 / 월{' '}
            {form.subscriptionMonth
              ? transformLocalCurrency(
                  Math.round(
                    (form.orderPrice - calcResult?.discountTotal) /
                      form.subscriptionMonth,
                  ),
                )
              : transformLocalCurrency(
                  form.orderPrice - calcResult?.discountTotal,
                )}
            원
          </div>
        </div>

        {/* 상세내역 */}
        <div className={s.detail_price_wrapper}>
          <div className={s.detail_price_text}>
            <div>상품금액</div>
            <div>
              {transformLocalCurrency(
                info.subscribeDto?.originPrice *
                  getDeliveryCount(
                    subscriptionMonthType[subscriptionMonthTypeKey],
                  ),
              )}
              원{/* // 플랜 할인 전   */}
            </div>
          </div>
          <div className={s.detail_price_text}>
            <div>배송비</div>
            {/* 구독의 경우에는 모두 무료배송 */}
            <div>무료배송</div>
          </div>
          <div className={s.detail_price_text}>
            <div>할인&혜택</div>
            <span>
              {calcResult?.discountTotal +
                info.subscribeDto.originPrice *
                  getDeliveryCount(
                    subscriptionMonthType[subscriptionMonthTypeKey],
                  ) *
                  (info.subscribeDto.discountPlan / 100) >
                0 && '-'}
              {/* 총 할인금액 = 계산된할인금액(플랜할인율 미적용) + 1개원가*배송횟수*플랜할인율(플랜할인금액) */}
              {transformLocalCurrency(
                calcResult?.discountTotal +
                  Math.floor(
                    info.subscribeDto.originPrice *
                      getDeliveryCount(
                        subscriptionMonthType[subscriptionMonthTypeKey],
                      ) *
                      (info.subscribeDto.discountPlan / 100),
                  ),
              )}
              원
            </span>
          </div>
        </div>

        {/* 할인&혜택 상세내역 */}
        <div className={s.benefit_discount_list}>
          <div className={s.subscribe_discount}>
            <h4>할인</h4>
            <div className={s.discount_info_list}>
              {orderType === 'subscribe' && form.subscriptionMonth && (
                <div className={`${s.discount_info} ${s.red_text}`}>
                  <div>
                    {form.subscriptionMonth}개월 패키지 할인 (
                    {getMonthDiscount(form.subscriptionMonth)}%)
                  </div>
                  <div>
                    <span>
                      {calcResult?.discountSubscriptionMonth > 0 && '-'}
                      {transformLocalCurrency(
                        calcResult?.discountSubscriptionMonth,
                      )}
                      원
                    </span>
                  </div>
                </div>
              )}
              {orderType === 'subscribe' &&
                (info.subscribeDto.plan === 'FULL' ||
                  info.subscribeDto.plan === 'HALF') && (
                  <div className={`${s.discount_info} ${s.red_text}`}>
                    <div>
                      {subscribePlanType[info.subscribeDto.plan].KOR} 할인 (
                      {info.subscribeDto.discountPlan}%)
                    </div>
                    <div>
                      <span>
                        {info.subscribeDto.originPrice *
                          getDeliveryCount(
                            subscriptionMonthType[subscriptionMonthTypeKey],
                          ) *
                          (info.subscribeDto.discountPlan / 100) >
                          0 && '-'}
                        {transformLocalCurrency(
                          Math.floor(
                            info.subscribeDto.originPrice *
                              getDeliveryCount(
                                subscriptionMonthType[subscriptionMonthTypeKey],
                              ) *
                              (info.subscribeDto.discountPlan / 100),
                          ),
                        )}
                        원
                      </span>
                    </div>
                  </div>
                )}

              {form.subscriptionMonth === null && (
                <div className={s.discount_info}>
                  <div>등급</div>
                  <div>
                    <span>
                      {transformClearLocalCurrency(calcResult?.discountGrade) >
                        0 && '- '}
                      {transformLocalCurrency(calcResult?.discountGrade)}원
                    </span>
                  </div>
                </div>
              )}
              <div className={s.discount_info}>
                <div>쿠폰</div>
                <div>
                  {' '}
                  {calcResult?.discountCoupon > 0 && '-'}
                  {transformLocalCurrency(calcResult?.discountCoupon)}원
                </div>
              </div>
              <div className={s.discount_info}>
                <div>적립금</div>
                <div>
                  {transformClearLocalCurrency(calcResult?.discountReward) >
                    0 && '- '}
                  {transformLocalCurrency(calcResult?.discountReward)}원
                </div>
              </div>
            </div>
          </div>

          {/* (2) 혜택 내역 */}
          <div className={s.benefit_info_list}>
            <h4>혜택</h4>
            {subscriptionMonthItems.map(
              (item, i) =>
                form.subscriptionMonth === item.value && (
                  <div key={i} className={s.benefit_wrapper}>
                    {/* 진단기기 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row2}{' '}
                      </div>
                      {item.bodyDescHTML.row7}
                    </div>

                    {/* 토퍼 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row3}
                      </div>
                      {item.bodyDescHTML.row8}
                    </div>
                    {/* 무료배송 */}
                    <div className={s.benefit_info}>
                      <div className={s.benefit_title}>
                        {item.bodyDescHTML.row5}
                      </div>
                      {item.bodyDescHTML.row9}
                    </div>
                    {/* 건너뛰기 */}
                    {item.bodyDescHTML.row10}
                  </div>
                ),
            )}
          </div>
        </div>

        {/* <OrdersheetAmountOfPayment
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                event={{ onActiveModal: onActivleModalHandler }}
                formErrors={formErrors}
              /> */}
      </section>

      {/* 2) 총 할인금액 */}
      {/* <div className={s.total_discount_list}>
          <h2>총 할인금액</h2>
          <p>-{transformLocalCurrency(discountPrice)}원</p>
        </div> */}
    </>
  );
}
