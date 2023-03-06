import s from './modal_coupon.module.scss';
import React, {useState} from 'react';
import ModalWrapper from './ModalWrapper';
import transformDate from '/util/func/transformDate';
import {discountUnitType} from '/store/TYPE/discountUnitType';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import EmptyMessage from '/src/components/atoms/AmdinErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import calculateSalePrice, {calculateAndConvertToMinimumSalePrice} from '/util/func/calculateSalePrice';
import transformClearLocalCurrency from '/util/func/transformClearLocalCurrency';
import {useModalContext} from '/store/modal-context';
import {postObjData, putObjData} from '/src/pages/api/reqData';
import Modal_confirm from "./Modal_confirm";


export const Modal_couponWithSubscribeApi = ({
                                               data,
                                               setSubmitted,
                                               event = {hideModal: null},
                                             }) => {
  
  const [activeConfirmModal, setActiveConfirmModal] = useState( false );
  // INIT STATE
  const info = {
    subscribeId: data.subscribeId,
    originPrice: data.originPrice,
    discountGrade: data.discountGrade,
    usedCoupon: {
      usingMemberCouponId: data.usedCoupon.usingMemberCouponId, // 사용된 쿠폰 id
      couponName: data.usedCoupon.couponName, // 쿠폰명
      discountCoupon: data.usedCoupon.discountCoupon, // 쿠폰 할인금액
    },
    availableCouponList:
      data.availableCouponList.map( (coupon) => ({
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

  const initSelectedCoupon = info.availableCouponList.filter(
    (coupon) => coupon.memberCouponId === info.usedCoupon.usingMemberCouponId,
  )[0];
  const calcedCouponInfo = calculateSalePrice(
    info.originPrice,
    initSelectedCoupon?.discountType,
    initSelectedCoupon?.discountDegree,
  );
  const initialRadioInfo = {
    couponId: info.usedCoupon.usingMemberCouponId,
    discountAmount: transformClearLocalCurrency( calcedCouponInfo.saleAmount ),
    salePrice: transformClearLocalCurrency( calcedCouponInfo.salePrice ) - info.discountGrade,
    // 최초 info: server에서 전달받은 값 직관적으로 확인하기 위해 그대로 사용
    // salePrice: convertToMinimumSalePrice({originPrice:info.originPrice, discount:{coupon: transformClearLocalCurrency(calcedCouponInfo.saleAmount), grade: info.discountGrade}}).salePrice,
    overDiscount: 0,
  };
  
  const mct = useModalContext();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRadioInfo, setSelectedRadioInfo] = useState(initialRadioInfo);

  
  const onChangeHandler = (e) => {
    const radio = e.currentTarget;
    const couponId = Number( radio.dataset.couponId );
    const couponDiscountAmount = Number( radio.dataset.discountAmount );
    const gradeDiscountAmount = info.discountGrade;
    const {salePrice, overDiscount} = calculateAndConvertToMinimumSalePrice( {originPrice: info.originPrice, discount: {coupon: couponDiscountAmount, grade: gradeDiscountAmount}} );
  
    setSelectedRadioInfo( {
      couponId,
      discountAmount: couponDiscountAmount,
      salePrice,
      overDiscount // 최소결제를 위한 할인미적용금액
    } );
  };
  
  const onApplyingCoupon = async () => {
    if ( !selectedRadioInfo.couponId ) return mct.alertShow( '선택된 쿠폰이 없습니다.' );
    if ( selectedRadioInfo.couponId === info.usedCoupon.usingMemberCouponId )
      return mct.alertShow( '이미 적용된 쿠폰입니다.' );
    
  
    try {
      setIsLoading( true );
      const body = {
        memberCouponId: selectedRadioInfo.couponId,
        discount: selectedRadioInfo.discountAmount,
        overDiscount: selectedRadioInfo.overDiscount
      };
      const url = `/api/subscribes/${info.subscribeId}/coupon`;
      const res = await postObjData( url, body );
      if ( res.isDone ) {
        setSubmitted( true );
        mct.alertShow( '쿠폰이 적용되었습니다.', onSuccessCallback );
      } else {
        mct.alertShow( `데이터 전송 실패\n${res.error}` );
      }
    } catch (err) {
      alert( err );
      console.error( 'err: ', err );
    } finally {
      setIsLoading( false );
    }
  }
  
  
  const onCancelUsedCoupon = async (confirm) => {
    setActiveConfirmModal( false ); // 컨펌모달 숨김
    if ( !confirm ) return; // 쿠폰적용 취소처리 중지
    
    
    try {
      setIsLoading( true );
      const body = {
        memberCouponId: info.usedCoupon.usingMemberCouponId,
      };
      console.log( "onCancelUsedCoupon > body", body );
      const url = `/api/subscribes/${info.subscribeId}/coupon/cancel`;
      const res = await putObjData( url, body );
      if ( res.isDone ) {
        setSubmitted( true );
        mct.alertShow( '사용 중인 쿠폰을 적용 취소 처리하였습니다.', onSuccessCallback );
      } else {
        mct.alertShow( `데이터 전송 실패\n${res.error}` );
      }
    } catch (err) {
      alert( err )
    } finally {
      setIsLoading( false );
    }
  };
  
  const onSuccessCallback = () => {
    window.location.reload();
  };
  
  // console.log( info );
  
  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={event.hideModal}
        className={`${s['modal-container']} animation-show-all-child`}
        positionCenter
      >
        <div className={s.modal}>
          {!!info.usedCoupon.usingMemberCouponId && <section className={s["coupon-section"]} data-title={"used-coupon"}>
            <div className={s.title_box}>
              <h3 className={s.title}>적용 중인 쿠폰</h3>
            </div>
            <div className={`${s.content_box} ${s['used-coupon']}`}>
              <div className={`${s.flex_box} ${s.header}`}>
                <span className={s.coupon_title}>쿠폰명</span>
                <span>할인금액</span>
              </div>
            </div>
            <div className={`${s.content_box} ${s['used-coupon']}`}>
              <label className={`${s.flex_box} ${s.coupons}`}>
                <span className={s.radio}>
                  <input
                    type="radio"
                    name={'used-coupon'}
                    onChange={null}
                    checked={true}
                    disabled={true}
                  />
                </span>
                <span className={s.name}>{info.usedCoupon.couponName}</span>
                <span className={s.price}>{transformLocalCurrency( info.usedCoupon.discountCoupon )}원</span>
              </label>
            </div>
            <div className={s.btn_box}>
              <button className={'custom_btn popup line pointColor'} onClick={() => {
                setActiveConfirmModal( true )
              }}>적용취소
              </button>
            </div>
          </section>}
          
          <section className={s["coupon-section"]} data-title={"available-coupons"}>
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
                            : info.usedCoupon.usingMemberCouponId === item.memberCouponId
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
                <p>상품 금액</p>
                <span className={s.text_price}>{transformLocalCurrency( info.originPrice )}원</span>
              </div>
              {/*<i className={s.line}></i>*/}
              <div className={s.col_2}>
                <p>쿠폰 할인금액</p>
                <span className={s.text_price}>
                {selectedRadioInfo.discountAmount > 0 && "-"} {transformLocalCurrency( selectedRadioInfo.discountAmount )}원
              </span>
              </div>
              {/*<i className={s.line}></i>*/}
              <div className={s.col_2}>
                <p>등급 할인금액</p>
                <span className={s.text_price}>
                {info.discountGrade > 0 && "-"} {transformLocalCurrency( info.discountGrade )}원
              </span>
              </div>
              {selectedRadioInfo.overDiscount > 0 && <div className={s.col_2}>
                <p>최소결제 적용금액</p>
                <span className={s.text_price}>+ {transformLocalCurrency( selectedRadioInfo.overDiscount )}원</span>
              </div>}
              <i className={s.vertical_line}></i>
              <div className={s.col_3}>
                <h4 className={s.title}>할인 후 금액
                  <span>{transformLocalCurrency( selectedRadioInfo.salePrice )}원</span>
                </h4>
              </div>
            </section>
            <section className={s.btn_box}>
              <button type={'button'} className={s.cancle_btn} onClick={event.hideModal}>
                닫기
              </button>
              <button type={'button'} className={s.choice_btn} onClick={onApplyingCoupon}>
                {isLoading.submit ? <Spinner style={{color: '#fff'}}/> : '쿠폰적용'}
              </button>
            </section>
          </section>
          
        </div>
      </ModalWrapper>
      {activeConfirmModal && (
        <Modal_confirm
          theme={'userPage'}
          isConfirm={onCancelUsedCoupon}
          positionCenter
          text={"사용 중인 쿠폰을 적용 취소하시겠습니까?"}
        />
      )}
    </>
  );
};
