import React, {useCallback, useEffect, useState} from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from '../ordersheet.module.scss';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import {Modal_coupon} from '/src/components/modal/Modal_coupon';
import {getData, postObjData} from '/src/pages/api/reqData';
import {useSelector} from 'react-redux';
import transformDate, {transformToday} from '/util/func/transformDate';
import {OrdersheetSubscribeItemList} from '/src/components/order/OrdersheetSubscribeItemList';
import {OrdersheetMemberInfo} from '/src/components/order/OrdersheetMemberInfo';
import {OrdersheetDeliveryForm} from '/src/components/order/OrdersheetDeliveryForm';
import {Payment} from '/src/components/order/Payment';
import {OrdersheetReward} from '/src/components/order/OrdersheetReward';
import {OrdersheetMethodOfPayment} from '/src/components/order/OrdersheetMethodOfPayment';
import {OrdersheetAmountOfPayment} from '/src/components/order/OrdersheetAmountOfPayment';
import {calcNextSubscribeDeliveryDate} from '/util/func/calcNextSubscribeDeliveryDate';
import {ORDER_STATES} from "/store/order-slice";
import useDeviceState from "/util/hook/useDeviceState";
import {subscribePriceCutOffUnit} from "/util/hook/useSubscribeInfo";
import {useSubscribePlanInfo} from "/util/hook/useSubscribePlanInfo";


