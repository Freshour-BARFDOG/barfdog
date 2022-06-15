export default function filter_limitedNumber(value, limitNumber) {
  let number = Number(value);
  number = number >= limitNumber ? 0 : number;
  return number;
}