import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import React, { useState } from 'react';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import ErrorMessage from '../atoms/ErrorMessage';

import { UnitOfDemicalPointOfOneMealGram } from '../../../util/func/subscribe/finalVar';
import Image from 'next/image';

export const OrdersheetSubscribeItemList = ({
  info,
  form,
  setForm,
  isLoading,
  orderType = 'general',
  event = { onActiveModal },
  subscribeInfo,
  recipeInfo,
  DATA,
}) => {
  const [isArrowActive, setIsArrowActive] = useState(false);
  const [rotation, setRotation] = useState(0);

  const onCancleCoupon = (e) => {
    const btn = e.currentTarget;
    const appliedCouponId = Number(btn.dataset.appliedCouponId);

    setForm((prevState) => ({
      ...prevState,
      memberCouponId: null,
      discountCoupon: 0,
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

  const onClickArrowIcon = (e) => {
    e.preventDefault();
    setIsArrowActive(!isArrowActive);
    setRotation((prevRotation) => (prevRotation + 180) % 360);
  };

  return (
    <>
      <div onClick={onClickArrowIcon} className={s.order_btn}>
        <div className={s.order_btn_title}>
          <div>주문 상품</div>
          <Image
            src={'/img/order/open_btn.svg'}
            alt="open_btn"
            width={16}
            height={16}
            style={{ transform: `rotate(${rotation}deg)` }}
          />
        </div>
        <ul className={isArrowActive ? s.order_list_active : ''}>
          {isLoading.item ? (
            <ErrorMessage loading={<Spinner />} fullWidth={true} />
          ) : (
            <li className={s.flex_box}>
              {info.recipeNameList?.map((name, i) => (
                <div key={i} className={s.recipe_list_content}>
                  <Image
                    src={info.recipeThumbnailList[i]}
                    alt="recipeThumbnail"
                    width={90}
                    height={90}
                  />
                  <div className={s.recipe_list_text}>
                    <p className={s.recipe_name}>
                      {info.recipeNameKoreanList[i]}
                    </p>
                    <p className={s.recipe_info}>
                      정기구독상품 |{' '}
                      {info.subscribeDto?.plan &&
                        subscribePlanType[info.subscribeDto?.plan].KOR}{' '}
                      |{' '}
                      {info.subscribeDto?.plan &&
                        subscribePlanType[info.subscribeDto?.plan]
                          .totalNumberOfPacks / info.recipeNameList.length}
                      팩{' '}
                      {/* --> 각 레시피의 팩 수 = 선택한 플랜의 전체 팩수 - 선택한 레시피 개수  */}
                      {/* [삭제예정] 무게 표시  */}
                      {/* (
                      {info.subscribeDto?.oneMealGramsPerRecipeList[i]?.toFixed(
                        UnitOfDemicalPointOfOneMealGram,
                      )}
                      g){' '}  */}
                    </p>
                  </div>
                </div>
              ))}
            </li>
          )}
        </ul>
      </div>

      {/* ! [삭제예정] */}
      {/* <section className={s.content_box}>
        <div className={s.title}>주문내역</div>
        <div className={s.flex_title_box}>
          <div>상품정보</div>
          <div>수량</div>
          <div>총 주문금액</div>
          <div>쿠폰할인</div>
          <div>쿠폰적용</div>
        </div>
        <ul className={`${s['item-container']} ${s.subscribe}`}>
          {isLoading.item ? (
            <ErrorMessage loading={<Spinner />} fullWidth={true} />
          ) : (
            <li className={s.flex_box}>
              <div className={s.info_col}>
                <p className={s.subscribeName}>
                  [정기구독]{' '}
                  {info.subscribeDto?.plan &&
                    subscribePlanType[info.subscribeDto?.plan].KOR}
                </p>
                {info.recipeNameList?.map((name, i) => (
                  <p key={`info-recipeName-${i}`} className={s.recipeName}>
                    {name} 레시피 (
                    {info.subscribeDto?.oneMealGramsPerRecipeList[i]?.toFixed(
                      UnitOfDemicalPointOfOneMealGram,
                    )}
                    g){' '}
                  </p>
                ))}
              </div>

              <div className={s.count_col}>{1} 개</div>

              <div className={s.title_col}>총 주문금액</div>
              <div className={s.price_col}>
                <div className={s.price_inner}>
                  {transformLocalCurrency(info.subscribeDto?.originPrice)}원
                </div>
                <span>
                  {transformLocalCurrency(info.subscribeDto?.nextPaymentPrice)}
                  원
                </span>
              </div>

              <div
                className={`${s.coupon_col_red}`}
                style={{
                  color: !form.discountCoupon && 'var(--color-disabled)',
                }}
              >
                {form.discountCoupon &&
                  '-' + transformLocalCurrency(form.discountCoupon)}
                원
              </div>
              <div className={s.apply_coupon_col}>
                {form.discountCoupon ? (
                  <button
                    type={'button'}
                    className={`${s['btn']} ${s.applied}`}
                    data-modal-type={'coupons'}
                    data-item-id={info.subscribeDto.id}
                    data-applied-coupon-id={form.memberCouponId}
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
                    data-item-id={form.coupons?.memberCouponId}
                    onClick={event.onActiveModal}
                  >
                    쿠폰 선택
                  </button>
                )}
              </div>
            </li>
          )}
        </ul>
      </section> */}
    </>
  );
};
