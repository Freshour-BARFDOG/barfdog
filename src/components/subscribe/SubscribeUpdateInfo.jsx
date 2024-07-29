import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, { useState } from 'react';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { Modal_couponWithSubscribeApi } from '../modal/Modal_couponWithSubscribeApi';
import { useModalContext } from '/store/modal-context';
import Tooltip from '../atoms/TooltipSubscrib';
import { calcSubscribeNextPaymentPrice } from '/util/func/subscribe/calcSubscribeNextPaymentPrice';
import { roundedOneMealGram } from '../../../util/func/subscribe/roundedOneMealGram';
import { SubscribeStatusTag } from './SubscribeStatusTag';

export const SubscribeUpdateInfo = ({ subscribeInfo }) => {
  // ! 구독정보 변경마감일자 체크 (google sheet);
  const info = {
    subscribeStatus: subscribeInfo.info.subscribeStatus,
    dogName: subscribeInfo.info.dogName,
    planName: subscribeInfo.info.planName,
    recipeNameList: subscribeInfo.info.recipeNames?.split(','),
    oneMealGramsPerRecipe: subscribeInfo.info.oneMealGramsPerRecipe,
    nextPaymentDate: subscribeInfo.info.nextPaymentDate,
    nextPaymentPrice: calcSubscribeNextPaymentPrice({
      originPrice: subscribeInfo.info.nextPaymentPrice,
      discountCoupon: subscribeInfo.info.discountCoupon,
      discountGrade: subscribeInfo.info.discountGrade,
      overDiscount: subscribeInfo.info.overDiscount,
    }),
    nextDeliveryDate: subscribeInfo.info.nextDeliveryDate,
    countSkipOneTime: subscribeInfo.info.countSkipOneTime,
    countSkipOneWeek: subscribeInfo.info.countSkipOneWeek,
    subscribeCount: subscribeInfo.info.subscribeCount,
    coupon: {
      // 쿠폰은 상품 당, 하나만 적용됨
      subscribeId: subscribeInfo.info.subscribeId,
      usedCoupon: {
        usingMemberCouponId: subscribeInfo.info.usingMemberCouponId, // 사용된 쿠폰 id
        couponName: subscribeInfo.info.couponName, // 쿠폰명
        discountCoupon: subscribeInfo.info.discountCoupon, // 쿠폰 할인금액
        overDiscount: subscribeInfo.info.overDiscount, // 초과할인금액
      },
      availableCouponList: subscribeInfo.coupon || [],
      originPrice: subscribeInfo.info.nextPaymentPrice,
      discountGrade: subscribeInfo.info.discountGrade,
    },
  };
  const mct = useModalContext();
  const [submitted, setSubmitted] = useState(false);
  const [activeModal, setActiveModal] = useState(false);

  const onActiveCouponModal = () => {
    if (!info.coupon.availableCouponList.length) {
      mct.alertShow('적용가능한 쿠폰이 없습니다.');
      return;
    }

    setActiveModal({ coupon: true });
  };

  const hideCouponModal = () => {
    if (submitted) {
      window.location.reload();
    } else {
      mct.alertHide();
      setActiveModal({ coupon: false });
    }
  };

  const onPrevPage = () => {
    router.push('/mypage');
  };

  return (
    <>
      <header>
        <div className={s.prev_btn} style={{ cursor: 'pointer' }}>
          <Image
            src={'/img/order/left_arrow.svg'}
            alt="left_arrow"
            width={24}
            height={24}
            onClick={onPrevPage}
          />
        </div>
      </header>
      <section className={s.title}>
        <div className={s.title_text}>{info.dogName}의 AI 추천 식단</div>
      </section>
      <section className={s.content_box}>
        <div className={s.top_flex_box}>
          <div className={s.top_left_box}>
            <h3>변경 전</h3>
            <div className={`${s.top_flex_box2} ${s.first}`}>
              <div className={s.left}>플랜</div>
              <div className={s.right}>
                {subscribePlanType[info.planName].KOR}
              </div>
            </div>

            <div className={`${s.top_flex_box2} ${s.second}`}>
              <div className={s.left}>레시피</div>
              <div className={s.right}>
                {info.recipeNameList.length > 0 ? (
                  <p>{info.recipeNameList.join(', ')}</p>
                ) : (
                  '-'
                )}
              </div>
            </div>

            <div className={`${s.top_flex_box2} ${s.third}`}>
              <div className={s.left}>하루 식사량</div>
              <div className={s.right}>
                {info.oneMealGramsPerRecipe ? (
                  <p>
                    {info.oneMealGramsPerRecipe
                      .map(
                        (oneMealGram, index) =>
                          `${transformLocalCurrency(
                            roundedOneMealGram(oneMealGram),
                          )}g`,
                      )
                      .join(', ')}
                  </p>
                ) : (
                  '-'
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {activeModal.coupon && (
        <Modal_couponWithSubscribeApi
          data={info.coupon}
          event={{ hideModal: hideCouponModal }}
          setSubmitted={setSubmitted}
        />
      )}
    </>
  );
};
