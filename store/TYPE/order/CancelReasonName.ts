

export enum CancelReasonName {

  cancelNowOfGeneralOrderByBuyer = "[일반결제] 구매자에 의한 결제 취소",
  cancelNowOfGeneralOrderByBuyerAsDetailReason = "주문확인 전, 구매자에 의한 모든 일반상품 즉시 결제취소",

  cancelNowOfSubscribeOrderByBuyer = "[정기결제] 구매자에 의한 결제 취소",
  cancelNowOfSubscribeOrderByBuyerAsDetailReason = "주문확인 전, 구매자에 의한 모든 구독상품 즉시 결제취소",

  cancelNowOfGeneralOrderBySeller = "[일반결제] 관리자에 의한 결제 취소 (관리자 판매 취소)",

  cancelNowOfSubscribeOrderBySeller = "[정기결제] 관리자에 의한 결제 취소 (관리자 판매 취소)",

}
