import s from './modal_coupon.module.scss';
import React, { useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import transformDate from '/util/func/transformDate';
import { discountUnitType } from '/store/TYPE/discountUnitType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import EmptyMessage from '/src/components/atoms/AmdinErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import calculateSalePrice from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import Modal_global_alert from './Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { postObjData } from '/src/pages/api/reqData';

export const Modal_couponWithSubscribeApi = ({
  data,
  setAlertModalMessage,
  setSubmitted,
  event = { hideModal: null },
}) => {
  // INIT STATE
  const info = {
    subscribeId: data.subscribeId,
    originPrice: data.originPrice,
    discountGrade: data.discountGrade,
    usingMemberCouponId: data.usingMemberCouponId,
    availableCouponList:
      data.availableCouponList.map((coupon) => ({
        availableMaxDiscount: coupon.availableMaxDiscount,
        availableMinPrice: coupon.availableMinPrice,
        memberCouponId: coupon.memberCouponId, // 보유 쿠폰 id
        discountDegree: coupon.discountDegree,
        discountType: coupon.discountType,
        name: coupon.name,
        remaining: coupon.remaining,
        expiredDate: coupon.expiredDate,
      })) || [],
  };
  // 뿌린다.
  //

  const initSelectedCoupon = info.availableCouponList.filter(
    (coupon) => coupon.memberCouponId === info.usingMemberCouponId,
  )[0];
  const calcedCouponInfo = calculateSalePrice(
    info.originPrice,
    initSelectedCoupon?.discountType,
    initSelectedCoupon?.discountDegree,
  );
  const initialRadioInfo = {
    couponId: info.usingMemberCouponId,
    discountAmount: transformClearLocalCurrency(calcedCouponInfo.saleAmount),
    salePrice: transformClearLocalCurrency(calcedCouponInfo.salePrice) - info.discountGrade,
  };
  
  const mct = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRadioInfo, setSelectedRadioInfo] = useState(initialRadioInfo);

  

  const onChangeHandler = (e) => {
    const radio = e.currentTarget;
    const couponId = Number(radio.dataset.couponId);
    const couponDiscountAmount = Number(radio.dataset.discountAmount);
    const gradeDiscountAmount = info.discountGrade;
    const salePrice = Number(info.originPrice - couponDiscountAmount - gradeDiscountAmount);

    setSelectedRadioInfo({
      couponId,
      discountAmount: couponDiscountAmount,
      salePrice,
    });
  };

  const onApplyingCoupon = async () => {
    // 이미 적용된 쿠폰일 경우 => ERRRO;
    console.log(info)
    console.log(selectedRadioInfo)
    if (!selectedRadioInfo.couponId) return mct.alertShow('선택된 쿠폰이 없습니다.');
    if (selectedRadioInfo.couponId === info.usingMemberCouponId)
      return mct.alertShow('이미 적용된 쿠폰입니다.');
    const body = {
      memberCouponId: selectedRadioInfo.couponId,
      discount: selectedRadioInfo.discountAmount,
    };
    try {
      setIsLoading(true);
      const url = `/api/subscribes/${info.subscribeId}/coupon`;
      const res = await postObjData(url, body);
      // console.log(res);
      // if (!res.isDone) { // ! TEST CODE //
        if (res.isDone) {  // ! PRODUCT CODE //
        setSubmitted(true);
        setAlertModalMessage('쿠폰이 적용되었습니다.');
      } else {
        setAlertModalMessage(`데이터 전송 실패\n${res.error}`);
      }
      mct.alertShow();
    } catch (err) {
      console.error('err: ', err);
    }
    setIsLoading(false);
  }
  

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={event.hideModal}
        className={`${s['modal-container']} animation-show-all-child`}
        positionCenter
      >
        <div className={s.modal}>
          <section className={s.title_box}>
            <h3 className={s.title}>사용 가능 쿠폰</h3>
          </section>
          <div className={s.content_box}>
            <div className={`${s.flex_box} ${s.header}`}>
              <span className={s.coupon_title}>쿠폰명</span>
              <span>적용가능수량</span>
              <span>유효기간</span>
              <span>할인금액</span>
            </div>
          </div>
          <section className={s.content_box}>
            {info?.availableCouponList.length > 0 ? (
              info.availableCouponList
                .filter((item) => {
                  // 1. SET Coupon Info
                  item.couponId = `coupon-${item.memberCouponId}`;
                  const { salePrice, saleAmount } = calculateSalePrice(
                    info.originPrice,
                    item.discountType,
                    item.discountDegree,
                  );
                  item.salePrice = transformClearLocalCurrency(salePrice);
                  item.discountAmount = transformClearLocalCurrency(saleAmount);

                  // STEP 2. validation
                  let valid = false;
                  if (
                    item.remaining > 0 &&
                    info.originPrice >= item.availableMinPrice &&
                    item.discountAmount <= item.availableMaxDiscount
                  ) {
                    valid = true;
                  }
                  // console.log(item, valid);
                  return valid && item;
                })
                .map((item, index) => (
                  <label
                    key={`couopn-list-${item.couponId}`}
                    className={`${s.flex_box} ${s.coupons}`}
                    htmlFor={item.couponId}
                  >
                    <span className={s.radio}>
                      <input
                        id={item.couponId}
                        data-coupon-id={item.memberCouponId}
                        data-discount-amount={item.discountAmount}
                        type="radio"
                        name={'coupon'}
                        onChange={onChangeHandler}
                        checked={
                          selectedRadioInfo.couponId
                            ? selectedRadioInfo.couponId === item.memberCouponId
                            : info.usingMemberCouponId === item.memberCouponId
                        }
                      />
                    </span>

                    <span className={s.name}>{`${item.name} (${transformLocalCurrency(
                      item.discountDegree,
                    )}${
                      item.discountType === discountUnitType.FIXED_RATE
                        ? discountUnitType.KOR.FIXED_RATE
                        : discountUnitType.KOR.FLAT_RATE
                    } 할인)`}</span>
                    <span className={s.count}>{item.remaining}개</span>
                    <span className={s.date}>{transformDate(item.expiredDate)}</span>
                    <span className={s.price}>{transformLocalCurrency(item.discountAmount)}원</span>
                  </label>
                ))
            ) : (
              <EmptyMessage text={'사용가능한 쿠폰이 없습니다.'} />
            )}
          </section>
          <section className={s.calculator}>
            <div className={s.col_1}>
              <p>상품금액</p>
              <span className={s.text_price}>{transformLocalCurrency(info.originPrice)}원</span>
            </div>
            <i className={s.line}></i>
            <div className={s.col_2}>
              <p>할인금액</p>
              <span className={s.text_price}>
                {transformLocalCurrency(selectedRadioInfo.discountAmount)}원
              </span>
            </div>
            <i className={s.line}></i>
            <div className={s.col_2}>
              <p>등급할인금액</p>
              <span className={s.text_price}>
                {transformLocalCurrency(info.discountGrade)}원
              </span>
            </div>
            <i className={s.vertical_line}></i>
            <div className={s.col_3}>
              할인 후 금액
              <span>{transformLocalCurrency(selectedRadioInfo.salePrice)}원</span>
            </div>
          </section>

          <section className={s.btn_box}>
            <button type={'button'} className={s.cancle_btn} onClick={event.hideModal}>
              취소
            </button>
            <button type={'button'} className={s.choice_btn} onClick={onApplyingCoupon}>
              {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '쿠폰적용'}
            </button>
          </section>
        </div>
      </ModalWrapper>
    </>
  );
};
