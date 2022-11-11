import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import React, { useState } from 'react';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {calcOrdersheetPrices} from "./calcOrdersheetPrices";

export const OrdersheetReward = ({ id, info, form, setForm, formErrors, setFormErrors, orderType='general' }) => {
  

  const onInputChangeHandler = (e) => {
    // 본인의 사용가능한 금액보다 큰지 확인한다.
    const input = e.currentTarget;
    const { value } = input;
    let enteredReward = value;
    const availableReward = info.reward;
  

    enteredReward = filter_emptyValue(value);
    enteredReward = filter_onlyNumber(enteredReward);
  

    // ! 0916금 적립금 사용금액 제한 해제 => 최종 결제 시에 최소결제금액 100원만 validation처리
    
    // const generalLimitedPrice = form.orderPrice - form.discountCoupon;
    // const subscribeLimitedPrice = info.subscribeDto?.nextPaymentPrice - form.selfInfo?.discountGrade;
    // const minPaymentPrice = 100;
    // const limitedPrice =( orderType === 'general' ? generalLimitedPrice : subscribeLimitedPrice) - minPaymentPrice;
    //
    // console.log(generalLimitedPrice)
    // console.log(limitedPrice)

    // if(enteredReward > limitedPrice) {
    //   enteredReward = 0;
    //   error = '사용가능한 금액을 초과였습니다.'
    // } else {
    //   error = ''
    // }

    
    let error='';
    const numberTypeReward = Number(filter_onlyNumber(enteredReward));

  
    if(availableReward < 0 || numberTypeReward > availableReward){
      error ='사용가능 범위를 넘었습니다.';
      enteredReward= 0;
    }
    setFormErrors(prevState=>({
        ...prevState,
        [id] : error
      })
    )
    
    
    setForm((prevState) => ({
      ...prevState,
      [id]: enteredReward,
    }));
  };

  const onClickDisCountReward = () => {
    setForm((prevState) => ({
      ...prevState,
      [id]: calcOrdersheetPrices(form, orderType).availableMaxReward,
    }));
  };
  

  return (
    <>
      <section className={s.reserves}>
        <div className={s.title}>적립금</div>

        <div className={s.flex_box}>
          <p>적립금사용</p>
          <div className={s.input_box}>
            <div className={s['input-wrap']}>
              <input
                id={'discountReward'}
                type={'text'}
                className={'text-align-right'}
                data-input-type={'currency, number'}
                value={transformLocalCurrency(form.discountReward) || 0}
                onChange={onInputChangeHandler}
              />
              {formErrors.discountReward && <ErrorMessage>{formErrors.discountReward}</ErrorMessage>}
            </div>
            <button type={'button'} className={s.btn_box} onClick={onClickDisCountReward}>
              모두 사용
            </button>
            <span className={s.point}>
              <p>보유 포인트</p> {transformLocalCurrency(info.reward)+' P'}
            </span>
          </div>
        </div>
      </section>

      <section className={s.line}>
        <hr />
      </section>
    </>
  );
};
