import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import Image from 'next/image';
import React, {useState} from 'react';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import transformDate from '/util/func/transformDate';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import {Modal_couponWithSubscribeApi} from '../modal/Modal_couponWithSubscribeApi';
import {useModalContext} from '/store/modal-context';
import Tooltip from "../atoms/TooltipSubscrib";
import {calcSubscribeNextPaymentPrice} from "/util/func/subscribe/calcSubscribeNextPaymentPrice";
import {roundedOneMealGram} from "../../../util/func/subscribe/roundedOneMealGram";
import {SubscribeStatusTag} from "./SubscribeStatusTag";


export const SubscribeDashboard = ({ subscribeInfo }) => {
  // ! 구독정보 변경마감일자 체크 (google sheet);
  const info = {
    subscribeStatus: subscribeInfo.info.subscribeStatus,
    dogName: subscribeInfo.info.dogName,
    planName: subscribeInfo.info.planName,
    recipeNameList: subscribeInfo.info.recipeNames?.split(','),
    oneMealGramsPerRecipe: subscribeInfo.info.oneMealGramsPerRecipe,
    nextPaymentDate: subscribeInfo.info.nextPaymentDate,
    nextPaymentPrice: calcSubscribeNextPaymentPrice(
      {originPrice: subscribeInfo.info.nextPaymentPrice, discountCoupon: subscribeInfo.info.discountCoupon, discountGrade:subscribeInfo.info.discountGrade, overDiscount: subscribeInfo.info.overDiscount}),
    nextDeliveryDate: subscribeInfo.info.nextDeliveryDate,
    countSkipOneTime: subscribeInfo.info.countSkipOneTime,
    countSkipOneWeek: subscribeInfo.info.countSkipOneWeek,
    subscribeCount: subscribeInfo.info.subscribeCount,
    coupon: {
      // 쿠폰은 상품 당, 하나만 적용됨
      subscribeId: subscribeInfo.info.subscribeId,
      usedCoupon:{
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
      setActiveModal({ coupon: false});
    }
  };

  return (
    <>
      <section className={s.title}>
        <div className={s.title_text}>
          {info.dogName}의 구독정보
          <SubscribeStatusTag status={info.subscribeStatus} subscribeCount={info.subscribeCount}/>
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
              <div className={s.right}>{info.oneMealGramsPerRecipe?.map((oneMealGram, index) => <p key={`oneMealGram}-${index}`}>{transformLocalCurrency(roundedOneMealGram(oneMealGram))}g</p>) || "-"}</div>
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
                <div className={s.row_1}>
                  다음 결제금액
                  <span className={s.row_1_sub}>(등급할인 포함)</span>
                </div>
                <div className={s.row_2}>{transformLocalCurrency(info.nextPaymentPrice)}원</div>
                {info.subscribeStatus === 'SUBSCRIBING' &&
                  <div className={s.row_3}>
                    <button type={'button'} className={s['coupon-btn']} onClick={onActiveCouponModal}>
                      쿠폰적용
                    </button>
                  </div>
                }
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
                <div className={s.row_1}>다음 발송예정일</div>
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
          setSubmitted={setSubmitted}
        />
      )}
    </>
  );
};
