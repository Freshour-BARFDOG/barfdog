import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import React from 'react';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { calcOrdersheetPrices } from './calcOrdersheetPrices';

export const OrdersheetAmountOfPayment = ({
  info,
  form,
  setForm,
  event,
  formErrors,
  orderType = 'general',
}) => {
  return (
    <>
      <section className={s.payment}>
        <div className={s.title}>결제금액</div>

        <div className={s.flex_box}>
          <span>주문금액</span>
          <span>
            {transformLocalCurrency(
              orderType === 'general' ? info.totalOrderPrice : info.subscribeDto?.nextPaymentPrice,
            )}
            원
          </span>
          {/* !  모든 상품의 판매 가격 총합*/}
        </div>

        <div className={s.flex_box2}>
          <span>상품 금액</span>
          <span>
            {transformLocalCurrency(
              orderType === 'general' ? info.totalOriginalPrice : info.subscribeDto?.originPrice,
            )}
            원
          </span>
          {/* !  모든 상품의 할인 전 가격 총합*/}
        </div>

        <div className={s.flex_box3}>
          <span>상품 할인</span>
          <span className={'pointColor'}>
            -
            {transformLocalCurrency(
              orderType === 'general'
                ? info.totalOriginalPrice - info.totalOrderPrice
                : info.subscribeDto?.originPrice - info.subscribeDto?.nextPaymentPrice,
            )}
            원
          </span>
          {/* ! 상품 리스트 전체에 대한 : 할인 가격*/}
        </div>

        <hr />

        <div className={s.flex_box4}>
          <span>쿠폰할인금액</span>
          <span>
            {calcOrdersheetPrices(form, orderType).discountCoupon > 0 && '-'}
            {transformLocalCurrency(calcOrdersheetPrices(form, orderType).discountCoupon)}원
          </span>
        </div>
        {info.subscribeDto && (
          <div className={s.flex_box4}>
            <span>등급할인</span>
            <span>
              {info.subscribeDto?.discountGrade > 0 && '-'}
              {transformLocalCurrency(info.subscribeDto?.discountGrade)}원
            </span>
          </div>
        )}
        <div className={s.flex_box5}>
          <span>적립금사용</span>
          <span>
            {transformLocalCurrency(calcOrdersheetPrices(form, orderType).discountReward)}원
          </span>
        </div>

        <div className={s.flex_box6}>
          <span>배송비</span>
          <span>
            {orderType === 'subscribe' || info.deliveryFree
              ? 0
              : info.orderPrice >= info.freeCondition
              ? 0
              : transformLocalCurrency(info.deliveryPrice)}
            원
          </span>
        </div>

        <hr />

        <div className={s.last_flex_box}>
          <div className={s.flex_box}>
            <span>최종결제금액</span>
            <span>
              {transformLocalCurrency(calcOrdersheetPrices(form, orderType).paymentPrice)}원
            </span>
          </div>
          {formErrors.paymentPrice && <ErrorMessage>{formErrors.paymentPrice}</ErrorMessage>}
        </div>

        {/* - 브로슈어 받은 적 있는지 true/false */}
        {!info.brochure && (
          <div className={s.flex_box}>
            <PureCheckbox
              id={'brochure'}
              className={s.check_box}
              value={form.brochure || ''}
              setValue={setForm}
            >
              첫 구매 바프독 설명이 포함된 브로슈어를 받겠습니다.
            </PureCheckbox>
          </div>
        )}
        <div className={s.flex_box}>
          <PureCheckbox
            id={'agreePrivacy'}
            className={`${s.check_box} mb-0`}
            value={form.agreePrivacy || ''}
            setValue={setForm}
          >
            개인 정보 수집 이용 동의
            <button
              type={'button'}
              className={`${s['termsOfService']}`}
              data-modal-type={'termsOfService'}
              onClick={event.onActiveModal}
            >
              내용보기
            </button>
            {formErrors.agreePrivacy && <ErrorMessage>{formErrors.agreePrivacy}</ErrorMessage>}
          </PureCheckbox>
        </div>
      </section>
    </>
  );
};
