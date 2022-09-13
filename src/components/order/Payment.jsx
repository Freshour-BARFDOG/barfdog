import React, { useEffect, useState } from 'react';
import {validate, validateInBundleDelivery} from '/util/func/validation/validation_ordersheet';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import { calcOrdersheetPrices } from './calcOrdersheetPrices';
import ErrorMessage from '../atoms/ErrorMessage';
import { useRouter } from 'next/router';

export function Payment({
  info,
  form,
  isLoading,
  setIsLoading,
  setFormErrors,
  orderType = 'general',
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();

  useEffect(() => {

    const jquery = document.createElement('script');
    jquery.src = 'https://code.jquery.com/jquery-1.12.4.min.js';

    const iamport = document.createElement('script');
    iamport.src = 'https://cdn.iamport.kr/js/iamport.payment-1.2.0.js';

    document.head.appendChild(jquery);
    document.head.appendChild(iamport);
    
    return () => {
      document.head.removeChild(jquery);
      document.head.removeChild(iamport);
    };
  }, []);

  const onSubmit = async (e) => {
    // console.log(info,'info');
    // console.log(form);
    e.preventDefault();
    if (isSubmitted) return;

    const valid_target = {
      name: form.deliveryDto.name,
      phone: form.deliveryDto.phone,
      city: form.deliveryDto.city,
      street: form.deliveryDto.street,
      detailAddress: form.deliveryDto.detailAddress,
      paymentMethod: form.paymentMethod,
      agreePrivacy: form.agreePrivacy,
      paymentPrice: calcOrdersheetPrices(form, orderType).paymentPrice,
    };
    // console.log(valid_target)
    // console.log(info)
    // ! bundle일 경우, validation항목 다르게 변경해주기.
    let errObj;
    if(form.bundle){
      errObj = validateInBundleDelivery(valid_target);
    } else {
      errObj = validate(valid_target);
    }
    
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.');
    // console.log(isPassed);
    // 결제 로직을 시작한다.
    await startPayment();
  };

  async function startPayment(){

    const body = orderType === 'general'?{
      orderItemDtoList: form.orderItemDtoList?.map((item) => ({
        itemId: item.itemId, // 상품 ID
        amount: item.amount, // 상품 수량
        selectOptionDtoList:
          item.selectOptionDtoList?.map((op) => ({
            itemOptionId: op.itemOptionId, // 옵션 ID
            amount: op.amount, // 옵션 수량
          })) || [],
        memberCouponId: item.memberCouponId, // 사용한 쿠폰 ID // 데이터뿌릴떄
        discountAmount: item.discountAmount, // 쿠폰할인 총계
        finalPrice: item.orderLinePrice,
      })),
      deliveryDto: {
        name: form.deliveryDto.name, // 수령자 이름
        phone: form.deliveryDto.phone, // 수령자 전화번호
        zipcode: form.deliveryDto.zipcode, // 우편번호
        street: form.deliveryDto.street, // 도로명 주소
        detailAddress: form.deliveryDto.detailAddress, // 상세주소
        request: form.deliveryDto.request, // 배송 요청사항
      },
      deliveryId:form.deliveryId || null, // 묶음 배송 할 배송 id . 묶음배송 아닐 경우 null
      orderPrice: form.orderPrice, //  주문 상품 총 가격 (할인 적용 전)
      deliveryPrice: form.deliveryPrice, // 배송비
      discountTotal: calcOrdersheetPrices(form, 'general').discountTotal, // 총 할인 합계    ! 쿠폰할인금 적용
      discountReward: Number(form.discountReward), // 사용할 적립금
      discountCoupon: calcOrdersheetPrices(form, 'general').discountCoupon, // 쿠폰 적용으로 인한 할인금 ! coupon할인금 적용
      paymentPrice: calcOrdersheetPrices(form, 'general').paymentPrice, // 최종 결제 금액 ! coupon할인금 적용
      paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
      // nextDeliveryDate: form.nextDeliveryDate, // ! 일반주문 시, request field에 없는 값.
      agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
      brochure: form.brochure, // 브로슈어 수령여부
    }:{
      memberCouponId: form.memberCouponId,
      deliveryDto: {
        name: form.deliveryDto.name, // 수령자 이름
        phone: form.deliveryDto.phone, // 수령자 전화번호
        zipcode: form.deliveryDto.zipcode, // 우편번호
        street: form.deliveryDto.street, // 도로명 주소
        detailAddress: form.deliveryDto.detailAddress, // 상세주소
        request: form.deliveryDto.request, // 배송 요청사항
      },
      orderPrice: form.orderPrice, //  ! 주문 상품 원가 = nextPaymentPrice (등급 할인 적용x / 플랜변경, 레시피, 레시피 그램 등이 반영된 "제품원가"에 해당함)
      deliveryPrice: form.deliveryPrice, // 배송비
      discountTotal: calcOrdersheetPrices(form, 'subscribe').discountTotal, // 총 할인 합계    ! 쿠폰할인금 , 적립금, 등급할인
      discountReward: Number(form.discountReward), // 사용할 적립금
      discountCoupon: calcOrdersheetPrices(form, 'subscribe').discountCoupon, // 쿠폰 적용으로 인한 할인금
      discountGrade: calcOrdersheetPrices(form, 'subscribe').discountGrade, // 등급할인
      paymentPrice: calcOrdersheetPrices(form, 'subscribe').paymentPrice, // 최종 결제 금액
      paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
      nextDeliveryDate: form.nextDeliveryDate, // 할인이 적용되지 않은 가격
      agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
      brochure: form.brochure, // 브로슈어 수령여부
    };

    console.log('request body: ',body);
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));


      // send DATA to api server after successful payment
      const apiUrl = orderType === 'general' ? `/api/orders/general` : `/api/orders/subscribe/${router.query.subscribeId}`
      const res = await postObjData(apiUrl, body);
      console.log(res);
      
      if (res.isDone) {
        if( orderType === 'general'){
          // 일반 주문 결제
          // res.data.data.id = 주문번호 id
          await generalPayment(body,res.data.data.id, res.data.data.merchantUid);
        }else{
          // 구독 주문 결제
          await subscribePayment(body,res.data.data.id, res.data.data.merchantUid);
        }
        // alert('결제완료 -> 이후 확인버튼 클릭 -> 결제완료페이지로 Redir');
        const scrollTopPos = document.documentElement.scrollTop;
        document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        top: -${scrollTopPos}px;
      `;
        // return () => {
        //   document.body.style.cssText = ``;
        //   window?.scrollTo(0, parseInt(-mcx.event.scrollY || 10) * -1);
        // };
        // 결제 시작
      } else {
        alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));

  }

  async function generalPayment(body,id,merchantUid) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    /* 2. 결제 데이터 정의하기  1원 결제 -> 실패 , 100원 결제 -> 성공 */
    const data = {
      pg: 'kcp', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: 100 || body.paymentPrice, // 결제금액
      name: '바프독 아임포트 결제 테스트', // 주문명
      buyer_name: 'username' || info.name, // 구매자 이름
      buyer_tel: '01000000000' || info.phone, // 구매자 전화번호
      buyer_email: 'a@gmail' || info.email, // 구매자 이메일
      buyer_addr: '센텀2로' || `${info.address.street},${info.address.detailAddress}`, // 구매자 주소
      buyer_postcode: '00000' || info.address.zipcode, // 구매자 우편번호
      m_redirect_url: `http://localhost:4000/order/orderCompleted/${id}`
    };
    IMP.request_pay(data, callback);
    
    /* 4. 결제 창 호출하기 */
    async function callback(response) {
      console.log(response);
      const { success, imp_uid, merchant_uid, error_msg } = response;
      
    /* 3. 콜백 함수 정의하기 */
    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달
      
      const r = await postObjData(`/api/orders/${id}/general/success`, {
        impUid : imp_uid,
        merchantUid : merchant_uid
      });
      console.log(r);
      if(r.isDone){
        alert('결제 성공');
        setIsSubmitted(true);
        window.location.href= `/order/orderCompleted/${id}`;
      }
    } else {
       // 결제 실패 : 쿠폰null일때 500err -> 서버 오류 수정하셨다고 함 TODO 나중에 테스트하기
       const fail = await postObjData(`/api/orders/${id}/general/fail`);
       console.log(fail);
        if(fail.isDone){
          // startPayment();
          alert(`결제 실패: ${error_msg}`);
          // 결제 취소 시 , 전역에 import 결제 html이 잔류하여, 없앰
          document.body.style.cssText='';
          document.body.querySelector('.imp-dialog ').innerHTML='';
          document.body.querySelector('.imp-dialog ').style.cssText='display:none !important';
          window.location.href= `/order/orderFailed`;
        }
    }
  
    };
    
  }

  async function subscribePayment(body,id,merchantUid) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    const randomStr = new Date().getTime().toString(36);
    const customUid = `customer_Uid_${randomStr}`;
    
    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kcp_billing', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: 1 || body.paymentPrice, // 결제금액
      customer_uid : customUid,
      name: '바프독 아임포트 결제 테스트', // 주문명
      buyer_name: 'username' || info.name, // 구매자 이름
      buyer_tel: '01000000000' || info.phone, // 구매자 전화번호
      buyer_email: 'a@gmail' || info.email, // 구매자 이메일
      buyer_addr: '센텀2로' || `${info.address.street},${info.address.detailAddress}`, // 구매자 주소
      buyer_postcode: '00000' || info.address.zipcode, // 구매자 우편번호
      m_redirect_url: `http://localhost:4000/order/orderCompleted/subscribe/${id}/${randomStr}`
    };

    IMP.request_pay(data, callback);
    
    /* 4. 결제 창 호출하기 */
    async function callback(response) {
      console.log(response);
      const { success, customer_uid, imp_uid, merchant_uid, card_name, card_number, error_msg } = response;
     
      const IMPORT_PAYMENT_CANCEL = response.error_msg?.indexOf('[결제포기]') >= 0;
      console.log(IMPORT_PAYMENT_CANCEL)
    /* 3. 콜백 함수 정의하기 */
    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달
      const r = await postObjData(`/api/orders/${id}/subscribe/success`, {
        impUid : imp_uid,
        merchantUid : merchant_uid,
        customerUid : customer_uid,
      });
      console.log(r);
      if(r.isDone){
        alert('결제 성공');
        setIsSubmitted(true);
        window.location.href = `/order/orderCompleted/subscribe/${id}`;
      }
      
    } else if(IMPORT_PAYMENT_CANCEL) {
      const res = await postObjData(`/api/orders/${id}/subscribe/cancel`);
      console.log('IMPORT_PAYMENT_CANCEL REPONSE:',res);
      if(res.isDone){
        alert(`결제 취소: ${error_msg}`);
      } else {
        alert(`결제 취소처리 중 오류가 발생하였습니다.`);
      }
      window.location.reload();
    } else {
       // 결제 실패 : 쿠폰null일때 500err -> 서버 오류 수정하셨다고 함 TODO 나중에 테스트하기
       const fail = await postObjData(`/api/orders/${id}/subscribe/fail`);
       console.log(fail);
        if(fail.isDone){
          alert(`결제 실패: ${error_msg}`);
          // startPayment();
          window.location.href= `/order/orderFailed`;
        }
    }
  
    };
    
  }

  return (
    <>
      <button onClick={onSubmit} className={s.btn_box} type={'button'}>
        {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '결제하기'}
      </button>
    </>
  );
}
