export const subscribeStatus = {
  BEFORE_PAYMENT: 'BEFORE_PAYMENT',
  SUBSCRIBING: 'SUBSCRIBING',
  SUBSCRIBE_PENDING: 'SUBSCRIBE_PENDING',
  ADMIN: 'ADMIN',
  KOR: {
    BEFORE_PAYMENT: '결제 전',
    SUBSCRIBING: '구독 중',
    SUBSCRIBE_PENDING: '구독 보류', // = 실질적으로 "결제 전" 상태와 동일
    ADMIN: '관리자 구독',
  }
}

export enum subscribeStatusEnum {
  BEFORE_PAYMENT = "BEFORE_PAYMENT",
  SUBSCRIBING = "SUBSCRIBING",
  SUBSCRIBE_PENDING = "SUBSCRIBE_PENDING",
}
