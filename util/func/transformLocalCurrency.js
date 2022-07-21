export default function transformLocalCurrency(number) {
  const currency = Number(number).toLocaleString('ko-KR');
  return currency;
}