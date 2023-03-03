import {postObjData} from "../../../src/pages/api/reqData";

export const cancelSubscribeOrder = (orderId) => {
  // ! 목적: 아임포트 결제 창을 띄운 상태에서 '페이지 새로고침' , '페이지 뒤로가기'
  // => BEFORE_PAYMENT로 인한 '적립금, 쿠폰'를 회수할 수 없게는 상태를 방지한다.
  console.log( "---------------- [결제포기 > 정기구독] ----------------" );
  return postObjData( `/api/orders/${orderId}/subscribe/cancel` );
};

export const cancelGeneralOrder = (orderId) => {
  console.log("----orderId: ",orderId);
  // ! 목적: 아임포트 결제 창을 띄운 상태에서 '페이지 새로고침' , '페이지 뒤로가기'
  // => BEFORE_PAYMENT로 인한 '적립금, 쿠폰'를 회수할 수 없게는 상태를 방지한다.
  console.log( "---------------- [결제포기 > 일반결제] ----------------" );
  return postObjData( `/api/orders/${orderId}/general/cancel` );
};
