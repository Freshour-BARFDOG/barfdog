import { useMemo, useState } from 'react';
import s from '../../pages/order/ordersheet/ordersheet.module.scss';

export default function OrdersheetCouponSelector({
  form,
  setForm,
  itemInfo,
  event = { onActiveModal },
}) {

  const allCoupons = useMemo(
    () => [
      ...(form.coupons || []),
      ...(form.allianceCoupons || []),
    ],
    [form.coupons, form.allianceCoupons]
  );

  // 사용 가능 쿠폰 개수 계산
  const usableCouponsCount = useMemo(
    () => allCoupons.filter(coupon => itemInfo.orderPrice >= coupon.availableMinPrice).length,
    [allCoupons, itemInfo.orderPrice]
  );

  const totalAvailableCount = allCoupons.length;



  const handleCancelCoupon = () => {
    setForm((prevState) => {
      const appliedCouponId = prevState.memberCouponId;

      return {
        ...prevState,
        memberCouponId: null,
        discountCoupon: 0,
        coupons: prevState.coupons.map((coupon) =>
          coupon.memberCouponId === appliedCouponId
            ? { ...coupon, remaining: coupon.remaining + 1 }
            : coupon,
        ),
      };
    });
  };

  const handleApplyCoupon = () => {};

  return (
    <>
      <section className={s.reserves}>
        <div className={s.title}>쿠폰 적용</div>
        <div className={s.coupon_wrapper}>
          <div className={s.coupon_box}>
          {totalAvailableCount > 0 && form.memberCouponId ? (
              <span className={s.coupon_text}>
                <span className={s.coupon_text_point}>{form.discountCoupon}원</span> 할인 적용중
              </span>
            ) : usableCouponsCount > 0 ? (
              <span className={s.coupon_text}>
                사용가능한 쿠폰이 <span className={s.coupon_text_point}>{usableCouponsCount}</span>장 있어요
              </span>
            ) : (
              <span className={s.unusable_coupon_text_}>사용가능한 쿠폰이 없어요</span>
            )}
          </div>
          {form.memberCouponId ? (
            <button
              type={'button'}
              data-modal-type={'coupons'}
              className={s.coupon_cancel_button}
              onClick={handleCancelCoupon}
            >
              적용 취소
            </button>
          ) : (
            <button
              type={'button'}
              data-modal-type={'coupons'}
              className={s.coupon_button}
              onClick={event.onActiveModal}
            >
              쿠폰 사용
            </button>
          )}
        </div>
      </section>
      <section className={s.line}>
        <hr />
      </section>
    </>
  );
}
