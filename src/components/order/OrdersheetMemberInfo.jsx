// ! 확인할 사항: 유저의 첫구매 여부 ( 첫구매 아닐 시, 첫구매 브로슈어 수령 checkbox란 ===>  hide 처리)
import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import {transformPhoneNumber} from '../../../util/func/transformPhoneNumber';
import React from 'react';

export const OrdersheetMemberInfo = ({info}) => {
  return (
    <>
      <section className={s.orderer_info}>
        <div className={s.title}>주문자 정보</div>
        <div className={s.grid_box}>
          <div>보내는 분</div>
          <div>{info.name}</div>
          <div>이메일</div>
          <div>{info.email}</div>
          <div>연락처</div>
          <div>{transformPhoneNumber( info.phoneNumber )}</div>
        </div>
      </section>
      <section className={s.line}>
        <hr/>
      </section>
    </>
  );
};