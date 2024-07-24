import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import React, { useState } from 'react';
import ErrorMessage from '../atoms/ErrorMessage';
import Image from 'next/image';

export const OrdersheetItemList = ({
  info,
  form,
  setForm,
  isLoading,
  event = { onActiveModal },
  itemImgUrlList,
}) => {
  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);
  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  const onCancleCoupon = (e) => {
    const btn = e.currentTarget;
    const itemId = Number(btn.dataset.itemId);
    const appliedCouponId = Number(btn.dataset.appliedCouponId);
    setForm((prevState) => ({
      ...prevState,
      orderItemDtoList: prevState.orderItemDtoList.map((item) => {
        const restoredOrderLinePrice =
          item.orderLinePrice + item.discountAmount;
        const updatedState = {
          ...item,
          memberCouponId: null,
          discountAmount: 0,
          orderLinePrice: restoredOrderLinePrice,
        };
        return item.itemId === itemId ? updatedState : item;
      }),
      coupons: prevState.coupons.map((coupon) => {
        return coupon.memberCouponId === appliedCouponId
          ? {
              ...coupon,
              remaining: ++coupon.remaining,
            }
          : coupon;
      }),
    }));
  };

  const onMouseEnterHandler = (e) => {
    const btn = e.currentTarget;
    btn.innerText = '적용 취소';
  };

  const onMouseLeaveHandler = (e) => {
    const btn = e.currentTarget;
    btn.innerText = '적용됨';
  };

  return (
    <>
      <div className={s.order_btn}>
        <div className={s.order_btn_title}>
          <div>주문 상품</div>
          <Image
            src={'/img/order/open_btn.svg'}
            alt="open_btn"
            width={16}
            height={16}
            style={{ transform: `rotate(${rotation}deg)` }}
            onClick={onClickArrowIcon}
          />
        </div>
        <ul className={isArrowActive ? s.order_list_active : ''}>
          {isLoading.item ? (
            <ErrorMessage loading={<Spinner />} fullWidth={true} />
          ) : (
            <li className={s.flex_box}>
              {form.orderItemDtoList?.map((item, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <div className={s.recipe_list_content}>
                    {itemImgUrlList.find((img) => img.id === item.itemId)
                      ?.url && (
                      <Image
                        src={
                          itemImgUrlList.find((img) => img.id === item.itemId)
                            ?.url
                        }
                        alt="recipeThumbnail"
                        width={90}
                        height={90}
                      />
                    )}
                    <div className={s.recipe_list_text}>
                      <p className={s.recipe_name}>{item.name}</p>
                      <p className={s.recipe_info}>
                        일반상품 | {item.amount}개
                      </p>
                    </div>
                  </div>

                  <div className={s.apply_coupon_col}>
                    {item.discountAmount ? (
                      <button
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
                      </button>
                    ) : (
                      <button
                        type={'button'}
                        className={`${s['btn']}`}
                        data-modal-type={'coupons'}
                        data-item-id={item.itemId}
                        onClick={event.onActiveModal}
                      >
                        쿠폰 선택
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </li>
          )}
        </ul>
      </div>

      {/* ! [삭제 예정] */}
      {/* <section className={s.content_box}>
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
            <ErrorMessage loading={<Spinner />} fullWidth={true}/>
          ) : (
            form.orderItemDtoList?.map( (item, index) =><li key={`item-${item.itemId}-${index}`} className={s.flex_box}>
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
                {(item.originalOrderLinePrice !== item.orderLinePrice) && item.orderLinePrice !== 0 && (
                  <div className={s.price_inner}>
                    {transformLocalCurrency( item.originalOrderLinePrice )}원
                  </div>
                )}
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
          )}
        </ul>
      </section> */}
    </>
  );
};