export default function SubscribeOrderSheetPage({ subscribeId }) {
  
  const ds = useDeviceState();
  const subscribePlanInfo = useSubscribePlanInfo();
  const orderState = useSelector((state) => state.orderState);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [isRendered, setIsRendered] = useState(false);
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });
  
  
  
  useEffect(() => {
    if (window && typeof window !== 'undefined') {
      setIsRendered(true);
    }
  }, []);
  

  
  
  useEffect(() => {
    if ( Object.values(subscribePlanInfo.planDiscountPercent).filter(val=> val === null).length ) return console.error( "관리자에서 설정한 할인율을 받아올 수 없습니다." );

    ( async () => {
      setIsLoading( (prevState) => ({
        ...prevState,
        item: true,
      }) );
      try {
        const apiUrl = `/api/orders/sheet/subscribe/${subscribeId}`;
        const body = {
          id: subscribeId,
        };
        const res = await getData( apiUrl, body );
        // console.log(res)
        if ( res.status !== 200 ) {
          alert( '주문 정보를 확인할 수 없습니다.' );
          return (window.location.href = '/');
        }
        const data = res.data;
        console.log( data );
    
        // 주문에 대한 모든 데이터
        const initInfo = {
          subscribeDto: {
            id: data.subscribeDto.id,
            plan: data.subscribeDto.plan,
            nextPaymentPrice: data.subscribeDto.nextPaymentPrice,
            originPrice: calcSubscribePlanOriginPrice( {
              discountPercent: subscribePlanInfo.planDiscountPercent[data.subscribeDto.plan],
              paymentPrice: data.subscribeDto.nextPaymentPrice
            } ),
            discountGrade: data.subscribeDto.discountGrade, // 등급할인 (할인표기에 사용)
          },
          recipeNameList: data.recipeNameList, // [] 구독으로 선택한 레시피 이름 리스트 // FULL-PLAN일 경우, 최대 2개
          name: data.name, // 구매자
          email: data.email, // 연락처
          phone: data.phoneNumber,
          grade: data.grade, // ! SUBSCRIBE ONLY
          gradeDiscountPercent: data.gradeDiscountPercent, // ! SUBSCRIBE ONLY
          address: {
            city: data.address.city, // 시도
            street: data.address.street, // 도로명 주소
            detailAddress: data.address.detailAddress, // 상세주소
            zipcode: data.address.zipcode, // 우편번호
          },
          deliveryPrice: 0, // 정기구독 배송비: 무료
          reward: data.reward,
          brochure: data.brochure, // 브로슈어 받은 적 있는지 true/false => 브로슈어는 1번만 받을 수 있다.
        };
    
        // FormDatas
        const initForm = {
          selfInfo: {
            reward: data.reward,
            discountGrade: data.subscribeDto?.discountGrade || null, // 등급할인 // 정기구독 할인금액 산출 시 사용
          },
          // ! DUMMY DATA
          coupons:
          // DUMMY_MEMEBER_COUPON_LIST ||
            data.coupons?.map( (cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              remaining: cp.remaining,
              expiredDate: transformDate( cp.expiredDate ),
            }) ) ||
            [],
          deliveryDto: {
            name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
            phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
            zipcode: null, // 우편번호 (묶음 배송일 경우, null)
            street: null, // 도로명 주소 (묶음 배송일 경우, null)
            detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
            request: null, // 배송 요청사항 (묶음 배송일 경우, null)
          },
          orderPrice: data.subscribeDto.nextPaymentPrice,
          deliveryPrice: 0, // 배송비
          discountTotal: 0, // 총 할인 합계
          discountReward: 0, // 사용할 적립금
          discountCoupon: 0, // 쿠폰 적용으로 인한 할인금
          paymentPrice: data.subscribeDto.nextPaymentPrice, // 최종 결제 금액
          paymentMethod: null, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
          // nextDeliveryDate: getDiffDate(1), // ! TEST CODE :  테스트로, 1일 이후 배송이 시작되는 것으로 설정함 (221020)
          //   ! PRODUCT CODE
          nextDeliveryDate: calcNextSubscribeDeliveryDate( transformToday(), null ), // 배송 예정일 'yyyy-MM-dd', 첫 결제 배송날짜는 프론트에서 넘어온 값으로 저장함
          agreePrivacy: false, // 개인정보 제공 동의
          brochure: false, // 브로슈어 수령여부
        };
        setInfo( initInfo );
        setForm( initForm );
      } catch (err) {
        console.error( err );
      } finally {
        setIsLoading( (prevState) => ({
          ...prevState,
          item: false,
        }) );
      }
    } )();
  
    const calcSubscribePlanOriginPrice =({discountPercent, paymentPrice}) => {
      const originPrice = paymentPrice * (100 / (100 - discountPercent));
      return Math.floor(originPrice / subscribePriceCutOffUnit) * subscribePriceCutOffUnit;
    };
  }, [subscribePlanInfo.isLoading]);
  
  

  const onActivleModalHandler = (e) => {
    const button = e.currentTarget;
    const modalType = button.dataset.modalType;
    const selectedItemId = button.dataset.itemId;
    setSelectedItemId(selectedItemId);
    setActiveModal((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };


  return (
    <>
      <MetaTitle title="정기구독 주문서" />
      <Layout>
        <div className={s.container_outer}>
          <div className={s.Wrapper}>
            {form && (
              <OrdersheetSubscribeItemList
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                isLoading={isLoading}
                event={{ onActiveModal: onActivleModalHandler }}
              />
            )}
            <OrdersheetMemberInfo info={info} />
            {isRendered && (
              <OrdersheetDeliveryForm
                orderType={'subscribe'}
                info={info}
                form={form}
                setForm={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
            )}
            <OrdersheetReward
              orderType={'subscribe'}
              id={'discountReward'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
              setFormErrors={setFormErrors}
            />
            <OrdersheetMethodOfPayment
              id={'paymentMethod'}
              orderType={'subscribe'}
              info={info}
              form={form}
              setForm={setForm}
              formErrors={formErrors}
            />
            <OrdersheetAmountOfPayment
              orderType={'subscribe'}
              info={info}
              form={form}
              setForm={setForm}
              event={{ onActiveModal: onActivleModalHandler }}
              formErrors={formErrors}
            />
            <section className={s.final_btn}>
              <p>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</p>
              <Payment
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                info={info}
                form={form}
                setFormErrors={setFormErrors}
                orderType={'subscribe'}
              />
              {/* 결제버튼 */}
            </section>
          </div>
        </div>
      </Layout>
      {activeModal.termsOfService && (
        <Modal_termsOfSerivce
          modalState={activeModal.termsOfService}
          setModalState={setActiveModal}
        />
      )}
      {activeModal.coupons && (
        <Modal_coupon
          orderType={'subscribe'}
          data={{ selectedItemInfo: info.subscribeDto, ...form }}
          onModalActive={setActiveModal}
          setForm={setForm}
        />
      )}
    </>
  );
}




export async function getServerSideProps({ query }) {
  const { subscribeId } = query;
  return { props: { subscribeId: subscribeId || null } };
}
