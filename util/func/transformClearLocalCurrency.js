


export default function transformClearLocalCurrency(numberStr) {
  if(!numberStr)return ;

  const number = Number(numberStr.replace(/,/gi, ''));
  return number;
}