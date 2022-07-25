import s from '../../pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '../atoms/Spinner';
import transformLocalCurrency from '../../../util/func/transformLocalCurrency';
import React from 'react';

export const OrdersheetItemList = ({form, isLoading, event = {onActiveModal}}) => {
  return (
    <>
      <section className={s.title_box}>
        <div className={s.title}>주문서</div>
      </section>
      
      <section className={s.content_box}>
        <div className={s.title}>주문내역</div>
        <div className={s.flex_title_box}>
          <div>상품정보</div>
          <div>수량</div>
          <div>총 주문금액</div>
          <div>쿠폰할인</div>
          <div>쿠폰적용</div>
        </div>
        <ul className={s['item-container']}>
          {isLoading.item ? (
            <Spinner/>
          ) : (
            form.orderItemDtoList?.map( (item, index) => (
              <li key={`item-${item.itemId}-${index}`} className={s.flex_box}>
                <div className={s.info_col}>
                  {item.name}
                  {item.selectOptionDtoList?.map( (option) => (
                    <div key={`item-option-${option.itemOptionId}`} className={s.info_inner}>
                      옵션 : {option.name} {option.amount}개
                    </div>
                  ) )}
                </div>
                
                <div className={s.count_col}>{item.amount} 개</div>
                
                <div className={s.title_col}>총 주문금액</div>
                <div className={s.price_col}>
                  <div className={s.price_inner}>
                    {transformLocalCurrency( item.originalOrderLinePrice )}원
                  </div>
                  <span>{transformLocalCurrency( item.orderLinePrice )}원</span>
                </div>
                
                <div
                  className={`${s.coupon_col_red}`}
                  style={{color: !item.discountAmount && 'var(--color-disabled)'}}
                >
                  {item.discountAmount && '-' + transformLocalCurrency( item.discountAmount )}원
                </div>
                <div className={s.apply_coupon_col}>
                  <button
                    type={'button'}
                    className={`${s['btn']}`}
                    data-modal-type={'coupon'}
                    onClick={event.onActiveModal}
                  >
                    쿠폰 선택
                  </button>
                </div>
              </li>
            ) )
          )}
        </ul>
      </section>
    </>
  );
};