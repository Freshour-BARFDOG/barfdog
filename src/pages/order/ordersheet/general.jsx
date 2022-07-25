import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './ordersheet.module.scss';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import { Modal_coupon } from '/src/components/modal/Modal_coupon';
import { postUserObjData } from '/src/pages/api/reqData';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import transformDate from '/util/func/transformDate';
import { OrdersheetItemList } from '/src/components/order/OrdersheetItemList';
import { OrdersheetMemberInfo } from '/src/components/order/OrdersheetMemberInfo';
import { OrdersheetDeliveryForm } from '/src/components/order/OrdersheetDeliveryForm';
import { Payment } from '/src/components/order/Payment';
import { OrdersheetReward } from '/src/components/order/OrdersheetReward';
import { OrdersheetMethodOfPayment } from '/src/components/order/OrdersheetMethodOfPayment';
import { OrdersheetAmountOfPayment } from '/src/components/order/OrdersheetAmountOfPayment';
import {userType} from "/store/TYPE/userAuthType";

const DUMMY_MEMEBER_COUPON_LIST = [
  {
    memberCouponId: 45,
    name: '반려견 생일 쿠폰',
    discountType: 'FIXED_RATE',
    discountDegree: 10,
    availableMaxDiscount: 100000,
    availableMinPrice: 0,
    remaining: 3,
    expiredDate: '2023-12-31T23:59:59',
  },
  {
    memberCouponId: 46,
    name: '반려견 생일 쿠폰2',
    discountType: 'FLAT_RATE',
    discountDegree: 2000,
    availableMaxDiscount: 100000,
    availableMinPrice: 0,
    remaining: 3,
    expiredDate: '2023-12-31T23:59:59',
  },
  {
    memberCouponId: 47,
    name: '반려견 생일 쿠폰3',
    discountType: 'FIXED_RATE',
    discountDegree: 30,
    availableMaxDiscount: 100000,
    availableMinPrice: 0,
    remaining: 3,
    expiredDate: '2023-12-31T23:59:59',
  },
];
const global_productType = {
  SUBSCRIBE: 'SUBSCRIBE',
  GENERAL: 'GENERAL',
};

