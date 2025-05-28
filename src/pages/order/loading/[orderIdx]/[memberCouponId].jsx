import React from 'react';
import { postData } from '/src/pages/api/reqData';
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';

function OrderGeneralLoading(props) {
  const router = useRouter();
  const {
    orderIdx,
    memberCouponId,
    imp_uid,
    merchant_uid,
    imp_success,
    error_msg,
  } = router.query;

  useEffect(() => {
    (async () => {
      if (imp_success == 'true') {
        // console.log(merchant_uid);
        // console.log(imp_success);
        const r = await postData(`/api/orders/${orderIdx}/general/success`, {
          impUid: imp_uid,
          merchantUid: merchant_uid,
          memberCouponId: memberCouponId,
        });

        // console.log(r);
        await router.push(`/order/orderCompleted/${orderIdx}`);
        // 모바일 결제 실패했을때 결제실패 페이지로 이동
      } else if (imp_success == 'false') {
        if (error_msg.includes('결제포기')) {
          const cancel = await postData(
            `/api/orders/${orderIdx}/general/cancel`,
          );
          // console.log(cancel);
          alert(error_msg);
        } else {
          // 모바일 결제 실패
          const fail = await postData(`/api/orders/${orderIdx}/general/fail`);
          // console.log(fail);
          alert(error_msg);
          if (typeof window !== 'undefined') {
            // 임시로 넣은 코드 :  결제취소시 , 전역에 import 결제 html이 잔류하여, 없애기위한 용도
            // window.location.href= '/';
          }
        }
        // await router.push(`/order/orderFailed`);
      }
    })();
  }, []);

  return (
    <>
      <FullScreenRunningDog opacity={1} />
    </>
  );
}

export default OrderGeneralLoading;
