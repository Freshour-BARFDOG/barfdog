/*
  ! NOTE
  ! deliveryStatus는 orderStatus에 포함됨
  ! 배송API조회를 위해 deliveryStatus를 추후에 분리함
*/

/* 
  - 구매확정 Condition
  <구독상품>
    1. 정기결제 상품 > 배송완료 직후
  <일반상품>
    1. 유저: 배송완료 7일 이내에 구매확정한 경우
    2. 자동구매확정처리: 배송완료 후 7일 이후 (8일차)
*/

export const orderStatus = {
  ALL: 'ALL', // * 배송상태 미포함 (검색결과 조회 시에 사용)
  HOLD: 'HOLD', // 결제 전 & 구독횟수가 1회 이상인 경우
  BEFORE_PAYMENT: 'BEFORE_PAYMENT', // 결제전 & 구독을 한 번도 한 적이 없는 경우
  RESERVED_PAYMENT: 'RESERVED_PAYMENT',
  CANCEL_PAYMENT: 'CANCEL_PAYMENT', // 구독주문서 페이지에서, 결제하지 않고, 결제 취소한 경우
  PAYMENT_DONE: 'PAYMENT_DONE', // 결제완료
  ////////////////////////////////////////////////////
  ////////////////////// 배송상태 //////////////////////
  PRODUCING: 'PRODUCING', // 구독상품 (상품 준비중)
  DELIVERY_READY: 'DELIVERY_READY', // 일반상품 (상품 준비 중)
  DELIVERY_BEFORE_COLLECTION: 'DELIVERY_BEFORE_COLLECTION', // 운송장출력 후 ~ 집하 전 상태 //0921 어드민 운송장 재출력을 위해 추가
  DELIVERY_START: 'DELIVERY_START', // 배송시작
  DELIVERY_DONE: 'DELIVERY_DONE', // 배송완료
  DELIVERY_CANCEL: 'DELIVERY_CANCEL', // 배송취소
  ////////////////////// 배송상태 //////////////////////
  ////////////////////////////////////////////////////
  // SELLING_CANCLE: 'SELLING_CANCLE', // 판매취소: 관리자가 상품을 삭제한 경우 // CANCEL_DONE_BUYER // ! 삭제됨
  CANCEL_REQUEST: 'CANCEL_REQUEST', // 취소요청
  CANCEL_DONE_SELLER: 'CANCEL_DONE_SELLER', // 취소완료 (판매자 귀책)
  CANCEL_DONE_BUYER: 'CANCEL_DONE_BUYER', // 취소완료 (구매자 귀책)
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
    HOLD: '구독 보류',
    BEFORE_PAYMENT: '결제 전',
    RESERVED_PAYMENT: '예약됨',
    CANCEL_PAYMENT: '결제 취소',
    PAYMENT_DONE: '결제 완료',
    ////////////////////////////////////////////////////
    ////////////////////// 배송상태 //////////////////////
    PRODUCING: '생산 중', // 구독 상품
    DELIVERY_READY: '배송 준비 중', // 일반상품
    DELIVERY_BEFORE_COLLECTION: '배송 예정',
    DELIVERY_START: '배송 시작',
    DELIVERY_DONE: '배송 완료',
    DELIVERY_CANCEL: '구독결제 취소',
    ////////////////////// 배송상태 //////////////////////
    ////////////////////////////////////////////////////
    // SELLING_CANCLE: '판매 취소', // ! 삭제됨
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

export const deliveryStatus = {
  PRODUCING: 'PRODUCING', // 구독상품 (상품 준비중)
  DELIVERY_READY: 'DELIVERY_READY', // 일반상품 (상품 준비 중)
  DELIVERY_BEFORE_COLLECTION: 'DELIVERY_BEFORE_COLLECTION', // 운송장출력 후 ~ 집하 전 상태 //0921 어드민 운송장 재출력을 위해 추가
  DELIVERY_START: 'DELIVERY_START', // 배송시작
  DELIVERY_DONE: 'DELIVERY_DONE', // 배송완료
  DELIVERY_CANCEL: 'DELIVERY_CANCEL', // 배송취소
  KOR: {
    PRODUCING: '생산 중', // 구독 상품
    DELIVERY_READY: '배송 준비 중', // 일반상품
    DELIVERY_BEFORE_COLLECTION: '배송 예정',
    DELIVERY_START: '배송 시작',
    DELIVERY_DONE: '배송 완료',
    DELIVERY_CANCEL: '구독결제 취소',
  },
};