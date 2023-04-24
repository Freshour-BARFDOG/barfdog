export const paymentMethodType = {
  CREDIT_CARD: 'CREDIT_CARD',
  NAVER_PAY: 'NAVER_PAY',
  KAKAO_PAY: 'KAKAO_PAY',
  KOR: {
    CREDIT_CARD: '신용카드',
    NAVER_PAY: '네이버페이',
    KAKAO_PAY: '카카오페이',
  }
}


/**
 * 포트원 연동가이드
 * - 카카오페이: https://portone.gitbook.io/docs/pg/simple/kakopay
 *            https://guide.portone.io/9ea87d8c-90d2-4657-9421-a05e6f98b04e
 * - 네이버페이: https://portone.gitbook.io/docs/pg/simple/naver
 *            https://guide.portone.io/485c6da8-01d7-4900-bc05-76005e5477ba
 * - 네이버페이 - 일반결제 공식 메뉴얼 (naverProducts 파라미터 참조) https://developer.pay.naver.com/docs/v2/api#etc-etc_product
 * - 네이버페이 - 일반결제 포트원 메뉴얼 https://github.com/iamport/iamport-manual/blob/master/NAVERPAY/sample/naverpay-pg.md
 * - 네이버페이 - 정기결제 포트원 메뉴얼 https://github.com/iamport/iamport-manual/blob/master/NAVERPAY/sample/naverpay-recurring.md
 */

export const pgType ={
  GENERAL:{
    CREDIT_CARD: `kcp.${process.env.NEXT_PUBLIC_IAMPORT_GENERAL_ORDER_SITECODE}`,
    KAKAO_PAY: `kakaopay.${process.env.NEXT_PUBLIC_IAMPORT_GENERAL_EASYPAY_KAKAO_CID}`,
    NAVER_PAY: `naverpay.${process.env.NEXT_PUBLIC_IAMPORT_GENERAL_EASYPAY_NAVER_PID}`,
  },
  SUBSCRIBE:{
    CREDIT_CARD: `kcp_billing.${process.env.NEXT_PUBLIC_IAMPORT_SUBSCRIBE_SITECODE}`,
    KAKAO_PAY: `kakaopay.${process.env.NEXT_PUBLIC_IAMPORT_SUBSCRIBE_EASYPAY_KAKAO_CID}`,
    NAVER_PAY: `naverpay.${process.env.NEXT_PUBLIC_IAMPORT_SUBSCRIBE_EASYPAY_NAVER_PID}`,
    // KAKAO_PAY: 'kakaopay.TCSUBSCRIP', // TEST KEY
  }
}



/**
 * ! 간편결제 연동 > 추가 필요정보
 * * NAVER_PAY
 *   - 일반결제: naverProducts (상품정보: 아래 항목은 모두 필수)
 *       - categoryType: FOOD,
 *       - categoryId: DELIVERY
 *       - uid: 가맹점 상품 코드
 *       - name: 주문 상품명칭 ('외 n개' 제외하기)
 *       - count: 상품 주문 개수
 *       > 공식메뉴얼: https://developer.pay.naver.com/docs/v2/api#etc-etc_product
 *
 *   // - 정기결제 : naverProductCode (반복결제 상품코드 / 중복되지 않도록 생성해야함) -> 서버에 저장해야하는 건지 고민.

 */
