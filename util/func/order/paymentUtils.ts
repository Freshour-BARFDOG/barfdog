export const isAbandonedPayment = (errorMessage:string) => {
  const portoneCancelPaymentMessage: string = "결제를 취소하였습니다.";
  return errorMessage === portoneCancelPaymentMessage || errorMessage?.includes('결제포기') || errorMessage?.includes('취소');
}
