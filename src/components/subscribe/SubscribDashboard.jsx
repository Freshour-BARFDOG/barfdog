import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, { useState } from 'react';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { Modal_couponWithSubscribeApi } from '../modal/Modal_couponWithSubscribeApi';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import Tooltip from "../atoms/Tooltip";



export const SubscribDashboard = ({ subscribeInfo }) => {
  // ! 구독정보 변경마감일자 체크 (google sheet);
  const info = {
    dogName: subscribeInfo.info.dogName,
    planName: subscribeInfo.info.planName,
    recipeNameList: subscribeInfo.info.recipeNames.split(','),
    oneMealRecommendGram: subscribeInfo.info.oneMealRecommendGram,
    nextPaymentDate: subscribeInfo.info.nextPaymentDate,
    nextPaymentPrice: subscribeInfo.info.nextPaymentPrice - (subscribeInfo.info.discountCoupon + subscribeInfo.info.discountGrade), // 다음결제금액 -(쿠폰할인+등급할인)
    nextDeliveryDate: subscribeInfo.info.nextDeliveryDate,
    countSkipOneTime: subscribeInfo.info.countSkipOneTime,
    countSkipOneWeek: subscribeInfo.info.countSkipOneWeek,
    subscribeCount: subscribeInfo.info.subscribeCount,
    coupon: {
      // 쿠폰은 상품 당, 하나만 적용됨
      subscribeId: subscribeInfo.info.subscribeId,
      usingMemberCouponId: subscribeInfo.info.usingMemberCouponId,
      // availableCouponList: DUMMY_COUPON_DATA, /////////////////// ! TEST TEST TEST TEST TEST TEST TEST TEST TEST
      availableCouponList: subscribeInfo.coupon || [],
      originPrice: subscribeInfo.info.nextPaymentPrice,
      discountGrade: subscribeInfo.info.discountGrade,
    },
  };
  const mct = useModalContext();
  const [submitted, setSubmitted] = useState(false);
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [activeModal, setActiveModal] = useState(false);

  const onActiveCouponModal = () => {
    if (!info.coupon.availableCouponList.length) {
      mct.alertShow('적용가능한 쿠폰이 없습니다.');
      setActiveModal({ alert: true });
      return;
    }

    setActiveModal({ coupon: true, alert: true });
  };

  const hideCouponModal = () => {
    if (submitted) {
      window.location.reload();
    } else {
      mct.alertHide();
      setActiveModal({ coupon: false, alert: false });
    }
  };

  return (
    <>
      <section className={s.title}>
        <div className={s.title_text}>
          {info.dogName}의 구독정보
          <Tooltip message={'모든 구독정보 변경 사항은 다음 회차부터 적용됩니다.'}/>
        </div>
        {/* ! 아래 코드는 디자인 단에는 존재하는 UI지만, 기획서에 없는 내용 */}
        {/*<div className={s.flex_box}>*/}
        {/*  <div className={s.text}>*/}
        {/*    <span>구독변경 마감</span>*/}
        {/*    <br />*/}
        {/*    2일 16:54:12 이후 구독정보 변경 불가*/}
        {/*  </div>*/}
        {/*  */}
        {/*  <div className={s.btn_box}>*/}
        {/*    <div className={s.btn}>목록보기</div>*/}
        {/*  </div>*/}
        {/*</div>*/}
      </section>
      <section className={s.content_box}>
        <div className={s.top_flex_box}>
          <div className={s.top_left_box}>
            <div className={`${s.top_flex_box2} ${s.first}`}>
              <div className={s.left}>플랜</div>
              <div className={s.right}>{subscribePlanType[info.planName].KOR}</div>
            </div>

            <div className={`${s.top_flex_box2} ${s.second}`}>
              <div className={s.left}>레시피</div>
              <div className={s.right}>
                {info.recipeNameList.length > 0 &&
                  info.recipeNameList.map((recipeName, index) => (
                    <p key={`${recipeName}-${index}`}>{recipeName}</p>
                  ))}
              </div>
            </div>

            <div className={`${s.top_flex_box2} ${s.third}`}>
              <div className={s.left}>급여량</div>
              <div className={s.right}>{info.oneMealRecommendGram} g</div>
            </div>
          </div>

          <div className={s.right_box}>
            <div className={s.flex_box3}>
              <div className={s.inner_left_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    src={require('public/img/mypage/subscribe/dogldx/subscribe_ldx_calendar.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="대시보드 아이콘"
                  />
                </div>
                <div className={s.row_1}>다음 결제일</div>
                <div className={s.row_2}>
                  {transformDate(info.nextPaymentDate, null, { seperator: '/' })}
                </div>
                <div className={s.row_3}>
                  {info.countSkipOneTime ? <span>1회 건너뛰기</span> : null}
                  {info.countSkipOneWeek ? <span>1주 건너뛰기</span> : null}
                </div>
              </div>

              <div className={s.inner_mid_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    src={require('public/img/mypage/subscribe/dogldx/subscribe_ldx_pay.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.row_1}>결제 예정 금액</div>
                <div className={s.row_2}>{transformLocalCurrency(info.nextPaymentPrice)}원</div>
                <div className={s.row_3}>
                  <button type={'button'} className={s['coupon-btn']} onClick={onActiveCouponModal}>
                    쿠폰적용
                  </button>
                </div>
              </div>
              <div className={s.inner_right_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    src={require('public/img/mypage/subscribe/dogldx/subscribe_ldx_delivery.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.row_1}>다음 발송 예정일</div>
                <div className={s.row_2}>
                  {transformDate(info.nextDeliveryDate, null, { seperator: '/' })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {activeModal.coupon && (
        <Modal_couponWithSubscribeApi
          data={info.coupon}
          event={{ hideModal: hideCouponModal }}
          setAlertModalMessage={setAlertModalMessage}
          setSubmitted={setSubmitted}
        />
      )}
      {activeModal.alert && (
        <Modal_global_alert message={alertModalMessage} onClick={submitted && hideCouponModal} />
      )}
    </>
  );
};


const DUMMY_COUPON_DATA = [
  {
    memberCouponId: 3133,
    name: '테스트 쿠폰1',
    discountType: 'FIXED_RATE',
    discountDegree: 10,
    availableMaxDiscount: 10000,
    availableMinPrice: 5000,
    remaining: 3,
    expiredDate: '2022-08-12T16:01:46.853',
  },
  {
    memberCouponId: 3000,
    name: '테스트 쿠폰2',
    discountType: 'FIXED_RATE',
    discountDegree: 40,
    availableMaxDiscount: 10000,
    availableMinPrice: 300,
    remaining: 3,
    expiredDate: '2022-08-17T16:01:46.853',
  },
];
