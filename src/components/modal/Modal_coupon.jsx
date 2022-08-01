import s from './modal_coupon.module.scss';
import React, { useState } from 'react';
import ModalWrapper from './ModalWrapper';
import transformDate from '/util/func/transformDate';
import { discountUnitType } from '/store/TYPE/discountUnitType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {calcOrdersheetPrices} from "../order/calcOrdersheetPrices";

/* availableMaxDiscount: 적용가능 최대 할인 금액
 * availableMinPrice : 사용가능한 최소 물품 가격
 *
 * */
export const Modal_coupon = ({ onModalActive, data, setForm, orderType ='general' }) => {
  
  
  // Selected Item Info
  let selectedItemPrice;
  let selectedItemId;
  let selectedItemInfo;
  if(orderType=== 'general'){
    selectedItemId = Number(data.selectedItemId);
    selectedItemInfo = data.orderItemDtoList.filter(
      (item) => item.itemId === selectedItemId,
    )[0];
    selectedItemPrice = selectedItemInfo.orderLinePrice;
  }else if ( orderType === 'subscribe'){
    selectedItemId = Number(data.selectedItemInfo.id);
    selectedItemPrice = data.selectedItemInfo.nextPaymentPrice
  }
  
  const [selectedRadioInfo, setSelectedRadioInfo] = useState(null);

  
  const onHideModal = () => {
    onModalActive((prevState) => ({
      ...prevState,
      coupons: false,
    }));
  };
  
  


  const onChangeHandler = (e) => {
    const radio = e.currentTarget;
    const radioId = radio.id;
    const couponId = radio.dataset.couponId;
    const itemId = radio.dataset.itemId;
    const discountAmount = radio.dataset.discountAmount;
    setSelectedRadioInfo((prevState) => ({
      ...prevState,
      id: radioId,
      couponId,
      itemId,
      discountAmount
    }));
  };

  
  const onApplyingCoupon = () => {
    if(!selectedRadioInfo) return alert('선택된 쿠폰이 없습니다.');
    const { couponId, itemId, discountAmount} = selectedRadioInfo;
    // console.log(couponId, itemId)
    if(orderType=== 'general') {
      setForm(prevState => ({
        ...prevState,
        orderItemDtoList: prevState.orderItemDtoList.map((itemObj)=>{
          const updatedState = {
            ...itemObj,
            memberCouponId: Number(couponId),
            discountAmount: Number(discountAmount)
          }
          return itemObj.itemId ===  Number(itemId) ? updatedState : itemObj
        }),
        coupons: prevState.coupons.map((coupon)=>coupon.memberCouponId === Number(couponId) ? {
          ...coupon,
          remaining: --coupon.remaining
        } : coupon)
      }));
    } else if (orderType === 'subscribe') {
      console.log('쿠폰 할인 시작')
      setForm(prevState => ({
        ...prevState,
        memberCouponId: Number(couponId),
        discountCoupon: Number(discountAmount),
        coupons: prevState.coupons.map((coupon)=>coupon.memberCouponId === Number(couponId) ? {
          ...coupon,
          remaining: --coupon.remaining
        } : coupon),
      }))
    }

    onHideModal();
    
    
  };
  

  if (!Object.keys(data).length)
    return console.error('Faild to render because of empty data props');

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        className={s['modal-container']}
        positionCenter
      >
        <section className={s.modal}>
          <div className={s.title_box}>
            <div className={s.title}>
              적용가능쿠폰 <span>쿠폰은 최대 1장까지 적용가능합니다.</span>
            </div>
          </div>
          <div className={s.content_box}>
            <div className={`${s.flex_box} ${s.header}`}>
              <span className={s.coupon_title}>쿠폰명</span>
              <span>적용가능수량</span>
              <span>유효기간</span>
              <span>할인금액</span>
            </div>
          </div>
          <div className={s.content_box}>
            {data.coupons?.length > 0
              ? data.coupons.filter(item=>{
                
                // 1. SET Coupon Info
                item.couponId = `coupon-${item.memberCouponId}`;
                let couponDiscountAmount = 0;
                let couponDiscountInfo;
                if (item.discountType === discountUnitType.FLAT_RATE) {
                  couponDiscountInfo =
                    transformLocalCurrency(item.discountDegree) + discountUnitType.KOR.FLAT_RATE;
                  couponDiscountAmount = item.discountDegree;
                } else if (item.discountType === discountUnitType.FIXED_RATE) {
                  couponDiscountInfo = item.discountDegree + discountUnitType.KOR.FIXED_RATE;
                  couponDiscountAmount = (selectedItemPrice * item.discountDegree) / 100;
                }
                item.couponDiscountInfo = couponDiscountInfo
                item.couponDiscountAmount = couponDiscountAmount
                // console.log(couponDiscountAmount)
                
                // STEP 2. ㅍalidation
                let valid = false;
                if(item.remaining > 0 && selectedItemPrice >= item.availableMinPrice && couponDiscountAmount <= item.availableMaxDiscount) {
                  // 쿠폰 사용조건 : 1. 재고있음 2. 아이템가격이 최소사용금액보다 큼  3. 쿠폰할인가가 쿠폰에 설정된 최대 사용가능가격보다 낮음
                  valid = true;
                }
                return valid && item;
                
              }).map((item) =>(
                <label
                  key={item.couponId}
                  className={`${s.flex_box} ${s.coupons}`}
                  htmlFor={item.couponId}
                >
                      <span className={s.radio}>
                        <input
                          id={item.couponId}
                          data-coupon-id={item.memberCouponId}
                          data-item-id={selectedItemId}
                          data-discount-amount={item.couponDiscountAmount}
                          type="radio"
                          name={'coupon'}
                          onChange={onChangeHandler}
                          checked={selectedRadioInfo?.id === item.couponId}
                        />
                      </span>
                      
                  <span className={s.name}>{`${item.name} (${item.couponDiscountInfo})`}</span>
                  <span className={s.count}>{item.remaining}개</span>
                  <span className={s.date}>{transformDate(item.expiredDate)}</span>
                  <span className={s.price}>
                        {transformLocalCurrency(item.couponDiscountAmount)}원 할인
                      </span>
                </label>
              ))
              : '사용가능한 쿠폰이 없습니다.'}
          </div>

          <div className={s.btn_box}>
            <button type={'button'} className={s.cancle_btn} onClick={onHideModal}>
              취소
            </button>
            <button type={'button'} className={s.choice_btn} onClick={onApplyingCoupon}>
              쿠폰적용
            </button>
          </div>
        </section>
      </ModalWrapper>
    </>
  );
};
