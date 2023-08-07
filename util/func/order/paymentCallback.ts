import {postDataSSR, postObjData} from "@src/pages/api/reqData";
import {removeIamportPaymentWindow} from "../removeIamportPaymentWindow";
import axios from "axios";
import {DeleteCustomerRequest} from "@src/pages/api/iamport/subscribeCustomers";

export async function faliedGeneralPayment(id:number, error_msg?: string) {
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

export interface PortoneFailDataInterface{
  customer_uid: string;
}


interface FailCallbackPropsInterface {
  orderId: number;
  error_msg: string;
  error_code?: string;
  data?:PortoneFailDataInterface // 아임포트의 경우, 결제 등록 시에는 customer_uid 넘어오지 않음.
  redirect?:boolean;
}

export async function failedSubscribePayment({orderId, error_msg, error_code, data, redirect}:FailCallbackPropsInterface) {

  const customer_uid = data?.customer_uid;
  if (customer_uid) {
    // 빌링키 삭제 실행 (*네이버페이 정기결제 해제 시, 필수)
    const deleteBillingKeyRes = await deleteIamportCustomerBillingKey({customer_uid: customer_uid}, {tryCount:1});
    if (deleteBillingKeyRes.status !== 200) {
      alert(`
    [빌링키 삭제 실패]\n
    - error_status: ${deleteBillingKeyRes.status}\n
    - error_message: failed to delete customer billing key
    `);
      return;
    }
  }



  const fail = await postObjData(`/api/orders/${orderId}/subscribe/fail`);
  console.log(fail);
  let errorMesasge = getErrorMessage(error_code, error_msg);
  alert(errorMesasge);

  if (fail.isDone) {
    removeIamportPaymentWindow();
  }

  if (redirect !== false) {
    window.location.href = `/order/orderFailed`;
  }


}




export async function cancelSubscribeOrder({orderId, error_msg, error_code}:FailCallbackPropsInterface) {

  const res = await postObjData(`/api/orders/${orderId}/subscribe/cancel`);
  console.log(res);



  if (res.isDone) {
    if (error_msg && error_code) {
      alert(`[결제취소]\n- error_code: ${error_code || ''}\n- error_msg:${error_msg}`);
    } else {
      alert(`[결제취소] \n- error_msg: ${error_msg}`);
    }
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
    alert(`[결제실패] \n- error_msg: ${error_msg}`);
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

async function deleteIamportCustomerBillingKey({customer_uid}:DeleteCustomerRequest, {tryCount}) {
  const localOrigin:string = window.location.origin;
  if(!localOrigin) throw new Error("WINDOW MUST BE EXIST");

  const data: DeleteCustomerRequest = {
    customer_uid
  }

  const res = await axios({
    method: "POST",
    url: `${localOrigin}/api/iamport/subscribeCustomers`,
    data: data,
    timeout: 60000
  })
    .then(res => res)
    .catch(err => err.response);

  console.log("--- deleteIamportCustomerBillingKey RES = ",res);

  if (res.status !== 200 && tryCount <= 3) {
    await deleteIamportCustomerBillingKey({customer_uid}, {tryCount: tryCount+1});

  } else {
    console.log("deleteIamportCustomerBillingKey > Canceled billing key")
    return res;
  }

}

export function getErrorMessage(error_code?: string, error_msg?: string) {
  let errorMesasge = "[결제실패]"
  if (error_code) {
    errorMesasge = errorMesasge + `\n- error_code: ${error_code}`;
  }

  if (error_msg) {
    errorMesasge = errorMesasge + `\n- error_msg:${error_msg}`
  }
  return errorMesasge;
}
