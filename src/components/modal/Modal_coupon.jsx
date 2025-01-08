import s from './modal_coupon.module.scss';
import React, { useCallback, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import transformDate from '/util/func/transformDate';
import { discountUnitType } from '/store/TYPE/discountUnitType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { calcOrdersheetPrices } from '../order/calcOrdersheetPrices';
import EmptyMessage from '../atoms/AmdinErrorMessage';
import { useMediaQuery } from 'react-responsive';

export const Modal_coupon = ({
  onModalActive,
  itemInfo,
  info,
  form,
  setForm,
  orderType = 'general',
}) => {
  const [selectedRadioInfo, setSelectedRadioInfo] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 600 });
  // Selected Item Info
  let selectedItemPrice;
  const selectedItemId = Number(itemInfo.id);

  if (orderType === 'general') {
    selectedItemPrice = form.orderItemDtoList.filter(
      (item) => item.itemId === selectedItemId,
    )[0].orderLinePrice;
  } else if (orderType === 'subscribe') {
    selectedItemPrice = itemInfo.nextPaymentPrice;
  }

  const onChangeHandler = useCallback(
    (e) => {
      const radio = e.currentTarget;
      const radioId = radio.id;
      const couponId = Number(radio.dataset.couponId);
      const couponDiscountAmount = Number(radio.dataset.discountAmount);
      const availableCouponMaxDiscount = calcOrdersheetPrices(form, orderType, {
        deliveryFreeConditionPrice: info.freeCondition,
      })?.availableMaxDiscount.coupon;
      if (availableCouponMaxDiscount <= 0) {
        return alert(
          '최소결제금액에 도달하여, 할인 쿠폰을 적용할 수 없습니다.',
        );
      }
      setSelectedRadioInfo((prevState) => ({
        ...prevState,
        id: radioId,
        couponId,
        couponDiscountAmount,
      }));
    },
    [form, orderType],
  );

  const onApplyingCoupon = useCallback(() => {
    if (!selectedRadioInfo) return alert('선택된 쿠폰이 없습니다.');
    const { couponId, couponDiscountAmount } = selectedRadioInfo;

    if (orderType === 'general') {
      setForm((prevState) => ({
        ...prevState,
        orderItemDtoList: prevState.orderItemDtoList.map((item) => {
          const updatedState = {
            ...item,
            memberCouponId: couponId,
            discountAmount: couponDiscountAmount,
            orderLinePrice: item.orderLinePrice - couponDiscountAmount,
          };
          return item.itemId === selectedItemId ? updatedState : item;
        }),
        coupons: prevState.coupons.map((coupon) =>
          coupon.memberCouponId === couponId
            ? {
                ...coupon,
                remaining: --coupon.remaining,
              }
            : coupon,
        ),
      }));
    } else if (orderType === 'subscribe') {
      setForm((prevState) => ({
        ...prevState,
        memberCouponId: couponId,
        discountCoupon: couponDiscountAmount,
        coupons: prevState.coupons.map((coupon) =>
          coupon.memberCouponId === couponId
            ? {
                ...coupon,
                remaining: --coupon.remaining,
              }
            : coupon,
        ),
      }));
    }
    onHideModal();
  }, [selectedRadioInfo, orderType, selectedItemId]);

  const onHideModal = () => {
    onModalActive((prevState) => ({
      ...prevState,
      coupons: false,
    }));
  };

  if (!form.coupons?.length) {
    return <EmptyMessage text="사용 가능한 쿠폰이 없습니다." />;
  }

  const processedCoupons = form.coupons
    .filter((item) => item.remaining > 0)
    .map((item) => {
      item.couponId = `coupon-${item.memberCouponId}`;
      let couponDiscountAmount = 0;
      let couponDiscountInfo;

      if (item.discountType === discountUnitType.FLAT_RATE) {
        couponDiscountInfo = `(${transformLocalCurrency(
          item.discountDegree,
        )}원)`;
        couponDiscountAmount = item.discountDegree;
      } else if (item.discountType === discountUnitType.FIXED_RATE) {
        couponDiscountInfo = `(${item.discountDegree}%)`;
        couponDiscountAmount = Math.floor(
          (selectedItemPrice * item.discountDegree) / 100,
        );
      }

      const isDisabled =
        selectedItemPrice < item.availableMinPrice ||
        couponDiscountAmount > item.availableMaxDiscount;

      return {
        ...item,
        couponDiscountInfo,
        couponDiscountAmount,
        isDisabled,
      };
    });

  // 쿠폰 정렬
  const sortedCoupons = processedCoupons.sort((a, b) => {
    // 1. 적용가능한 쿠폰이 상단에 위치
    if (a.isDisabled !== b.isDisabled) return a.isDisabled - b.isDisabled;

    // 2. 할인 금액이 높은 순으로 정렬
    if (b.couponDiscountAmount !== a.couponDiscountAmount)
      return b.couponDiscountAmount - a.couponDiscountAmount;

    // 3. 할인 금액이 동일한 경우 유효기간이 짧은 순으로 정렬
    return new Date(a.expiredDate) - new Date(b.expiredDate);
  });

  if (!Object.keys(form).length)
    return console.error('Faild to render because of empty data props');

  console.log('form', form);

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
              <span className={s.min_price}>최소주문금액</span>
              <span className={s.date}>유효기간</span>
              <span className={s.price}>할인금액</span>
            </div>
          </div>
          <div className={s.content_box}>
            {sortedCoupons.map((item) => (
              <label
                key={item.couponId}
                className={`${s.flex_box} ${s.coupons} ${
                  item.isDisabled ? s.disabled : ''
                }`}
                htmlFor={item.couponId}
              >
                <span className={s.radio}>
                  <input
                    id={item.couponId}
                    data-coupon-id={item.memberCouponId}
                    data-discount-amount={item.couponDiscountAmount}
                    type="radio"
                    name="coupon"
                    onChange={onChangeHandler}
                    checked={selectedRadioInfo?.id === item.couponId}
                    disabled={item.isDisabled}
                  />
                </span>
                <span
                  className={`${s.name} ${item.isDisabled ? s.grayText : ''}`}
                >
                  {item.name} {item.couponDiscountInfo}
                </span>
                <span
                  className={`${s.min_price} ${
                    item.isDisabled ? s.grayText : ''
                  }`}
                >
                  {isMobile
                    ? `${transformLocalCurrency(
                        item.availableMinPrice,
                      )}원 이상 구매시`
                    : `${transformLocalCurrency(item.availableMinPrice)}원`}
                </span>
                <span
                  className={`${s.date} ${item.isDisabled ? s.grayText : ''}`}
                >
                  {transformDate(item.expiredDate)}
                </span>

                <span
                  className={`${s.price} ${item.isDisabled ? s.grayText : ''}`}
                >
                  {transformLocalCurrency(item.couponDiscountAmount)}원 할인
                </span>
              </label>
            ))}
          </div>
          <div className={s.btn_box}>
            <button
              type={'button'}
              className={s.cancle_btn}
              onClick={onHideModal}
            >
              취소
            </button>
            <button
              type={'button'}
              className={s.choice_btn}
              onClick={onApplyingCoupon}
            >
              쿠폰적용
            </button>
          </div>
        </section>
      </ModalWrapper>
    </>
  );
};
