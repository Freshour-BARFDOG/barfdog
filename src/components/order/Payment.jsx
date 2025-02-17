import React, { useEffect, useState } from 'react';
import {
  validate,
  validateInBundleDelivery,
} from 'util/func/validation/validation_ordersheet';
import { valid_hasFormErrors } from 'util/func/validation/validationPackage';
import { postObjData } from 'src/pages/api/reqData';
import s from '/src/pages/order/ordersheet/ordersheet.module.scss';
import Spinner from '@src/components/atoms/Spinner';
import { calcOrdersheetPrices } from './calcOrdersheetPrices';
import { useRouter } from 'next/router';
import axios from 'axios';
import { availablePaymentState } from 'util/func/availablePaymentState';
import { paymethodFilter } from 'util/filter_iamport_paymethod';
import { generateCustomerUid } from 'util/func/order/generateCustomerUid';
import { paymentMethodType, pgType } from 'store/TYPE/paymentMethodType';
import {
  getNaverpayGeneralPaymentParam,
  getNaverpaySubscribePaymentParam,
} from 'store/TYPE/NaverpayPaymentParams';
import useDeviceState from 'util/hook/useDeviceState';
import {
  cancelSubscribeOrder,
  failedSubscribePayment,
  faliedGeneralPayment,
  invalidSuccessSubscribePayment,
  successSubscribePayment,
  validPayment,
} from 'util/func/order/paymentCallback';
import { isAbandonedPayment } from 'util/func/order/paymentUtils';
import { getAmountOfPaymentRegisterationByPaymentMethod } from '../../../util/func/subscribe/getAmountOfPaymentRegisterationByPaymentMethod';
import { FullScreenLoading } from '../atoms/FullScreenLoading';
import { getCookie } from '@util/func/cookie';


