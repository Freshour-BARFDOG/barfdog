import React, { useCallback, useEffect, useMemo, useState } from 'react';
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
}) {
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

  const originalItemDiscount = useMemo(
    () => info.totalOriginalPrice - info.totalOrderPrice,
    [info],
  );

  return (
    <>
      {/* 3. 할인 금액 */}
      {/* <section className={s.discount}> */}
      {/* 1) 쿠폰 */}
      {/* <div className={s.coupon_list}>
          <div>쿠폰</div>
          <button
            type={'button'}
            className={`${s['coupons']}`}
            data-modal-type={'coupons'}
            onClick={onActivleModalHandler}
          >
            <b>쿠폰 적용 &gt; </b>
          </button>
        </div> */}

      {/* 2) 적립금 */}
      {/* <OrdersheetReward
          orderType={'subscribe'}
          id={'discountReward'}
          info={info}
          form={form}
          setForm={setForm}
          formErrors={formErrors}
          setFormErrors={setFormErrors}
        /> */}
      {/* </section> */}

      <section className={s.total_price} style={{ margin: '50px 40px' }}>
        <div className={s.total_price_wrapper}>
          <div className={s.total_price_text}>
            <h2>총 결제금액</h2>
            <div>{transformLocalCurrency(calcResult?.paymentPrice)}원</div>
          </div>
        </div>

        {/* 상세내역 */}
        <div className={s.detail_price_wrapper}>
          <div className={s.detail_price_text}>
            <div>상품금액</div>
            <div>{transformLocalCurrency(info.totalOriginalPrice)}원</div>
          </div>
          <div className={s.detail_price_text}>
            <div>배송비</div>
            <div>{transformLocalCurrency(calcResult?.deliveryPrice)}원</div>
          </div>
          <div className={s.detail_price_text}>
            <div>할인 금액</div>
            {originalItemDiscount + calcResult?.discountCoupon > 0 && '-'}&nbsp;
            {transformLocalCurrency(
              info.totalOriginalPrice -
                info.totalOrderPrice +
                calcResult?.discountCoupon +
                calcResult?.discountReward,
            )}
            원{/* 전체 할인금액 = 자체 할인금액 + 쿠폰 + 적립금 */}
          </div>
        </div>

        {/* 할인 상세내역 */}
        <div className={s.benefit_discount_list}>
          <div
            className={s.subscribe_discount}
            style={{
              border: 'none',
              padding: '0',
            }}
          >
            <h4>할인</h4>
            <div className={s.discount_info_list}>
              <div className={s.discount_info}>
                <div>상품 자체 할인</div>
                <span className={originalItemDiscount > 0 ? 'pointColor' : ''}>
                  {originalItemDiscount > 0 && '-'}&nbsp;
                  {transformLocalCurrency(
                    info.totalOriginalPrice - info.totalOrderPrice,
                  )}
                  원{/* ! 상품 리스트 전체에 대한 : 할인 가격 */}
                </span>
              </div>

              <div className={s.discount_info}>
                <div>쿠폰</div>
                <div>
                  {' '}
                  {calcResult?.discountCoupon > 0 && '-'}
                  {transformLocalCurrency(calcResult?.discountCoupon)}원
                </div>
              </div>
              {calcResult?.overDiscount > 0 && (
                <div className={s.flex_box4}>
                  <span>쿠폰 초과할인 소멸</span>
                  <span className={'pointColor'}>
                    +{transformLocalCurrency(calcResult.overDiscount)}원
                  </span>
                </div>
              )}

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
        </div>
      </section>
    </>
  );
}
