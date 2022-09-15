import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import React, { useState } from 'react';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {calcOrdersheetPrices} from "./calcOrdersheetPrices";

export const OrdersheetReward = ({ id, info, form, setForm, formErrors, setFormErrors, orderType='general' }) => {
  

  const onInputChangeHandler = (e) => {
    
    const input = e.currentTarget;
    const { value } = input;
    const filteredType = input.dataset.inputType;
    let enteredReward = value;
    if (filteredType) {
      enteredReward = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        enteredReward = filter_onlyNumber(enteredReward);
      }
    }
    
    
    const paymentPrice = calcOrdersheetPrices(form,orderType).paymentPrice;
    const subscribeLimitedPrice = info.subscribeDto.nextPaymentPrice - form.selfInfo?.discountGrade;
    const limitedPrice = orderType === 'general' ? paymentPrice : subscribeLimitedPrice;
  
    let error='';
    if(enteredReward > limitedPrice) {
      enteredReward = 0;
      error = '사용가능한 금액을 초과였습니다.'
    } else {
      error = ''
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
    console.log('전체 사용')
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
