import React, {useEffect, useState} from 'react';
import {validate, validateInBundleDelivery} from '/util/func/validation/validation_ordersheet';
import {valid_hasFormErrors} from '/util/func/validation/validationPackage';
import {postObjData} from '/src/pages/api/reqData';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '/src/components/atoms/Spinner';
import {calcOrdersheetPrices} from './calcOrdersheetPrices';
import {useRouter} from 'next/router';
import axios from 'axios';
import {availablePaymentState} from "/util/func/availablePaymentState";
import {paymethodFilter} from '/util/filter_iamport_paymethod';
import {generateCustomerUid} from "/util/func/order/generateCustomerUid";
import {pgType} from "/store/TYPE/paymentMethodType";

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

    if(!availablePaymentState( {reward: info.reward})){
      alert('결제할 수 없는 상태입니다.\n적립금, 쿠폰 등 사용가능여부를 확인하시기 바랍니다.');
      window.location.href = '/mypage/reward';
      return;
    }
    if(form.paymentMethod === 'NAVER_PAY'){
      alert(`네이버페이 결제 준비중입니다. 다른 결제수단을 선택해주세요.`);
      return;
    }
    // if(form.paymentMethod === 'KAKAO_PAY'){
    //   alert(`카카오페이 결제 준비중입니다. 다른 결제수단을 선택해주세요.`);
    //   return;
    // }
    if(orderType === 'subscribe' && form.paymentMethod ==='NAVER_PAY'){
      alert(`정기구독 네이버페이 결제 준비중입니다. 다른 결제수단을 선택해주세요.`);
      return;
    }
    // console.log(info,'info');
    // console.log(form);
    e.preventDefault();
    if (isSubmitted) return console.error("이미 제출된 양식입니다.");

    const valid_target = {
      name: form.deliveryDto.name,
      phone: form.deliveryDto.phone,
      city: form.deliveryDto.city,
      street: form.deliveryDto.street,
      detailAddress: form.deliveryDto.detailAddress,
      paymentMethod: form.paymentMethod,
      agreePrivacy: form.agreePrivacy,
      paymentPrice: calcOrdersheetPrices(form, orderType, {deliveryFreeConditionPrice: info.freeCondition}).paymentPrice,
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
    // 결제 로직 시작

    await startPayment();
  };



  async function startPayment(){

    const {discountTotal, discountCoupon, overDiscount, paymentPrice, discountGrade} = calcOrdersheetPrices(form, orderType, {deliveryFreeConditionPrice: info.freeCondition});


    const customerUid = generateCustomerUid(); // ! [client '결제실패' / Webhook 'paid'] CASE 처리를 위해, 주문서 생성 시에도 cutomerUid 전송.
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
        finalPrice: item.orderLinePrice, // ! 주문금액 = (상품 원가-상품 기본할인)*상품수량-쿠폰할인금액
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
      discountTotal: discountTotal, // 총 할인 합계    ! 쿠폰할인금 적용
      discountReward: Number(form.discountReward), // 사용할 적립금
      discountCoupon: discountCoupon, // 쿠폰 적용으로 인한 할인금 ! coupon할인금 적용
      overDiscount:  overDiscount, // 초과할인 금액
      paymentPrice: paymentPrice, // 최종 결제 금액
      paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
      // nextDeliveryDate: form.nextDeliveryDate, // ! 일반주문 시, request field에 없는 값.
      agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
      brochure: form.brochure, // 브로슈어 수령여부
    }:{
      customerUid: customerUid, // ! 클라이언트 주문 실패 후, webhook 'paid' 대응하기 위한 필드
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
      discountTotal: discountTotal, // 총 할인 합계    ! 쿠폰할인금 적용
      discountReward: Number(form.discountReward), // 사용할 적립금
      discountCoupon: discountCoupon, // 쿠폰 적용으로 인한 할인금 ! coupon할인금 적용
      discountGrade: discountGrade, // 등급할인
      overDiscount:  overDiscount, // 초과할인 금액
      paymentPrice: paymentPrice, // 최종 결제 금액
      paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
      nextDeliveryDate: form.nextDeliveryDate, // 배송 예정일 'yyyy-MM-dd', 첫 결제 배송날짜는 프론트에서 넘어온 값으로 저장함
      agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
      brochure: form.brochure, // 브로슈어 수령여부
    };

    console.log('----- request body:\n',body);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      // send DATA to api server after successful payment
      const apiUrl = orderType === 'general' ? `/api/orders/general` : `/api/orders/subscribe/${router.query.subscribeId}`;
      const res = await postObjData(apiUrl, body);
      console.log(res);


      if (res.isDone) {
        if( orderType === 'general'){
          // 일반 주문 결제
          // res.data.data.id = 주문번호 id
          await generalPayment(body,res.data.data.id, res.data.data.merchantUid);
        }else{
          // 구독 주문 결제
          await subscribePayment(body,res.data.data.id, res.data.data.merchantUid, customerUid); // ! 정기결제 시, 카드 저장을 위해 CustomerUid 필요
        }
        // alert('결제완료 -> 이후 확인버튼 클릭 -> 결제완료페이지로 Redir');
        const scrollTopPos = document.documentElement.scrollTop;
        document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        top: -${scrollTopPos}px;`;

        setIsSubmitted(true);
      } else {
        alert(res.error, '\n내부 통신장애입니다. 잠시 후 다시 시도해주세요.');
      }
    } catch (err) {
      alert('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  }

  async function generalPayment(body,id,merchantUid) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);
    // 주문명
    const itemList = form.orderItemDtoList;
    const itemName = `${itemList[0].name} ${itemList.length > 1 ? `외 ${itemList.length-1}개` : ''}`; // 네이버일 경우, '외 1개' 삭제필요

    /* 2. 결제 데이터 정의하기  1원 결제 -> 실패 , 100원 결제 -> 성공 */
    // TODO: name(주문명) test 지우기
    const data = {
      pg: pgType.GENERAL[body.paymentMethod], // PG사
      pay_method: paymethodFilter(body.paymentMethod), // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: body.paymentPrice, // 결제금액
      name: `[일반상품]-${itemName}`, // 주문명
      buyer_name:  info.name, // 구매자 이름
      buyer_tel: info.phone, // 구매자 전화번호
      buyer_email: info.email, // 구매자 이메일
      buyer_addr: `${info.address.street}, ${info.address.detailAddress}`, // 구매자 주소
      buyer_postcode: info.address.zipcode, // 구매자 우편번호
      m_redirect_url: `${window.location.origin}/order/loading/${id}`

    };


    // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
    const callbackData = {
      discountReward: body.discountReward,
      orderId: id,
    }
    IMP.request_pay(data, callback.bind(null, callbackData));

    /* 4. 결제 창 호출하기 */
    async function callback(callbackData, response) {

      // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
      const data = {
        discountReward: callbackData.discountReward
      }

      console.log(response);
      const { success, imp_uid, merchant_uid, error_msg } = response;



    /* 3. 콜백 함수 정의하기 */
    if (success) {
      // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
      // TODO: 결제 정보 전달

      const r = await postObjData(`/api/orders/${id}/general/success`, {
        impUid : imp_uid,
        merchantUid : merchant_uid,
        discountReward: data.discountReward,
      });
      console.log(r);
      if(r.isDone){
        alert('결제 성공');
        window.location.href= `/order/orderCompleted/${id}`;
      }
    } else {
        // 사용자가 결제 취소(결제포기)했을때
        if(error_msg.includes('결제포기')){
          const cancel = await postObjData(`/api/orders/${id}/general/cancel`);
          // console.log(cancel);
          window.location.href= `/order/orderFailed`;

        }else{
          // 결제 실패
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
    }

    }

  }

  async function subscribePayment(body,id,merchantUid, customerUid) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);


     /* 2. 결제 데이터 정의하기  TODO:kakaopay 실연동 가맹점코드(CID) 발급받으면 변경하기*/
    const itemName = `[구독상품]-${info.recipeNameList.join(", ")}`;
    const mobileItemName = `[m-구독상품]-${info.recipeNameList.join(", ")}`;
    const buyer_name = info.name;
    const buyer_tel = info.phone;
    const buyer_email = info.email;
    const buyer_addr = `${info.address.street}, ${info.address.detailAddress}`;
    const buyer_postcode = info.address.zipcode;

    // 아임포트 전송 데이터
    const m_redirect_url = `${window.location.origin}/order/loading/subscribe`;
    const params = `${id}/${customerUid}/${body.paymentPrice}/${merchantUid}/${mobileItemName}/${buyer_name}/${buyer_tel}/${buyer_email}/${buyer_addr}/${buyer_postcode}`;
    const data = {
      pg: pgType.SUBSCRIBE[body.paymentMethod], // PG사 + 사이트키
      pay_method: 'card', // 결제수단
      merchant_uid: new Date().getTime().toString(36), // 주문번호
      amount:0, // 결제금액 0원 ( 구독결제 시, 첫 번째 결제는 예약과정)
      customer_uid : customerUid,
      name: itemName, // 주문명
      buyer_name:buyer_name,
      buyer_tel: buyer_tel,
      buyer_email: buyer_email, // 구매자 이메일
      buyer_addr: buyer_addr, // 구매자 주소
      buyer_postcode: buyer_postcode,
      m_redirect_url: `${m_redirect_url}/${params}`,
    };

    // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
    const callbackData = {
      discountReward: body.discountReward,
      orderId: id,
      itemName: itemName, // 상품명
      buyer_name: buyer_name,
      buyer_tel: buyer_tel,
      buyer_email: buyer_email, // 구매자 이메일
      buyer_addr: buyer_addr, // 구매자 주소
      buyer_postcode: buyer_postcode,
    }

    IMP.request_pay(data, callback.bind(null, callbackData));

    /* 4. 결제 창 호출하기 */
    async function callback(callbackData, response) {

      console.log(response);
      // 서버 전송 데이터
      const discountData = {
        discountReward: callbackData.discountReward,

      }
      const { success, customer_uid, imp_uid, merchant_uid, card_name, card_number, error_msg } = response; // ! 최초 정기구독 주문시 0원결제 사용되는 IMP UID

      const IMPORT_PAYMENT_CANCEL = response.error_msg?.indexOf('[결제포기]') >= 0;
    /* 3. 콜백 함수 정의하기 */
    if (success) {

      // 아임포트 전송데이터
      const data = {
        customer_uid: customer_uid,
        merchant_uid: merchantUid, // 서버로부터 받은 주문번호
        amount: body.paymentPrice,
        name: callbackData.itemName,
        buyer_name:callbackData.buyer_name,
        buyer_tel: callbackData.buyer_tel,
        buyer_email: callbackData.buyer_email, // 구매자 이메일
        buyer_addr: callbackData.buyer_addr, // 구매자 주소
        buyer_postcode: callbackData.buyer_postcode, // 구매자 우편번호
      };

      const paymentResult = await axios
      .post(
        `${window.location.origin}/api/iamportSubscribe`,
        data,
        {headers: {
          'Content-Type': 'application/json',}}
      )
      .then((res) => {
        console.log(res.data);
        console.log(
          '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
          res,
        );

        return res;
      })
      .catch((err) => {
        console.error('goodsflow otp err: ', err);

        return err.response;
      });
      console.log(paymentResult);
      console.log(paymentResult.data);

      const { code, message, response } = paymentResult.data; // 두 번째 전달받는 값.

      if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)


        const {imp_uid: again_imp_uid} = response;

        if ( response.status === "paid" ) { //카드 정상 승인

          const r = await postObjData(`/api/orders/${id}/subscribe/success`, {
            impUid : again_imp_uid, // impUid는 두 번째 결제에 값이 있어야, webhook에서 해당 주문을 찾을 수 있음.
            merchantUid : merchantUid, // merchantUid는 첫 번째, 두 번째 결제 모두 동일
            customerUid : customer_uid,
            discountReward: discountData.discountReward
          });
          console.log(r);
          if(r.isDone){
            // alert('결제 성공');
            window.location.href = `/order/orderCompleted/subscribe/${id}`;
          }
        } else if(response.status === 'failed'){ //카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
          //paymentResult.status : failed 로 수신됨
          const fail = await postObjData(`/api/orders/${id}/subscribe/fail`);
          console.log(fail);
           if(fail.isDone){
             alert(`결제 실패: ${error_msg}`);
             // startPayment();
             window.location.href = `/order/orderFailed`;
           }
        }
      } else if(paymentResult == null){ // 카드사 요청에 실패 (paymentResult is null)
        const fail = await postObjData(`/api/orders/${id}/subscribe/fail`);
        console.log(fail);
         if(fail.isDone){
           alert(`결제 실패: ${error_msg}`);
           // startPayment();
           window.location.href= `/order/orderFailed`;
         }
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
      alert("결제 취소 처리 중 알수 없는 오류가 발생하였습니다. 관리자에게 문의해주세요.")
       // 결제 실패 : 쿠폰null일때 500err -> 서버 오류 수정하셨다고 함 TODO 나중에 테스트하기
      //  const fail = await postObjData(`/api/orders/${id}/subscribe/fail`);
      //  console.log(fail);
      //   if(fail.isDone){
      //     alert(`결제 실패: ${error_msg}`);
      //     // startPayment();
      //     window.location.href= `/order/orderFailed`;
      //   }
    }

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
