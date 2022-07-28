import React, { useEffect, useState } from 'react';
import { validate } from '/util/func/validation/validation_ordersheet';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '/src/pages/api/reqData';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import {calcOrdersheetPrices} from "./calcOrdersheetPrices";
import ErrorMessage from "../atoms/ErrorMessage";

export function Payment({info,  form, isLoading, setIsLoading, setFormErrors }) {
  const [isSubmitted, setIsSubmitted] = useState(false);
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
    console.log(form)
    e.preventDefault();
    if (isSubmitted) return;
    

    const valid_target = form.bundle ? {
      paymentMethod: form.paymentMethod,
      agreePrivacy: form.agreePrivacy,
      paymentPrice: calcOrdersheetPrices(form).paymentPrice
    } : {
      name: form.deliveryDto.name,
      phone: form.deliveryDto.phone,
      city: form.deliveryDto.city,
      street: form.deliveryDto.street,
      detailAddress: form.deliveryDto.detailAddress,
      paymentMethod: form.paymentMethod,
      agreePrivacy: form.agreePrivacy,
      paymentPrice: calcOrdersheetPrices(form).paymentPrice
    }
    // console.log(valid_target)
    // console.log(info)
    console.log(form)
    const errObj = validate(valid_target);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    // console.log(isPassed);
    
    if (isPassed) {
      const body = {
        orderItemDtoList: form.orderItemDtoList.map((item) => ({
          itemId: item.itemId, // 상품 ID
          amount: item.amount, // 상품 수량
          selectOptionDtoList: item.selectOptionDtoList.map((op) => ({
            itemOptionId: op.itemOptionId, // 옵션 ID
            amount: op.amount, // 옵션 수량
          })),
          memberCouponId: item.memberCouponId || null, // 사용한 쿠폰 ID
          discountAmount: item.discountAmount, // 쿠폰할인 총계
          finalPrice: item.orderLinePrice - item.discountAmount, // 자체 할인 전 상품 + 옵션 가격 총 가격
        })),
        deliveryDto: {
          name: form.deliveryDto.name, // 수령자 이름 ("정기배송과" 묶음 배송일 경우, null => 정기배송 수령자를 따름)
          phone: form.deliveryDto.phone, // 수령자 전화번호 (묶음 배송일 경우, null)
          zipcode: form.deliveryDto.zipcode, // 우편번호 (묶음 배송일 경우, null)
          street: form.deliveryDto.street, // 도로명 주소 (묶음 배송일 경우, null)
          detailAddress: form.deliveryDto.detailAddress, // 상세주소 (묶음 배송일 경우, null)
          request: form.deliveryDto.request, // 배송 요청사항 (묶음 배송일 경우, null)
        },
        deliveryId: form.deliveryId, // 배송 ID (묶음 배송일 경우, null)
        orderPrice: form.orderPrice, //  주문 상품 총 가격 (할인 적용 전)
        deliveryPrice: form.deliveryPrice, // 배송비
        discountReward: form.discountReward, // 사용할 적립금
        discountCoupon: calcOrdersheetPrices(form).discountCoupon, // 쿠폰 적용으로 인한 할인금
        discountTotal: calcOrdersheetPrices(form).discountTotal, // 총 할인 합계
        paymentPrice: calcOrdersheetPrices(form).paymentPrice, // 최종 결제 금액
        paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
        agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
        brochure: form.brochure, // 브로슈어 수령여부
      };

      // 결제 로직을 시작한다.
      document.body.style.cssText = `
        overflow-y:scroll;
        height:100%;
        position:fixed;
        width:100%;
      `;
      // return () => {
      //   document.body.style.cssText = ``;
      //   window?.scrollTo(0, parseInt(-mcx.event.scrollY || 10) * -1);
      // };

      await startPayment(body);
    } else {
      alert('유효하지 않은 항목이 있습니다.');
    }
  };

  async function startPayment(body) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);

    /* 2. 결제 데이터 정의하기 */
    const data = {
      pg: 'kcp', // PG사
      pay_method: 'card', // 결제수단
      merchant_uid: `mid_${new Date().getTime()}`, // 주문번호
      amount: 1 || body.paymentPrice, // 결제금액
      name: '바프독 아임포트 결제 테스트', // 주문명
      buyer_name: 'username' || info.name, // 구매자 이름
      buyer_tel: '01000000000' || info.phone, // 구매자 전화번호
      buyer_email: 'a@gmail' || info.email, // 구매자 이메일
      buyer_addr: '센텀2로' || `${info.address.street},${info.address.detailAddress}`, // 구매자 주소
      buyer_postcode: '00000' || info.address.zipcode, // 구매자 우편번호
    };

    /* 4. 결제 창 호출하기 */
    const callback = function callback(response) {
      return ({ success, merchant_uid, error_msg } = response);
    };
    const { success, merchant_uid, error_msg } = IMP.request_pay(data, callback);

    /* 3. 콜백 함수 정의하기 */
    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달
      alert('결제 성공');

      try {
        setIsLoading((prevState) => ({
          ...prevState,
          submit: true,
        }));
        // send DATA to api server after successful payment
        const res = await postObjData(`/api/orders/general`, body);
        // console.log(res);
        if (res.isDone) {
          alert('결제완료 -> 이후 확인버튼 클릭 -> 결제완료페이지로 Redir');
          setIsSubmitted(true);
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
      setIsSubmitted(true);
    } else {
      alert(`결제 실패: ${error_msg}`);
      window.location.href('/'); // 임시로 넣은 코드 :  결제취소시 , 전역에 import 결제 html이 잔류하여, 없애기위한 용도
    }
    
  }

  return (
    <>
      <button onClick={onSubmit} className={s.btn_box} type={'button'}>
        {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '결제하기'}
      </button>
    </>
    
  );
}
