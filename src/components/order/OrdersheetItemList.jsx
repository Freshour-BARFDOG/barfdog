import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import React from 'react';

export const OrdersheetItemList = ({form, setForm, isLoading, event = {onActiveModal}}) => {
  
  const onCancleCoupon = (e)=>{
    const btn = e.currentTarget;
    const itemId = Number(btn.dataset.itemId);
    const appliedCouponId = Number(btn.dataset.appliedCouponId);
    setForm(prevState => ({
      ...prevState,
      orderItemDtoList: prevState.orderItemDtoList.map((itemObj)=>{
        const updatedState = {
          ...itemObj,
          memberCouponId: null,
          discountAmount: 0,
        }
        return itemObj.itemId ===  Number(itemId) ? updatedState : itemObj
      }),
      coupons: prevState.coupons.map((coupon)=>{
        return coupon.memberCouponId === appliedCouponId ? {
          ...coupon,
          remaining: ++coupon.remaining
        } : coupon
      })
    }));
  }
  
  
  const onMouseEnterHandler = (e)=>{
    const btn = e.currentTarget;
    btn.innerText = '적용 취소';
  }
  
  const onMouseLeaveHandler = (e)=>{
    const btn = e.currentTarget;
    btn.innerText = '적용됨';
  }
  
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
            form.orderItemDtoList?.map( (item, index) =>{
            
              
              return (<li key={`item-${item.itemId}-${index}`} className={s.flex_box}>
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
                  style={{color: item.discountAmount ? '' : 'var(--color-disabled)'}}
                >
                  {item.discountAmount && '-' + transformLocalCurrency( item.discountAmount )}원
                </div>
                <div className={s.apply_coupon_col}>
                  
                  {item.discountAmount ? <button
                    type={'button'}
                    className={`${s['btn']} ${s.applied}`}
                    data-modal-type={'coupons'}
                    data-item-id={item.itemId}
                    data-applied-coupon-id={item.memberCouponId}
                    onClick={onCancleCoupon}
                    onMouseEnter={onMouseEnterHandler}
                    onMouseLeave={onMouseLeaveHandler}
                  >
                    적용됨
                  </button> : <button
                    type={'button'}
                    className={`${s['btn']}`}
                    data-modal-type={'coupons'}
                    data-item-id={item.itemId}
                    onClick={event.onActiveModal}
                  >
                    쿠폰 선택
                  </button>
                  }
                  
                </div>
              </li>)
            })
          )}
        </ul>
      </section>
    </>
  );
};