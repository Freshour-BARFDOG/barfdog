import {paymentMethodType} from "../store/TYPE/paymentMethodType";

export const paymethodFilter = function (paymethod) {
    // CREDIT_CARD, NAVER_PAY, KAKAO_PAY
    switch (paymethod) {
      case paymentMethodType.CREDIT_CARD:
        return 'card';
      case paymentMethodType.NAVER_PAY:
        return 'naverpay';
      case paymentMethodType.KAKAO_PAY:
        return 'kakaopay';
            
      default:
        return paymethod;
    }
  }
