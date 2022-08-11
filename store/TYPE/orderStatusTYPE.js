export const orderStatus = {
  ALL: 'ALL', // * 배송상태 미포함 (검색결과 조회 시에 사용)
  HOLD: 'HOLD',
  BEFORE_PAYMENT: 'BEFORE_PAYMENT',
  PAYMENT_DONE: 'PAYMENT_DONE',
  PRUDUCING: 'PRUDUCING', // 구독상품 (상품 준비중)
  DELIVERY_READY: 'DELIVERY_READY', // 일반상품 (상품 준비 중)
  DELIVERY_START: 'DELIVERY_START',
  DELIVERY_DONE: 'DELIVERY_DONE',
  SELLING_CANCLE: 'SELLING_CANCLE',
  CANCEL_REQUEST: 'CANCEL_REQUEST',
  CANCEL_DONE_SELLER: 'CANCEL_DONE_SELLER',
  CANCEL_DONE_BUYER: 'CANCEL_DONE_BUYER',
  RETURN_REQUEST: 'RETURN_REQUEST',
  RETURN_DONE_SELLER: 'RETURN_DONE_SELLER',
  RETURN_DONE_BUYER: 'RETURN_DONE_BUYER',
  EXCHANGE_REQUEST: 'EXCHANGE_REQUEST',
  EXCHANGE_DONE_SELLER: 'EXCHANGE_DONE_SELLER',
  EXCHANGE_DONE_BUYER: 'EXCHANGE_DONE_BUYER',
  FAILED: 'FAILED',
  CONFIRM: 'CONFIRM',
  KOR: {
    ALL: '전체', // * 배송상태 미포함 (검색결과 조회 시에 사용)
    BEFORE_PAYMENT: '결제 전',
    HOLD: '구독 보류',
    PAYMENT_DONE: '결제 완료',
    PRUDUCING: '생산 중', // 구독 상품
    DELIVERY_READY: '배송 준비 중', // 일반상품
    DELIVERY_START: '배송 시작',
    DELIVERY_DONE: '배송 완료',
    SELLING_CANCLE: '판매 취소',
    CANCEL_REQUEST: '취소 요청',
    CANCEL_DONE_SELLER: '취소 완료 (판매자 귀책)',
    CANCEL_DONE_BUYER: '취소 완료 (구매자 귀책)',
    RETURN_REQUEST: '반품 요청',
    RETURN_DONE_SELLER: '반품 완료(판매자 귀책)',
    RETURN_DONE_BUYER: '반품 완료 (구매자 귀책)',
    EXCHANGE_REQUEST: '교환 요청',
    EXCHANGE_DONE_SELLER: '교환 완료 (판매자 귀책)',
    EXCHANGE_DONE_BUYER: '교환 완료 (구매자 귀책)',
    FAILED: '실패함', // 고객이 결제 실패했을 때
    CONFIRM: '구매 확정',
  },
};


export const availableCancelStatus = (status)=>{
  let valid;
  const availableCancleStateList = [orderStatus.BEFORE_PAYMENT, orderStatus.PAYMENT_DONE, orderStatus.PRUDUCING ,orderStatus.DELIVERY_READY];
  valid = availableCancleStateList.indexOf(status) >= 0;
  return valid;
  
}


/* - 구매확정
<구독상품>
1. 정기결제 상품 > 배송완료 직후

<일반상품>
1. 유저: 배송완료 7일 이내에 구매확정한 경우
2. 자동구매확정처리: 배송완료 후 7일 이후 (8일차)*/
