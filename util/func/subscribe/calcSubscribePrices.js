import { subscribePlanType } from '/store/TYPE/subscribePlanType';

export const subscribePriceCutOffUnit = 10; // 구독상품 > 10원 단위 절사.
export const calcSubscribePrice = ({
  discountPercent = 0,
  oneMealGrams = [],
  planName = '',
  pricePerGrams = [],
  isOriginSubscriber,
  recipeNameList = [],
}) => {
  const totalNumberOfPacks = subscribePlanType[planName].totalNumberOfPacks;
  const calcPriceList = pricePerGrams.map((pricePerGram, index) => {
    return calcSubscribeItemPrice({
      plan: { totalNumberOfPacks, discountPercent },
      recipe: { pricePerGram, oneMealGram: oneMealGrams[index] },
      isOriginSubscriber,
      recipeName: recipeNameList[index],
    });
  });
  return calcSubscribeItemsAvgPrice(calcPriceList);
};
export const calcSubscribeItemPrice = ({
  plan = { totalNumberOfPacks: 0, discountPercent: 0 },
  recipe = { pricePerGram: 0, oneMealGram: 0 },
  isOriginSubscriber,
  recipeName,
}) => {
  // console.log('recipe>>>>', recipe);
  // console.log('recipeName:::', recipeName);

  let pricePerGram = 0;

  //! 기존 구독자일 경우 이전 레시피 사항 적용
  if (isOriginSubscriber) {
    switch (recipeName) {
      case 'STARTER PREMIUM +':
        pricePerGram = 35.649;
        break;
      case 'TURKEY&BEEF +':
        pricePerGram = 39.9;
        break;
      case 'DUCK&LAMB +':
        pricePerGram = 40.452;
        break;
      case 'LAMB&BEEF +':
        pricePerGram = 45.414;
        break;
      default:
        pricePerGram = recipe.pricePerGram;
    }
  } else {
    pricePerGram = recipe.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
  }
  // console.log('pricePerGram 변경 전>>>', recipe.pricePerGram);
  // console.log('pricePerGram 변경 후>>>', pricePerGram);
  // console.log('pricePerGram>>>', pricePerGram);

  const perPackPrice = pricePerGram * recipe.oneMealGram;

  const totalNumberOfPacks = plan.totalNumberOfPacks;
  const discountPercent = plan.discountPercent;

  return {
    perPack: perPackPrice, // 한 팩 가격
    originPrice: totalNumberOfPacks * perPackPrice, // 할인 전 가격
    salePrice: totalNumberOfPacks * perPackPrice * (1 - discountPercent / 100), // 할인 후 가격 (판매가)
  };
};

export const calcSubscribeItemsAvgPrice = (subscribePriceList) => {
  if (!subscribePriceList.length)
    return console.error(
      'ERROR: Required Array to calculate Average Subscribe Prices',
    );
  let perPack =
    subscribePriceList.map((r) => r.perPack).reduce((acc, cur) => acc + cur) /
    subscribePriceList.length;
  let originPrice =
    subscribePriceList
      .map((r) => r.originPrice)
      .reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  let salePrice =
    subscribePriceList.map((r) => r.salePrice).reduce((acc, cur) => acc + cur) /
    subscribePriceList.length;
  const cutOffUnit = subscribePriceCutOffUnit; // ! '10'원단위로 절사 (= 1원단위 버림)

  // ! 참고) 만약 고객 측에서 UI상의 salePrice 결과가 몇 원 차이나는 것에 대해 문의할 경우,
  //  => (숨김 처리한) 팩당 가격을 소수점 이하까지 계산해보면, 10원 단위로 절사한 가격임을 알 수 있음.
  return {
    perPack: Math.floor(perPack), // ! 팩당가격 : 소수점 이하 버림 (웹개발기획서 22년 4월 2주) ,
    originPrice: Math.floor(originPrice / cutOffUnit) * cutOffUnit, // ! 원가:  1원 단위 절사
    salePrice: Math.floor(salePrice / cutOffUnit) * cutOffUnit, // ! 판매가: 1원 단위 절사
  };
};
