import transformClearLocalCurrency from './transformClearLocalCurrency';
import transformLocalCurrency from './transformLocalCurrency';

const calculateSalePrice = (originPrice, discountType, discountDegree) => {
  if (!originPrice) return;

  let salePrice;
  const originalPrice = transformClearLocalCurrency(originPrice);
  const degree = transformClearLocalCurrency(discountDegree) || 0;

  let saleAmount =
    discountType === 'FLAT_RATE' ? Math.round(originalPrice * (degree / 100)) : degree;
  const calculatedPrice = originalPrice - saleAmount;

  if (discountType === 'FLAT_RATE') {
    salePrice = !degree ? originalPrice : calculatedPrice;
  } else {
    salePrice = calculatedPrice;
  }

  const trasformPriceObj = {
    salePrice: transformLocalCurrency(salePrice),
    saleAmount: transformLocalCurrency(saleAmount),
  };

  return trasformPriceObj;
};

export default calculateSalePrice;