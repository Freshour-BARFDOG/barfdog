import {postDataSSR, postObjData} from "@src/pages/api/reqData";
import {removeIamportPaymentWindow} from "../removeIamportPaymentWindow";

export async function faliedGeneralPayment(id, error_msg?: string) {
  const fail = await postObjData(`/api/orders/${id}/general/fail`);
  console.log(fail);
  if (error_msg) {
    alert(`[결제실패] \nerror_msg: ${error_msg}`);
  }

  if (fail.isDone) {
    // 결제 취소 시 , 전역에 import 결제 html이 잔류하여, 없앰
    removeIamportPaymentWindow();
    window.location.href = `/order/orderFailed`;
  }
}

export async function failedSubscribePayment(orderId, error_msg, error_code) {
  const fail = await postObjData(`/api/orders/${orderId}/subscribe/fail`);
  console.log(fail);
  if (error_msg && error_code) {
    alert(`[결제실패]\n- error_code: ${error_code || ''}\n- error_msg:${error_msg}`);
  } else {
    alert(`[결제실패] \nerror_msg: ${error_msg}`);
  }

  if (fail.isDone) {
    removeIamportPaymentWindow();
    window.location.href = `/order/orderFailed`;
  }
}

export async function cancelSubscribeOrder(orderId, error_msg) {
  const res = await postObjData(`/api/orders/${orderId}/subscribe/cancel`);
  console.log(res);
  if (res.isDone) {
    alert(`[결제취소] \nerror_msg: ${error_msg}`);
  } else {
    alert(`[결제취소] 처리 중 오류가 발생하였습니다.`);
  }
  window.location.reload();
}

export async function successSubscribePayment(orderId, data) {
  const body = {
    impUid: data.impUid, // impUid는 두 번째 결제에 값이 있어야, webhook에서 해당 주문을 찾을 수 있음.
    merchantUid: data.merchantUid, // merchantUid는 첫 번째, 두 번째 결제 모두 동일
    customerUid: data.customerUid,
    discountReward: data.discountReward
  }
  const r = await postObjData(`/api/orders/${orderId}/subscribe/success`, body);
  console.log(r);
  if (r.isDone) {
    alert('결제 성공');
    window.location.href = `/order/orderCompleted/subscribe/${orderId}`;
  }
}

export async function invalidSuccessSubscribePayment({orderId, data, error_msg, error_code}) {
  //  API FLOW:  API SERVER 위변조 취소 요청 => API SERVER 내에서 포트원 결제정보 위변조 여부 재검증 => 위변조된 주문일 경우 즉시 결제취소
  const body = {
    impUid: data.impUid, // impUid는 두 번째 결제에 값이 있어야, webhook에서 해당 주문을 찾을 수 있음.
    merchantUid: data.merchantUid, // merchantUid는 첫 번째, 두 번째 결제 모두 동일
    customerUid: data.customerUid,
    discountReward: data.discountReward
  }
  const fail = await postObjData(`/api/orders/${orderId}/subscribe/success/invalidPayment`, body);
  console.log(fail);
  if (error_msg && error_code) {
    alert(`[결제실패]\n- error_code: ${error_code || ''}\n- error_msg:${error_msg}`);
  } else {
    alert(`[결제실패] \nerror_msg: ${error_msg}`);
  }


  if (fail.isDone) {
    removeIamportPaymentWindow();
    window.location.href = `/order/orderFailed`;
  }
}

export async function invalidSuccessSubscribePaymentSSR(req, {orderId, data}) {
  const body = {
    impUid: data.impUid, // impUid는 두 번째 결제에 값이 있어야, webhook에서 해당 주문을 찾을 수 있음.
    merchantUid: data.merchantUid, // merchantUid는 첫 번째, 두 번째 결제 모두 동일
    customerUid: data.customerUid,
    discountReward: data.discountReward
  }
  const failRes = await postDataSSR(req, `/api/orders/${orderId}/subscribe/success/invalidPayment`, body);
  console.log(failRes);
  return failRes;
}

export async function validPayment({orderId, impUid}) {
  let isValid = null;
  const res = await postObjData(`/api/orders/${orderId}/validation`, {
    impUid: impUid
  });
  if (res.isDone) {
    isValid = res.data.data.valid;
  }
  console.log(res, "\n- isValid = ", isValid);

  return isValid;
}


export async function validPaymentSSR(req, {orderId, impUid}) {
  let isValid = null;
  const res = await postDataSSR(req, `/api/orders/${orderId}/validation`, {
    impUid: impUid
  });
  console.log("validPaymentSSR = res.data ", res.data);
  if (res.status === 200 && res?.data) {
    isValid = res.data.valid;
  }
  console.log(res, "\n- isValid = ", isValid);

  return isValid;
}
