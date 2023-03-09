export default function transformLocalCurrency(number:number) {
  const currency:string = Number(number).toLocaleString('ko-KR');
  return currency;
}