export function Payment({
  info,
  form,
  isLoading,
  setIsLoading,
  setFormErrors,
  orderType = 'general',
  hasAllianceDiscount = false,
}) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const router = useRouter();
  const ds = useDeviceState();
  const isMobile = ds.isMobile;

  const hasAllianceSubscribeDiscount = hasAllianceDiscount && info.newSubscribe;

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
  console.log('info', info)
  console.log('form', form)

  const onSubmit = async () => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');

    // if(form.paymentMethod === paymentMethodType.NAVER_PAY){
    //   alert(`네이버페이 결제 준비중입니다. 다른 결제수단을 선택해주세요.`);
    //   return;
    // }

    if (!availablePaymentState({ reward: info.reward })) {
      alert(
        '결제할 수 없는 상태입니다.\n적립금, 쿠폰 등 사용가능여부를 확인하시기 바랍니다.',
      );
      window.location.href = '/mypage/reward';
      return;
    }

    const valid_target = {
      name: form.deliveryDto.name,
      phone: form.deliveryDto.phone,
      city: form.deliveryDto.city,
      street: form.deliveryDto.street,
      detailAddress: form.deliveryDto.detailAddress,
      paymentMethod: form.paymentMethod,
      agreePrivacy: form.agreePrivacy,
      paymentPrice: calcOrdersheetPrices(form, orderType, {deliveryFreeConditionPrice: info.freeCondition,}).paymentPrice,
    };

    // ! bundle일 경우, validation항목 다르게 변경해주기.
    let errObj;
    if (form.bundle) {
      errObj = validateInBundleDelivery(valid_target);
    } else {
      errObj = validate(valid_target);
    }

    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);

    if (!isPassed) {
      setIsSubmitted(false);
      return alert('유효하지 않은 항목이 있습니다.');
    }
    // 결제 로직 시작
    setIsSubmitted(true);
    await startPayment();
  };

  async function startPayment() {
    const {
      discountTotal,
      discountCoupon,
      overDiscount,
      paymentPrice,
      discountGrade,
      discountSubscribeAlliance,
    } = calcOrdersheetPrices(
      form,
      orderType,
      {deliveryFreeConditionPrice: info.freeCondition},
      orderType === 'general' ? hasAllianceDiscount : hasAllianceSubscribeDiscount
    );

    const customerUid = generateCustomerUid(); // ! [client '결제실패' / Webhook 'paid'] CASE 처리를 위해, 주문서 생성 시에도 cutomerUid 전송.

    // // @YYL 콕뱅크 주문인지 확인
    // let allianceType = "NONE"
    // if(getCookie("alliance") === "cb") allianceType = "COKBANK"

    const body =
      orderType === 'general'
        ? {
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
              deliveryName: "", // 배송지 이름
              request: form.deliveryDto.request, // 배송 요청사항
            },
            deliveryId: form.deliveryId || null, // 묶음 배송 할 배송 id . 묶음배송 아닐 경우 null
            orderPrice: form.orderPrice, //  주문 상품 총 가격 (할인 적용 전)
            deliveryPrice: form.deliveryPrice, // 배송비
            discountTotal: discountTotal, // 총 할인 합계    ! 쿠폰할인금 적용
            discountReward: Number(form.discountReward), // 사용할 적립금
            discountCoupon: discountCoupon, // 쿠폰 적용으로 인한 할인금 ! coupon할인금 적용
            overDiscount: overDiscount, // 초과할인 금액
            paymentPrice: paymentPrice, // 최종 결제 금액
            paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
            // nextDeliveryDate: form.nextDeliveryDate, // ! 일반주문 시, request field에 없는 값.
            agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
            brochure: form.brochure, // 브로슈어 수령여부

            // allianceType: allianceType, // 콕뱅크 주문인지 확인
          }
        : {
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
            overDiscount: overDiscount, // 초과할인 금액
            paymentPrice: paymentPrice, // 최종 결제 금액
            paymentMethod: form.paymentMethod, // 결제방법  [CREDIT_CARD, NAVER_PAY, KAKAO_PAY]
            nextDeliveryDate: form.nextDeliveryDate, // 배송 예정일 'yyyy-MM-dd', 첫 결제 배송날짜는 프론트에서 넘어온 값으로 저장함
            agreePrivacy: form.agreePrivacy, // 개인정보 제공 동의
            brochure: form.brochure, // 브로슈어 수령여부
            // allianceType: allianceType, // 콕뱅크 주문인지 확인
          };
        if (hasAllianceSubscribeDiscount) {
          body.discountSubscribeAlliance = discountSubscribeAlliance;
          // body.paymentPrice = paymentPrice;
        }

    console.log('----- request body:\n', body);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      // send DATA to api server after successful payment
      const subscribeId = router.query?.subscribeId;
      const apiUrl =
        orderType === 'general'
          ? `/api/orders/general`
          : `/api/orders/subscribe/${subscribeId}`;
      const res = await postObjData(apiUrl, body);
      console.log('res!!!!!!', res)

      if (res.isDone) {
        const merchantUid = res.data.data.merchantUid;

        const orderId = res.data.data.id;
        if (orderType === 'general') {

          // 일반 주문 결제
          await generalPayment({
            body: body,
            id: orderId,
            merchantUid: merchantUid,
          });
        } else {
          // 구독 주문 결제
          await subscribePayment({
            body: body,
            id: orderId, // 주문 id
            merchantUid: merchantUid,
            customerUid: customerUid,
            subscribeId: Number(subscribeId),
          }); // ! 정기결제 시, 카드 저장을 위해 CustomerUid 필요
        }
        // alert('결제완료 -> 이후 확인버튼 클릭 -> 결제완료페이지로 Redir');
        const scrollTopPos = document.documentElement.scrollTop;
        document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        top: -${scrollTopPos}px;`;
      } else if (res.error) {
        alert(`[결제 준비 오류]\n${res.error}`);
        setIsSubmitted(false);
      } else {
        alert(`${res.error} \n내부 통신장애입니다. 잠시 후 다시 시도해주세요.`);
        setIsSubmitted(false);
      }
    } catch (err) {
      alert(
        'API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.\n ERROR:' +
          err.response,
      );
      console.error('API통신 오류 : ', err.response);
      setIsSubmitted(false);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: false,
      }));
    }
  }

  async function generalPayment({ body, id, merchantUid }) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);
    // 주문명
    const itemList = form.orderItemDtoList;
    const firstItemName = `${itemList[0].name}`;
    const itemName = `${firstItemName} ${
      itemList.length > 1 ? `외 ${itemList.length - 1}개` : ''
    }`; // 네이버일 경우, '외 1개' 삭제필요

    /* 2. 결제 데이터 정의하기  1원 결제 -> 실패 , 100원 결제 -> 성공 */
    // TODO: name(주문명) test 지우기
    
    const data = {
      pg: pgType.GENERAL[body.paymentMethod], // PG사
      pay_method: paymethodFilter(body.paymentMethod), // 결제수단
      merchant_uid: merchantUid, // 주문번호
      amount: body.paymentPrice, // 결제금액 // ! [중요] 결제금액 변경(변조) 여부 검증 대상.
      name: `${itemName}`, // 주문명
      buyer_name: info.name, // 구매자 이름
      buyer_tel: info.phone, // 구매자 전화번호
      buyer_email: info.email, // 구매자 이메일
      buyer_addr: `${info.defaultAddress.street}, ${info.defaultAddress.detailAddress}`, // 구매자 주소
      buyer_postcode: info.defaultAddress.zipcode, // 구매자 우편번호
      m_redirect_url: `${window.location.origin}/order/loading/${id}`,
    };
    // 네이버 페이 추가
    if (body.paymentMethod === paymentMethodType.NAVER_PAY) {
      Object.assign(
        data,
        getNaverpayGeneralPaymentParam({ items: itemList, isMobile: isMobile }),
      ); // 네이버페이 데이터 합침
    }

    // console.log(" - IMP.request_pay(data)\n", data);

    // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
    const callbackData = {
      discountReward: body.discountReward,
      orderId: id,
    };
    IMP.request_pay(data, callback.bind(null, callbackData));

    /* 4. 결제 창 호출하기 */
    async function callback(callbackData, response) {
      // console.log(response); // callback response => error_code 미포함.
      const { success, imp_uid, merchant_uid, error_msg } = response;

      /* 3. 콜백 함수 정의하기 */
      if (success) {
        // 결제 성공 시: 결제 승인 또는 가상계좌 발급에 성공한 경우
        // TODO: 결제 정보 전달

        const r = await postObjData(`/api/orders/${id}/general/success`, {
          impUid: imp_uid,
          merchantUid: merchant_uid,
          discountReward: callbackData.discountReward, // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
        });
        // console.log(r);
        if (r.isDone) {
          // alert('결제 성공');
          window.location.href = `/order/orderCompleted/${id}`;
        }
      } else if (error_msg.includes('결제포기')) {
        // 사용자가 결제 취소(결제포기)했을때
        await postObjData(`/api/orders/${id}/general/cancel`);
        window.location.href = `/order/orderFailed`;
      } else {
        // 결제 실패
        await faliedGeneralPayment(id, error_msg);
      }
    }
  }

  async function subscribePayment({
    body,
    id,
    merchantUid,
    customerUid,
    subscribeId,
  }) {
    /* 1. 가맹점 식별하기 */
    const IMP = window.IMP;
    IMP.init(process.env.NEXT_PUBLIC_IAMPORT_CODE);
    
    /* 2. [결제등록] 결제 데이터 정의하기 */
    const itemName = `${info.recipeNameList.join(', ')}`;
    const mobileItemName = `${info.recipeNameList.join(', ')}`;
    const buyer_name = info.name;
    const buyer_tel = info.phone;
    const buyer_email = info.email;
    const buyer_addr = `${info.address.street}, ${info.address.detailAddress}`;
    const buyer_postcode = info.address.zipcode;
    const m_redirect_url = `${window.location.origin}/order/loading/subscribe`;
    const discountReward = body.discountReward;
    const params = `${id}/${customerUid}/${body.paymentPrice}/${merchantUid}/${mobileItemName}/${buyer_name}/${buyer_tel}/${buyer_email}/${buyer_addr}/${buyer_postcode}/${discountReward}`;

    // 결제등록 DATA
    const data = {
      pg: pgType.SUBSCRIBE[body.paymentMethod], // PG사 + 사이트키
      pay_method: 'card', // 결제수단
      // merchant_uid: createRandomMerchantUidByDateTime(), // 주문번호
      merchant_uid: null, // 주문번호
      amount: getAmountOfPaymentRegisterationByPaymentMethod({
        method: body.paymentMethod,
        originAmount: body.paymentPrice,
      }),
      customer_uid: customerUid,
      name: `${itemName}`, // 네이버페이 검수 조건: 상품명 그대로 노출
      buyer_name: buyer_name,
      buyer_tel: buyer_tel,
      buyer_email: buyer_email, // 구매자 이메일
      buyer_addr: buyer_addr, // 구매자 주소
      buyer_postcode: buyer_postcode,
      m_redirect_url: `${m_redirect_url}/${params}`,
    };

    // 결제 데이터 - 네이버 페이 추가
    if (body.paymentMethod === paymentMethodType.NAVER_PAY) {
      Object.assign(
        data,
        getNaverpaySubscribePaymentParam({ subscribeId, isMobile: isMobile }),
      ); // 네이버페이 데이터 합침
    }

    // console.log(" - IMP.request_pay(data)\n", data);

    // 결제 이슈를 보완하기 인하여 Api Request Data 추가를 위해 사용
    const callbackData = {
      discountReward: discountReward,
      orderId: id,
      itemName: itemName, // 상품명
      buyer_name: buyer_name,
      buyer_tel: buyer_tel,
      buyer_email: buyer_email, // 구매자 이메일
      buyer_addr: buyer_addr, // 구매자 주소
      buyer_postcode: buyer_postcode,
    };

    /* 3. 결제 창 호출하기 */
    IMP.request_pay(data, callback.bind(null, callbackData));

    async function callback(callbackData, paymentRegistrationResponse) {
      // console.log(paymentRegistrationResponse);

      const { success, customer_uid, error_code, error_msg } =
        paymentRegistrationResponse; // [정기구독 등록] API Response
      // paymentRegistrationResponse > customer_uid: 결제 성공, 실패 시 나타남 (cf. 네이버페이: 정기결제 등록됨 / billingKey 삭제 시, 정기결제 등록해제 됨)

      // 결제 포기
      if (isAbandonedPayment(paymentRegistrationResponse?.error_msg)) {
        await cancelSubscribeOrder({ orderId: id, error_msg, error_code });
        return;
      }

      if (success) {
        /* 4. [실결제] 결제 데이터 정의하기 */
        const data = {
          customer_uid: customer_uid,
          merchant_uid: merchantUid, // 서버로부터 받은 주문번호
          amount: body.paymentPrice, //  ! [중요] 결제금액 변경(변조) 여부 검증 대상.
          name: callbackData.itemName,
          buyer_name: callbackData.buyer_name,
          buyer_tel: callbackData.buyer_tel,
          buyer_email: callbackData.buyer_email, // 구매자 이메일
          buyer_addr: callbackData.buyer_addr, // 구매자 주소
          buyer_postcode: callbackData.buyer_postcode, // 구매자 우편번호
        };

        // 아임포트 전송데이터
        const localOrigin = window.location.origin;
        const paymentResponse = await axios({
          method: 'POST',
          url: `${localOrigin}/api/iamport/iamportSubscribe`,
          data: data,
          timeout: 60000,
        })
          .then((res) => res)
          .catch((err) => err.response);

        // console.log(paymentResponse.data);

        /* 5. 결제결과 처리하기 */
        // 빌링키삭제를 위한 DATA (실제 결제 요청 후에 포트운 -> billing가 등록되므로, 실결제 후에만 사용)
        const deleteBillingKeyData = {
          customer_uid: customer_uid,
          paymentMethod: body.paymentMethod,
        };

        // validation - 카드사 요청에 실패
        if (!paymentResponse?.data) {
          await failedSubscribePayment({ orderId: id, error_msg, error_code });
          return;
        }

        const { code, response: paymentAgainResponse } = paymentResponse.data; // 실제 결제 결과 (첫 번째 결제: 결제등록/ 두 번째 결제: 실제 결제).

        const {
          imp_uid: again_imp_uid,
          status,
          fail_reason: error_msg,
        } = paymentAgainResponse;

        // validation - 카드사 통신 실패
        if (code !== 0) {
          await failedSubscribePayment({ orderId: id, error_msg, error_code });
          return;
        }

        // validation - 카드 승인 실패 (예: 고객 카드 한도초과, 거래정지카드, 잔액부족 등)
        if (status === 'failed') {
          await failedSubscribePayment({ orderId: id, error_msg, error_code });
          return;
        }

        //카드 정상 승인
        if (status === 'paid') {
          // 서버 전송 데이터
          const data = {
            impUid: again_imp_uid, // impUid는 두 번째 결제에 값이 있어야, webhook에서 해당 주문을 찾을 수 있음.
            merchantUid: merchantUid, // merchantUid는 첫 번째, 두 번째 결제 모두 동일
            customerUid: customer_uid,
            discountReward: callbackData.discountReward,
          };

          // validation - 결제 금액 검증
          const isValid = await validPayment({
            orderId: id,
            impUid: again_imp_uid,
          }); // 두 번째 결제 imp_uid 검증 (첫 번째 imp_uid는 '결제등록')
          if (!isValid) {
            // 주문 금액 검증 기능 - 자체 구현
            const errorMsg =
              '[결제실패] 주문금액과 결제금액이 일치하지 않습니다. 결제가 즉시 취소됩니다.';
            await invalidSuccessSubscribePayment({
              orderId: id,
              data: data,
              error_msg: errorMsg,
              error_code: error_code,
            });
            return;
          }

          await successSubscribePayment(id, data);
        }
      } else {
        // 결제 등록 시, [결제실패, 결제 포기] CASE 에서는 customer Uid 넘어오지 않음
        // 따라서 아래 결제실패 시, 빌링키 삭제 로직 적용 X
        await failedSubscribePayment({ orderId: id, error_msg, error_code });
      }
    }
  }

  return (
    <>
      {isSubmitted && <FullScreenLoading opacity={0.5} />}
      <button onClick={onSubmit} className={s.btn_box} type={'button'}>
        {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '결제하기'}
      </button>
    </>
  );
}
