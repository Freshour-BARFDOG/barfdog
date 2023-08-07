import {paymentMethodType} from "@store/TYPE/paymentMethodType";

interface PropsInterface {
  method: string;
  originAmount: number;
}




/**
 * <h1>결제 등록 시, 결제 금액 (첫 결제)</h1>
 * @param method 결제수단
 * @param originAmount 실결제금액

 * <pre>
 *
 * </pre>
 * @KCP 결제창에 표시될 금액으로 실제 승인은 이루어지지 않습니다. 빌링키 발급과 함께 최초 결제를 하려면, 결제창에 금액이 표시되도록 금액을 지정하고 발급받은 빌링키로 결제 요청을 합니다. <br/>
 *      @see https://github.com/iamport/iamport-manual/blob/master/%EB%B9%84%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/example/kcp-request-billing-key.md
 *
 * <br/>
 * @KAKAOPAY 빌링키 발급만 하는 경우 "0"으로 지정하고, 빌링키 발급과 최초 결제를 같이 요청하는 경우 가격을 지정합니다.
 *  https://github.com/iamport/iamport-manual/blob/master/%EB%B9%84%EC%9D%B8%EC%A6%9D%EA%B2%B0%EC%A0%9C/example/kakaopay-request-billing-key.md
 *
 * <br/>
 * @NAVERPAY 정기/반복 결제 등록과정에서는 결제승인이 이뤄지지 않습니다. (등록 후 결제할 금액을 고객에 표시하는 용도)
 * https://github.com/iamport/iamport-manual/blob/master/NAVERPAY/sample/naverpay-recurring.md
 *
 */
export const getAmountOfPaymentRegisterationByPaymentMethod = ({method, originAmount}: PropsInterface) => {
  let amount;
  if (method === paymentMethodType.CREDIT_CARD) {
    amount = originAmount; // 실결제 X / 결제창에 표기

  } else if (method === paymentMethodType.KAKAO_PAY) {
    amount = 0; // `0`원 아닐 경우, 실결제됨

  } else if (method === paymentMethodType.NAVER_PAY) {
    amount = originAmount; // 실결제 X / 고객에게 결제금액을 고지용

  } else {
    throw new Error("Invalid Payment Method");
  }

  return amount;
};
