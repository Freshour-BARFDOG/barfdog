export const paymethodFilter = function (paymethod) { 
    // CREDIT_CARD, NAVER_PAY, KAKAO_PAY
    switch (paymethod) {
      case 'CREDIT_CARD':
        return 'card';
      case 'NAVER_PAY':
        return 'naverpay';
      case 'KAKAO_PAY':
        return 'kakaopay';
            
      default:
        return paymethod;
    }
  }