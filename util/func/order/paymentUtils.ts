export const isAbandondPayment = (errorMessage:string) => {
  return errorMessage?.includes('결제포기') || errorMessage?.includes('취소');
}
