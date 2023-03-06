import React from 'react';
import s from './popup_sell.module.scss';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { orderStatus } from '/store/TYPE/orderStatusTYPE';
import {paymentMethodType} from "/store/TYPE/paymentMethodType";

const ProductInfo_payment = ({ paymentInfo }) => {
  // console.log(paymentInfo);
  return (
    <>
      <div className={s['t-header']}>
        <h4 className={s.title}>결제정보</h4>
      </div>
      <ul className={s['t-body']}>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 상품금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(paymentInfo.orderPrice)}원</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>총 결제금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(paymentInfo.paymentPrice)}원</span>
            </div>
          </div>
        </li>

        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>등급할인</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{paymentInfo.discountGrade > 0 && "-"}&nbsp;{transformLocalCurrency(paymentInfo.discountGrade)}원</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{paymentInfo.discountCoupon > 0 && "-"}&nbsp;{transformLocalCurrency(paymentInfo.discountCoupon)}원</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>적립금 사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{paymentInfo.discountReward > 0 && "-"}&nbsp;{transformLocalCurrency(paymentInfo.discountReward)}원</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰 할인 소멸</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {paymentInfo.overDiscount > 0 && "+"}&nbsp;{transformLocalCurrency(paymentInfo.overDiscount)}원
              </span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>배송비</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                {paymentInfo.deliveryPrice ? `${transformLocalCurrency( paymentInfo.deliveryPrice )}원` : '무료'}
              </span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>결제방법</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>
                <span>{paymentMethodType.KOR[paymentInfo.paymentMethod]}</span>
              </span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s.fullWidth}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>처리상태</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{orderStatus.KOR[paymentInfo.orderStatus]}</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};

export default ProductInfo_payment;
