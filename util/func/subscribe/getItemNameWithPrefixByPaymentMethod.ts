import {paymentMethodType} from "@store/TYPE/paymentMethodType";

interface PropsInterface {
  paymentMethod: string;
  itemName: string;
  prefix: string;
}



export const getItemNameWithPrefixByPaymentMethod = ({paymentMethod, itemName, prefix}: PropsInterface) => {
  let name;
  if (paymentMethod === paymentMethodType.CREDIT_CARD) {
    name = `${prefix} ${itemName}`;

  } else if (paymentMethod === paymentMethodType.KAKAO_PAY) {
    name = `${prefix} ${itemName}`;

  } else if (paymentMethod === paymentMethodType.NAVER_PAY) {
    name = itemName; // 네이버페이: 상품명 그대로 사용

  } else {
    throw new Error("Invalid Payment Method");
  }

  return name;
};
