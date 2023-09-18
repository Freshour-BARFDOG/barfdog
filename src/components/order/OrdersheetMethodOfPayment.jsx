import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import {Payment} from './Payment';
import Image from 'next/image';
import React from 'react';
import {paymentMethodType} from "/store/TYPE/paymentMethodType";
import ErrorMessage from "../atoms/ErrorMessage";



export const OrdersheetMethodOfPayment = ({id, form, setForm, formErrors}) => {
  
  
  const onClickHandler = (e)=>{
    const button = e.currentTarget;
    const paymentMethod = button.dataset.paymentMethod;
    setForm(prevState => ({
      ...prevState,
      [id]: paymentMethod
    }))
  }
  
  
  return (
    <>
      <section className={s.method}>
        <div className={s.title}>결제수단</div>
        <ul className={s.grid_box}>
          <li className={`${s.inner_box} ${form[id] === paymentMethodType.CREDIT_CARD ? s.selected : ''}`} onClick={onClickHandler} data-payment-method={paymentMethodType.CREDIT_CARD}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require( '/public/img/cart/order_card.png' )}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
            신용카드
          </li>
          <li className={`${s.inner_box} ${form[id] === paymentMethodType.NAVER_PAY ? s.selected : ''}`} data-payment-method={paymentMethodType.NAVER_PAY} onClick={onClickHandler}>
            <div className={`${s.image} ${s.naverPay} img-wrap`}>
              <Image
                src={require( '/public/img/cart/order_naver(2023).png' )}
                objectFit="cover"
                layout="fill"
                alt="네이버 아이콘"
              />
            </div>
            네이버페이
          </li>
          <li className={`${s.inner_box} ${form[id] === paymentMethodType.KAKAO_PAY ? s.selected : ''}`} data-payment-method={paymentMethodType.KAKAO_PAY} onClick={onClickHandler}>
            <div className={`${s.image} img-wrap`}>
              <Image
                src={require( '/public/img/cart/order_kakao.png' )}
                objectFit="cover"
                layout="fill"
                alt="카카오 아이콘"
              />
            </div>
            카카오페이
          </li>
        </ul>
        {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
      </section>
      <section className={s.line}>
        <hr/>
      </section>
    </>
  );
};
