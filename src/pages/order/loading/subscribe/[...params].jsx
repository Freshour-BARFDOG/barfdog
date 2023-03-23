import React, { useEffect } from "react";
import { postObjData ,postDataSSR} from '/src/pages/api/reqData';
import axios from 'axios';
import { useRouter } from "next/router";
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';

function OrderCompletedPage(props) {
  
  const router = useRouter();
  const { imp_success,error_msg, params } = router.query;
  const [orderIdx, customUid, price, merchantUid, name] = params;

  // console.log(router.query);

  // 모바일 결제 실패했을때 결제실패 페이지로 이동
  useEffect(() => {
    (async ()=>{
    
      if(props.paymentSuccess==true){
        router.push(`/order/orderCompleted/subscribe/${orderIdx}/${customUid}/${price}/${merchantUid}/test${name}`);
      }
      if(imp_success == 'false'|| props.paymentSuccess === false){
        if(error_msg?.includes('결제포기')){
          const cancel = await postObjData(`/api/orders/${orderIdx}/subscribe/cancel`);
          console.log(cancel);
        }else{
        // 모바일 결제 실패
        const fail = await postObjData(`/api/orders/${orderIdx}/subscribe/fail`);
        console.log(fail);
        }
        router.push(`/order/orderFailed`);
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

export async function getServerSideProps(ctx) {
  const { query, req } = ctx;
  const { params, imp_uid, imp_success, error_msg} = query;
  
  console.log(query);
  const [orderIdx, customUid, price, merchantUid, itemName, buyer_name, buyer_tel, buyer_email, buyer_addr] = params;
  // 결제성공여부
  let paymentSuccess = null;

  if(imp_success == 'true'){
    // console.log(merchantUid);
    // console.log(imp_success);

      // 인증 토큰 발급 받기
      const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key:process.env.NEXT_PUBLIC_IAMPORT_REST_API_KEY, // REST API 키
          imp_secret: process.env.NEXT_PUBLIC_IAMPORT_REST_API_SECRET,  // REST API Secret
        }
      });
      const { access_token } = getToken.data.response;

      const paymentResult = await axios({
        url: `https://api.iamport.kr/subscribe/payments/again`,
        method: "post",
        headers: { "Authorization": access_token }, // 인증 토큰을 Authorization header에 추가
        data: {
          customer_uid: customUid,
          merchant_uid: merchantUid, // 새로 생성한 결제(재결제)용 주문 번호
          amount: price,
          name: itemName,
          buyer_name: buyer_name,
          buyer_tel: buyer_tel,
          buyer_email: buyer_email,
          buyer_addr: buyer_addr,
        }
      });
      const { code, message, response } = paymentResult.data;

      console.log("code: ",code, "message: ",message, "response: ",response);
      if (code === 0) { // 카드사 통신에 성공(실제 승인 성공 여부는 추가 판단이 필요함)
        
        const {imp_uid: again_imp_uid} = response;
        
        if(response.status==='paid'){//카드 정상 승인
        
          const r = await postDataSSR(req,`/api/orders/${orderIdx}/subscribe/success`, {
            impUid : again_imp_uid, // ! "아임포트 webhook" 처리 시, "again" response의 imp_uid 필요.
            merchantUid : merchantUid,
            customerUid : customUid,
          });
          console.log(r);
          if(r.status === 200){
            paymentSuccess=true;
          }
     
        } else if(response.status === 'failed'||paymentResult==null){
          //paymentResult.status : failed 로 수신됨
          paymentSuccess=false;

        }
        // res.send({ ... });
      } else { // 카드사 요청에 실패 (paymentResult is null)
        paymentSuccess=false;
      }
  } else if(imp_success == 'false') {
    paymentSuccess=false;
  }
  return { props: { orderIdx, paymentSuccess } };
}
