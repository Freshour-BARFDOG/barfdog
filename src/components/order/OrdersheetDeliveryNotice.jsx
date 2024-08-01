import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import React, { useState } from 'react';
import ErrorMessage from '../atoms/ErrorMessage';
import Image from 'next/image';

export const OrdersheetDeliveryNotice = ({
  info,
  form,
  setForm,
  itemImgUrlList,
}) => {
  return (
    <>
      <div className={s.order_btn}>
        <div className={s.order_btn_title}>
          <div>배송 예정일 안내</div>
        </div>
        <div className={s.delivery_notice_text}>
          <div>
            - 일반 상품(냉동)은 <span>출고까지 최대 7일 소요</span> <br />- 일반
            상품(상온)은 <span>주문 후 1~2일 이내 발송</span> 예정
          </div>
          <p>모든 제품은 출고 후 알림톡이 발송</p>
        </div>
      </div>
    </>
  );
};
