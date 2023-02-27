import transformClearLocalCurrency from './transformClearLocalCurrency';
import transformLocalCurrency from './transformLocalCurrency';
import {discountUnitType} from "/store/TYPE/discountUnitType";


export default function calculateSalePrice (originPrice, discountType, discountDegree) {
  if (!originPrice) return;

  let salePrice;
  const originalPrice = transformClearLocalCurrency(originPrice);
  const degree = transformClearLocalCurrency(discountDegree) || 0;

  let saleAmount =
    discountType === discountUnitType.FIXED_RATE ? Math.round(originalPrice * (degree / 100)) : degree;
  const calculatedPrice = originalPrice - saleAmount;

  if (discountType === discountUnitType.FLAT_RATE) {
    salePrice = !degree ? originalPrice : calculatedPrice;
  } else {
    salePrice = calculatedPrice;
  }

  return {
    salePrice: transformLocalCurrency(salePrice),
    saleAmount: transformLocalCurrency(saleAmount),
  };
};


export const calculateAndConvertToMinimumSalePrice = ({originPrice, discount = {coupon: 0, grade: 0, reward: 0, deliveryPrice:0}}) => {
  const minimumPaymentPrice = 100; // 아임포트 최소 결제 금액
  const coupon = discount.coupon || 0;
  const grade = discount.grade || 0;
  const reward = discount.reward || 0;
  const deliveryPrice = discount.deliveryPrice || 0;
  const calc = originPrice - coupon - grade - reward + deliveryPrice; // 배송비는 더한다.
  const unappliedDiscountAmount = calc < minimumPaymentPrice ? minimumPaymentPrice - calc : 0; // 최소결제금액보다 할인금액이 클 경우, 할인 미적용 금액
  // console.log(coupon, grade, reward, unappliedDiscountAmount);
  return {
    salePrice: calc >= minimumPaymentPrice ? calc : minimumPaymentPrice,
    unappliedDiscountAmount: unappliedDiscountAmount
  };
};
