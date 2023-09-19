import {DeleteCustomerBillingKeyAsUnsubscribeNaverpayRequest} from "@src/pages/api/iamport/deleteCustomerBillingKey";
import axios from "axios";
import {isWindowLoaded} from "@util/func/validation/IsWindowLoaded";


/**
 * @param customerUid 빌링키
 * @param reason 삭제 이유
 * @param requester 삭에 요청자 (네이버페이에서만 사용)
 * @link https://api.iamport.kr/#!/subscribe.customer/customer_delete
 */
export async function deleteIamportCustomerBillingKey({
                                                        customerUid,
                                                        reason,
                                                        requester
                                                      }: DeleteCustomerBillingKeyAsUnsubscribeNaverpayRequest) {
  if(!isWindowLoaded()) throw new Error("Window is not loaded");

  const localOrigin: string = window.location.origin;

  const data: DeleteCustomerBillingKeyAsUnsubscribeNaverpayRequest = {
    customerUid,
    reason,
    requester,
  }

  const res = await axios({
    method: "DELETE",
    url: `${localOrigin}/api/iamport/deleteCustomerBillingKey`,
    data: data,
    timeout: 10000 // 10초
  })
    .then(res => res)
    .catch(err => err.response);
  return res;

}
