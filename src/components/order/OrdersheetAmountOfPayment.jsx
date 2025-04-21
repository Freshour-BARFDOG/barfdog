import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import React, { useCallback, useEffect, useMemo } from 'react';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { calcOrderSheetPrices } from './calcOrderSheetPrices';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import { getCookie } from "../../../util/func/cookie";

export const OrdersheetAmountOfPayment = ({
  info,
  form,
  setForm,
  event,
  formErrors,
  orderType = 'general',
  hasAllianceDiscount
}) => {
  // 첫 정기구독 50% 할인 적용 검증
  const hasAllianceSubscribeDiscount = hasAllianceDiscount && info.newSubscribe;
  const calcResult = useCallback(
    calcOrderSheetPrices(
      form,
      orderType,
      {deliveryFreeConditionPrice: info.freeCondition,},
      orderType === 'general' ? hasAllianceDiscount : hasAllianceSubscribeDiscount
    ),
    [form, orderType],
  );
  const discountSubscribeAlliance = calcResult?.discountSubscribeAlliance || 0;
  console.log('calcResult', calcResult)
  const originalItemDiscount = useMemo(
    () =>
      orderType === 'general'
        ? info.totalOriginalPrice - info.totalOrderPrice
        : info.subscribeDto?.originPrice - info.subscribeDto?.nextPaymentPrice,
    [info],
  );
  return (
    <>
      <section className={s.payment}>
        <div className={s.title}>결제금액</div>

        <div className={s.flex_box}>
          <span>주문금액</span>
          <span>
            {transformLocalCurrency(
              orderType === 'general'
                ? info.totalOrderPrice
                : info.subscribeDto?.nextPaymentPrice,
            )}
            원
          </span>
          {/* !  모든 상품의 판매 가격 총합*/}
        </div>

        <div className={s.flex_box2}>
          <span>상품 금액</span>
          <span>
            {transformLocalCurrency(
              orderType === 'general'
                ? info.totalOriginalPrice
                : info.subscribeDto?.originPrice,
            )}
            원
          </span>
          {/* !  모든 상품의 할인 전 가격 총합*/}
        </div>

        <div className={s.flex_box3}>
          <span>상품 할인</span>
          <span className={originalItemDiscount > 0 ? 'pointColor' : ''}>
            {originalItemDiscount > 0 && '-'}&nbsp;
            {transformLocalCurrency(
              orderType === 'general'
                ? info.totalOriginalPrice - info.totalOrderPrice
                : info.subscribeDto?.originPrice -
                    info.subscribeDto?.nextPaymentPrice,
            )}
            원
          </span>
          {/* ! 상품 리스트 전체에 대한 : 할인 가격*/}
        </div>

        <hr />

        <div className={s.flex_box4}>
          <span>등급 할인</span>
          {orderType === 'general' ? (
            <span style={{ fontSize: '11px' }}>일반결제 미적용</span>
          ) : (
            info.subscribeDto && (
              <span>
                {info.subscribeDto?.discountGrade > 0 && '-'}
                {transformLocalCurrency(info.subscribeDto?.discountGrade)}원
              </span>
            )
          )}
        </div>

        <div className={s.flex_box4}>
          <span>쿠폰 할인</span>
          <span>
            {calcResult?.discountCoupon > 0 && '- '}
            {transformLocalCurrency(calcResult?.discountCoupon)}원
          </span>
        </div>

        {calcResult?.overDiscount > 0 && (
          <div className={s.flex_box4}>
            <span>쿠폰 초과할인 소멸</span>
            <span className={'pointColor'}>
              +{transformLocalCurrency(calcResult.overDiscount)}원
            </span>
          </div>
        )}

        <div className={s.flex_box5}>
          <span>적립금 사용</span>
          <span>
            {transformClearLocalCurrency(calcResult?.discountReward) > 0 &&
              '- '}
            {transformLocalCurrency(calcResult?.discountReward)}원
          </span>
        </div>

        <div className={s.flex_box6}>
          <span>배송비</span>
          <span>{transformLocalCurrency(calcResult?.deliveryPrice)}원</span>
        </div>

        <hr />

        {hasAllianceSubscribeDiscount &&
          <>
          <div className={s.flex_box6}>
            <span className='pointColor'>제휴사 첫 구독 50% 할인</span>
            <span className='pointColor'>
                {originalItemDiscount > 0 && '-'}&nbsp;
              {transformLocalCurrency(discountSubscribeAlliance)}
              원
              </span>
          </div>
          <hr />
          </>
        }

        <div className={s.last_flex_box}>
          <div className={s.flex_box}>
            <span>최종 결제금액</span>
            <span>
              {
                transformLocalCurrency(
                  hasAllianceSubscribeDiscount && discountSubscribeAlliance
                    ? discountSubscribeAlliance
                    : calcResult?.paymentPrice
                )}원
            </span>
          </div>
          {formErrors.paymentPrice && (
            <ErrorMessage>{formErrors.paymentPrice}</ErrorMessage>
          )}
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
            {formErrors.agreePrivacy && (
              <ErrorMessage>{formErrors.agreePrivacy}</ErrorMessage>
            )}
          </PureCheckbox>
        </div>
      </section>
    </>
  );
};
