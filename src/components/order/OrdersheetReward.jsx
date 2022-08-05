import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import React, { useState } from 'react';
import filter_emptyValue from '../../../util/func/filter_emptyValue';
import filter_onlyNumber from '../../../util/func/filter_onlyNumber';
import ErrorMessage from '../atoms/ErrorMessage';
import transformLocalCurrency from '../../../util/func/transformLocalCurrency';
import transformClearLocalCurrency from "../../../util/func/transformClearLocalCurrency";
import {calcOrdersheetPrices} from "./calcOrdersheetPrices";

export const OrdersheetReward = ({ id, info, form, setForm, formErrors, setFormErrors, orderType='general' }) => {
  
  let availableMaxReward
  if(orderType === 'general'){
    availableMaxReward = info.reward > form.orderPrice ? form.orderPrice: info.reward
  }else if (orderType === 'subscribe') {
    availableMaxReward = info.reward > form.orderPrice ? form.orderPrice : info.reward
  }
  
  const onInputChangeHandler = (e) => {
    const currentItemPrice = orderType === 'general' ? info.orderPrice : info.subscribeDto.nextPaymentPrice;
    
    const input = e.currentTarget;
    const { value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
    }
    
    let error='';
    if(filteredValue > currentItemPrice) {
      filteredValue = 0;
      error = '주문금액을 초과하여 사용할 수 없습니다.'
    } else if (filteredValue > availableMaxReward ) {
      filteredValue = 0;
      error = '사용가능한 포인트를 초과하였습니다.'
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
      [id]: filteredValue,
    }));
  };

  const onClickDisCountReward = () => {
    setForm((prevState) => ({
      ...prevState,
      [id]: calcOrdersheetPrices(form).availableMaxReward,
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