export default function GeneralOrderSheetPage() {
  
  const TEST_change_productType = () => {
    setProductType((prevState) =>
      prevState === global_productType.SUBSCRIBE
        ? global_productType.GENERAL
        : global_productType.SUBSCRIBE,
    );
  };
  
  const router = useRouter();
  const auth = useSelector(s=> s.auth);
  const USER_TYPE = auth.userType;
  
  const cart = useSelector((state) => state.cart);
  const [productType, setProductType] = useState(global_productType.SUBSCRIBE);
  const [isLoading, setIsLoading] = useState({ fetching: true });
  const [info, setInfo] = useState({});
  const [form, setForm] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [couponList, setCouponList] = useState([]);
  const [activeModal, setActiveModal] = useState({
    termsOfService: false,
    coupon: false,
  });

  useEffect(() => {
    const curItem = cart.orderItemList;
    if(!curItem.length){
      return router.push('/');
    }
    

    
    const requestBody = {
      orderItemDtoList: curItem.map((item)=>({
        itemDto: {
          itemId: item.itemDto.itemId,
          amount: item.itemDto.amount,
        },
        itemOptionDtoList: item.optionDtoList.map((option) => ({
          itemOptionId: option.itemOptionId,
          amount: option.amount,
        })),
      }))
    };
  
    if (Object.keys(info).length > 0) return; // 최초 data fetching 후 Re-rendering 방지
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        item: true,
      }));
      try {
        // API: 상품 주문정보
        const postItemInfoApiUrl = `/api/orders/sheet/general`;
        const res = await postUserObjData(postItemInfoApiUrl, requestBody);
        // 요청 파라미터가 복잡하여 GET이 아닌 POST 사용
        console.log(res);
        if (res.status !== 200) {
          // alert('상품 정보를 확인할 수 없습니다.');
          // return await router.push('/');
        }
        const info = res.data.data;
        console.log(info);
 
        // 주문에 대한 모든 데이터
        const initInfo = {
          name: info.name, // 구매자
          email: info.email, // 연락처
          phoneNumber: info.phoneNumber,
          address: {
            name: info.address.name, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
            phone: info.address.phone, // 수령자 전화번호 (묶음 배송일 경우, null)
            zipcode: info.address.zipcode, // 우편번호 (묶음 배송일 경우, null)
            street: info.address.street, // 도로명 주소 (묶음 배송일 경우, null)
            detailAddress: info.address.detailAddress, // 상세주소 (묶음 배송일 경우, null)
            request: info.address.request, // 배송 요청사항 (묶음 배송일 경우, null)
          },
          deliveryId: info.deliveryId || Math.floor(Math.random()*100), // ! IMPORTANT : 묶음 배송할 배송 ID (묶음배송 불가능할 경우 null)
          nextSubscribeDeliveryDate: info.nextSubscribeDeliveryDate || '2022-07-20', // ! IMPORTANT: 묶음배송할 배송 예정일 . 묶음배송 불가능한 경우 null
          coupons:
            DUMMY_MEMEBER_COUPON_LIST ||
            info.coupons?.map((cp) => ({
              memberCouponId: cp.memberCouponId,
              name: cp.name,
              discountType: cp.discountType,
              discountDegree: cp.discountDegree,
              availableMaxDiscount: cp.availableMaxDiscount,
              availableMinPrice: cp.availableMinPrice,
              remaining: cp.remaining,
              expiredDate: transformDate(cp.expiredDate),
            })) ||
            [], //////////// ! DUMMY DATA
          orderPrice: info.orderPrice, //  장바구니 or 결제전 "최종 가격" (할인 적용 전)
          reward: info.reward, // 적립금
          deliveryPrice: info.deliveryPrice, // 배송비 : 장바구니에서, 최종 배송비
          freeCondition: info.freeCondition, // 사이트 > 배송비 무료 조건
          brochure: info.brochure, // 브로슈어 받은 적 있는지 true/false => 브로슈어는 1번만 받을 수 있다.
        };

        // 결제 시 전송될 data
        const initForm = {
          sameUserInfo: false, // -- submit 미포함
          orderItemDtoList: info.orderItemDtoList?.map((item) => ({
            itemId: item.itemId, // 상품 ID
            amount: item.amount, // 상품 수량
            name: item.name, // 상품명
            selectOptionDtoList:
              item.optionDtoList.map((op) => ({
                itemOptionId: op.optionId, // 옵션 ID
                amount: op.amount, // 옵션 수량
                name: op.name, // 옵션 이름 -- submit 미포함
                price: op.price, // 옵션 가격 -- submit 미포함
              })) || [],
            memberCouponId: null, // 사용한 쿠폰 ID // 데이터뿌릴떄
            discountAmount: 0, // 쿠폰할인 총계
            originalOrderLinePrice: item.originalOrderLinePrice, // 관리자 페이지에서 설정한 '할인 전' "상품 + 옵션" 가격
            orderLinePrice: item.orderLinePrice, // 쿠폰 적용 후, 주문내역 내의 한 줄 "상품 + 옵션"에 대한 최종가격
          })),
          deliveryDto: {
            name: null, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
            phone: null, // 수령자 전화번호 (묶음 배송일 경우, null)
            zipcode: null, // 우편번호 (묶음 배송일 경우, null)
            street: null, // 도로명 주소 (묶음 배송일 경우, null)
            detailAddress: null, // 상세주소 (묶음 배송일 경우, null)
            request: null, // 배송 요청사항 (묶음 배송일 경우, null)
          },
          deliveryId: null, // ! IMPORTANT : 묶음 배송일 경우 , info.deliveryId값 추가/ 일반배송: null)
          orderPrice: null, //  주문 상품 총 가격 (할인 적용 전) // ! 계산기
          deliveryPrice: 0, // 배송비
          discountTotal: 0, // 총 할인 합계
          discountReward: 0, // 사용할 적립금
          discountCoupon: 0, // 쿠폰 적용으로 인한 할인금
          paymentPrice: 0, // 최종 결제 금액
          paymentMethod: null, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
          agreePrivacy: false, // 개인정보 제공 동의
          brochure: false, // 브로슈어 수령여부
        };

        setInfo(initInfo);
        setForm(initForm);
      } catch (err) {
        console.error(err);
      }

      setIsLoading((prevState) => ({
        ...prevState,
        item: false,
      }));
    })();
  }, [cart]);



  const onActivleModalHandler = (e) => {
    const button = e.currentTarget;
    const modalType = button.dataset.modalType;

    setActiveModal((prevState) => ({
      ...prevState,
      [modalType]: !prevState[modalType],
    }));
  };

  
  
  // validation
  // - 1. 상품정보 없이 , 해당 페이지에 접근했을 경우
  // - 2. 새로고침했을 경우 : REDUX정보 초기화됨
  //    > 이때, Shop Item Detail페이지에서 가져온 정보 초기화되어, 서버에서 데이터 가져올 수 없음)
  if(!info || !USER_TYPE || USER_TYPE === userType.NON_MEMBER)return;
  
  
  // console.log('INFO: ', info);
  // console.log('FORM: ', form);

  return (
    <>
      <MetaTitle title="주문서" />
      <Layout>
        {/*<div className={'mt-40 mb-20 ml-20'} style={{ fontSize: '12px', color: '#555' }}>*/}
        {/*  <button*/}
        {/*    type={'button'}*/}
        {/*    onClick={TEST_change_productType}*/}
        {/*    className={'admin_btn line basic_l mb-10'}*/}
        {/*  >*/}
        {/*    주문서 유형 변경하기 버튼 (사용x / 일반결제와 정기결제 페이지를 구분할 예정)*/}
        {/*  </button>*/}
        {/*  <p className={'ml-20'}>*/}
        {/*    현재주문서 유형: {productType}*/}
        {/*    {productType === 'SUBSCRIBE' && <span> (묶음 배송여부 체크박스 나타남)</span>}*/}
        {/*  </p>*/}
        {/*</div>*/}
        <div className={s.container_outer}>
          <div className={s.Wrapper}>
            <OrdersheetItemList
              form={form}
              isLoading={isLoading}
              event={{ onActiveModal: onActivleModalHandler }}
            />
            <OrdersheetMemberInfo info={info} />
            <OrdersheetDeliveryForm id={'deliveryDto'} info={info} form={form} setForm={setForm} formErrors={formErrors} setFormErrors={setFormErrors}/>
            <OrdersheetReward id={'discountReward'} info={info} form={form} setForm={setForm} formErrors={formErrors} setFormErrors={setFormErrors}/>
            <OrdersheetMethodOfPayment id={'paymentMethod'} info={info} form={form} setForm={setForm} formErrors={formErrors}/>
            <OrdersheetAmountOfPayment info={info} form={form} setForm={setForm} event={{onActiveModal:onActivleModalHandler}} formErrors={formErrors}/>
            <section className={s.final_btn}>
              <p>위 주문 내용을 확인 하였으며, 회원 본인은 결제에 동의합니다.</p>
              <Payment isLoading={isLoading} />   {/* 결제버튼 */}
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
      {activeModal.coupon && (
        <Modal_coupon
          data={info.coupons}
          onModalActive={() => {
            setActiveModal((prevState) => ({
              ...prevState,
              coupon: false,
            }));
          }}
        />
      )}
    </>
  );
}

