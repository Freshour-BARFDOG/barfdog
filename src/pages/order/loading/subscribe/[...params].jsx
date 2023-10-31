import React, {useEffect} from "react";
import {postDataSSR, postObjData} from '/src/pages/api/reqData';
import {useRouter} from "next/router";
import {FullScreenRunningDog} from '/src/components/atoms/FullScreenLoading';
import {
  failedSubscribePayment,
  invalidSuccessSubscribePaymentSSR,
  validPaymentSSR
} from "util/func/order/paymentCallback";
import {axiosBaseURLBySSR} from "../../../api/axios/axiosBaseURLBySSR";

function OrderCompletedPage({paymentSuccess, errorMessage}) {

  const router = useRouter();
  const { imp_success,error_msg, params } = router.query;
  const [orderIdx, customUid, price, merchantUid, name] = params;

  // // console.log(router.query);

  // 모바일 결제 실패했을때 결제실패 페이지로 이동
  useEffect(() => {
    (async ()=>{

      if(paymentSuccess==true){

        await router.push(`/order/orderCompleted/subscribe/${orderIdx}/${customUid}/${price}/${merchantUid}/${name}`);

      } else if(imp_success == 'false'|| paymentSuccess === false){

        if(error_msg?.includes('결제포기')){
          const cancel = await postObjData(`/api/orders/${orderIdx}/subscribe/cancel`);
          // console.log(cancel);
        }else{
          // 모바일 결제 실패
          const availableErrorMessage = errorMessage || error_msg;
          await failedSubscribePayment({orderId:orderIdx, error_msg: availableErrorMessage, error_code:null, redirect: false});
        }

        await router.push(`/order/orderFailed`);
      }
    })();

  }, []);
  return (
    <>
      <FullScreenRunningDog opacity={1} />
    </>
  );
}

export default OrderCompletedPage;

export async function getServerSideProps({ query, req }) {
  const { params, imp_uid, imp_success, error_msg, error_code} = query;

  let invalidPayment = false;
  let redirectUrl = null;

  const [orderId, customUid, paymentPrice, merchantUid, itemName, buyer_name, buyer_tel, buyer_email, buyer_addr, buyer_postcode, discountReward] = params;
  // 결제성공여부
  let paymentSuccess = null;
  let errorMessage = null;

  if(imp_success == 'true'){

    const data= {
      customer_uid: customUid,
      merchant_uid: merchantUid, // 새로 생성한 결제(재결제)용 주문 번호
      amount: Number(paymentPrice), //  ! [중요] 결제금액 변경(변조) 여부 검증 대상.
      name: itemName,
      buyer_name: buyer_name,
      buyer_tel: buyer_tel,
      buyer_email: buyer_email,
      buyer_addr: buyer_addr,
      buyer_postcode: buyer_postcode,
    }

    const localApi = axiosBaseURLBySSR(req, {timeout: 60000});
    const paymentResult = await localApi.post(`/api/iamport/iamportSubscribe`, data)
        .then(res => res)
        .catch(err => err.response);

      // validation - 카드사 요청에 실패
      if (!paymentResult?.data) {
        await failedSubscribePayment({orderId:orderId, error_msg, error_code});
        return;
      }

      // console.log("--- paymentResult.data = \n",paymentResult.data);

      const {code, message, response } = paymentResult.data; // 실제 결제 결과 (첫 번째 결제: 결제등록/ 두 번째 결제: 실제 결제).

      // console.log("code: ",code, "----- [mobile] subscribe again -  response: ",response);
      if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)

        const {imp_uid: again_imp_uid, fail_reason: error_msg} = response;

        if(response.status==='paid'){//카드 정상 승인

          // validation - 결제 금액 검증
          const isValid = await validPaymentSSR(req,{orderId: orderId, impUid: again_imp_uid}); // 두 번째 결제 imp_uid 검증 (첫 번째 imp_uid는 '결제등록')
          if (!isValid) {
            const data = {
              impUid: again_imp_uid, // API SERVER webhook에서 해당 주문을 찾기 위해, impUid 사용됨
              merchantUid: merchantUid,
              customerUid: customUid,
              discountReward: discountReward
            }
            // 주문 금액 검증 기능 - 자체 구현
            const fail = await invalidSuccessSubscribePaymentSSR(req, {orderId: orderId, data: data });
            if (fail.status === 200) {
              const data = fail.data;
              const subscribeId = data.subscribeId;
              const dogId = data.dogId;
              invalidPayment = true;
              redirectUrl = `/order/orderFailed/invalidPayment/subscribe?subscribeId=${subscribeId}&dogId=${dogId}`;
            }

          } else {

            const r = await postDataSSR(req,`/api/orders/${orderId}/subscribe/success`, {
              impUid : again_imp_uid, // ! "아임포트 webhook" 처리 시, "again" response의 imp_uid 필요.
              merchantUid : merchantUid,
              customerUid : customUid,
            });
            // console.log(r);
            if(r.status === 200){
              paymentSuccess=true;
            }
          }

        } else if(response.status === 'failed'||paymentResponse==null){
          // ex. 한도초과 잔액부족 등
          //paymentResponse.status : failed 로 수신됨
          errorMessage = response.fail_reason || "결제가 완료되었으나, 알 수 없는 이유로 결제완료 되지 않았습니다.";
          paymentSuccess=false;
        }

      } else { // 카드사 요청에 실패 (paymentResponse is null)
        paymentSuccess=false;
      }
  } else if(imp_success == 'false') {
    paymentSuccess=false;
  }


  // 결제금액 변조되었을 경우, 해당 페이지로 이동
  if(invalidPayment){
    return {
      redirect:{
        permanent: false,
        destination: redirectUrl,
      }
    }

  }
  return { props: { paymentSuccess, errorMessage } };
}
