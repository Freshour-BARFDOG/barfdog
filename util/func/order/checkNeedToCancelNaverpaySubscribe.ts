import {PaymentMethod} from "@store/TYPE/paymentMethodType";
import {orderStatus as OrderStatus} from "@store/TYPE/orderStatusTYPE";
import axios from "axios";
import {SetStateAction} from "react";
import {isFunction} from "@util/func/validation/isFunction";
import {GetCustomerBillingKeyResponse, iamportBillingKeyResponseCode} from "@src/pages/api/iamport/getCustomerBillingKey";


interface PropsInterfae {
  paymentMethod: PaymentMethod,
  orderStatus: string,
  paid: boolean,
  customerUid: string
  orderId?: number;
  setIsLoading?: SetStateAction<any>
}

/**
 * <h1>네이버페이 정기결제 수동 해지</h1>
 * <h1>아래 조건에 대하여 유효한 빌링키인 경우 빌링키 삭제</h1>
 * <pre>
 *   - 필요이유: 클라이언트에서 결제 실패 & 카드사 미결제된 경우, 네이버페이 정기결제 (네이버페이 검수 조건)
 *   - 수동 해지 필요이유: 클라이언트에서 결제 실패 & 카드사 결제 성공한 경우 webhook을 통한 결제성공 처리하기 위함
 *   1. 네이버페이
 *   2. 주문상태 결제실패
 *   3. 포트원 실제 결제 실패
 *   4. 빌링키 미삭제
 * </pre>
 * @param paymentMethod 결제수단
 * @param orderStatus 주문 상태
 * @param paid 포트원 결제 여부
 * @param customerUid 빌링키
 */
export const checkNeedToCancelNaverpaySubscribe = async ({
                                                           paymentMethod,
                                                           orderStatus,
                                                           paid,
                                                           customerUid,
                                                           orderId,
                                                           setIsLoading
                                                         }: PropsInterfae) => {
  // console.log(paymentMethod);
  // console.log(orderStatus);
  // console.log(paid);
  // console.log(customerUid);

  let needToDeleteBillingkey: boolean = false;
  if (!paymentMethod || !orderStatus || paid === null || !customerUid) return needToDeleteBillingkey;


  // ================================= 불필요한 API 사용 막기 =================================

  // STEP 1
  const paymentMethodCond = paymentMethod === PaymentMethod.NAVER_PAY;
  if (!paymentMethodCond) return needToDeleteBillingkey;

  // STEP 2
  const orderStatusCond = orderStatus === OrderStatus.FAILED;
  if (!orderStatusCond) return needToDeleteBillingkey;

  // STEP 3
  const paidCond = paid === false;
  if (!paidCond) return needToDeleteBillingkey;

  // ================================= 불필요한 API 사용 막기 =================================

  // STEP 4
  const isNaverpaySubscriber = await getSubscribeCustomerBillingKey({customerUid, setIsLoading});
  console.log("----- checkNeedToCancelNaverpaySubscribe > isNaverpaySubscriber = ", isNaverpaySubscriber, `customerUid = ${customerUid}`);

  // 최종 검증
  needToDeleteBillingkey = paymentMethodCond && orderStatusCond && paidCond && isNaverpaySubscriber;

  return needToDeleteBillingkey;
}


const getSubscribeCustomerBillingKey = async ({customerUid, setIsLoading}): Promise<boolean> => {
  let isValidBillingKey: boolean;

  try {
    if (isFunction(setIsLoading)) {
      setIsLoading(true);
    }

    const localOrigin = window.location.origin;
    const res = await axios({
      method: "POST",
      url: `${localOrigin}/api/iamport/getCustomerBillingKey`,
      data: {
        customerUid: customerUid
      },
      timeout: 10000
    })
      .then(res => res)
      .catch(err => err.response);

    console.log(res);
    if (res.status === 200) {
      const d: GetCustomerBillingKeyResponse = res.data;
      const data = {
        code: d.code,
        message: d.message,
        pg_provider: d.response?.pg_provider,
        customerUid: d.response?.customer_id
      }

      // =================================================================
      isValidBillingKey = data.code === iamportBillingKeyResponseCode.valid;
      // =================================================================
    } else {
      console.error("API 요청에 실패하였습니다. 잠시 후 다시 시도해주세요.");
    }
  } catch (err) {
    console.error(err);
    alert("API 요청 중 오류가 발생하였습니다. 사이트 관리자에게 문의하시기 바랍니다.");
  } finally {
    if (isFunction(setIsLoading)) {
      setIsLoading(false);
    }
  }

  return isValidBillingKey;

};
