export default function transformLocalCurrency(number) {
  const currency = Number(number).toLocaleString(navigator.language);
  return currency;
}