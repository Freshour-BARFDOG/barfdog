import React from 'react';
import s from './popup_sell.module.scss';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {orderStatus} from "/store/TYPE/orderStatusTYPE";

export default function ProductInfo_generalItem ({ itemInfo }) {
  // // console.log(itemInfo);
  return (
    <>
      <ul className={`popup_table_body ${s['t-body']} ${s['product-item-info']}`}>
        <p className={s['t-top-row']}>
          <span className={s['product-title']}>상품주문번호</span>
          <span className={s['product-idx']}>{itemInfo.orderItemDto.orderItemId}</span>
        </p>
        <li className={`${s['t-row']} ${s['fullWidth']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>상품명</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{itemInfo.orderItemDto.itemName}</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']} ${s['fullWidth']} ${s.autoHeight}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>옵션</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              {itemInfo.selectOptionDtoList?.length === 0 ? '-' : itemInfo.selectOptionDtoList.map((opt,i) => (
                <p key={`item-option-${opt.i}`} className={s.option}>
                  <span>{opt.optionName} ({transformLocalCurrency(opt.price)}원)&nbsp;&nbsp;/</span>
                  <span>{opt.amount}개&nbsp;&nbsp;/</span>
                  <span>
                  {transformLocalCurrency(opt.price * opt.amount)}원
                </span>
                </p>
              ))}
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰사용</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{itemInfo.orderItemDto.couponName}</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>쿠폰할인금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(itemInfo.orderItemDto.discountAmount)}원</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>상품수량</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{itemInfo.orderItemDto.amount}개</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>판매금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(itemInfo.orderItemDto.salePrice)}원</span>
            </div>
          </div>
        </li>
        <li className={`${s['t-row']}`}>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>처리상태</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{orderStatus.KOR[itemInfo.orderItemDto.status]}</span>
            </div>
          </div>
          <div className={s['t-box']}>
            <div className={`${s.innerBox} ${s.label}`}>
              <span>주문금액</span>
            </div>
            <div className={`${s.innerBox} ${s.cont}`}>
              <span>{transformLocalCurrency(itemInfo.orderItemDto.finalPrice)}원</span>
            </div>
          </div>
        </li>
      </ul>
    </>
  );
};
