import { subscribePlanType } from '/store/TYPE/subscribePlanType';

export const subscribePriceCutOffUnit = 10; // 구독상품 > 10원 단위 절사.
export const calcSubscribePrice = ({
  discountPercent = 0,
  oneMealGrams = [],
  planName = '',
  pricePerGrams = [],
  isOriginSubscriber,
  recipeNameList = [],
  toppingPerPackPriceList = [],
}) => {
  const totalNumberOfPacks = subscribePlanType[planName].totalNumberOfPacks;

  const calcPriceList = pricePerGrams.map((pricePerGram, index) => {
    return calcSubscribeItemPrice({
      plan: { totalNumberOfPacks, discountPercent },
      recipe: { pricePerGram, oneMealGram: oneMealGrams[index] },
      isOriginSubscriber,
      recipeName: recipeNameList[index],
      toppingPerPackPriceList: toppingPerPackPriceList[index],
      planName,
    });
  });

  // 전체 평균 가격
  const avgPrice = calcSubscribeItemsAvgPrice(calcPriceList);

  return {
    avgPrice, // 전체 평균 가격
    recipePrices: calcPriceList.map((item) => ({
      recipeName: item.recipeName,
      perPack: item.perPack,
    })), //! [추가] 레시피별 가격
  };
};
export const calcSubscribeItemPrice = ({
  plan = { totalNumberOfPacks: 0, discountPercent: 0 },
  recipe = { pricePerGram: 0, oneMealGram: 0 },
  isOriginSubscriber,
  recipeName,
  toppingPerPackPriceList,
  planName,
}) => {
  // console.log('recipe>>>>', recipe);
  // console.log('recipeName:::', recipeName);
  // console.log('planName___', planName);
  // console.log('toppingPerPackPriceList__', toppingPerPackPriceList);

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
    pricePerGram = recipe?.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
  }
  // console.log('pricePerGram 변경 전>>>', recipe.pricePerGram);
  // console.log('pricePerGram 변경 후>>>', pricePerGram);
  // console.log('pricePerGram>>>', pricePerGram);

  let perPackPrice = 0;

  if (planName.includes('TOPPING')) {
    perPackPrice = toppingPerPackPriceList;
  } else {
    perPackPrice = pricePerGram * recipe.oneMealGram;
  }

  const totalNumberOfPacks = plan.totalNumberOfPacks;
  const discountPercent = plan.discountPercent;

  // console.log('discountPercent!!!', discountPercent);
  // console.log(
  //   totalNumberOfPacks,
  //   perPackPrice,
  //   1 - discountPercent / 100,
  //   perPackPrice * (1 - discountPercent / 100),
  // );

  return {
    perPack: Math.round(perPackPrice * (1 - discountPercent / 100)), // 한 팩 가격
    originPrice: totalNumberOfPacks * perPackPrice, // 할인 전 가격
    salePrice: totalNumberOfPacks * perPackPrice * (1 - discountPercent / 100), // 할인 후 가격 (판매가)
    recipeName,
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

  //! [리뉴얼 사항 240724] '10'원 단위로 절사 => 소수점 이하 버림, 1원 단위로 표기
  return {
    perPack: Math.floor(perPack), // ! 팩당가격 : 소수점 이하 버림 (웹개발기획서 22년 4월 2주) ,
    originPrice: Math.floor(originPrice), // ! 원가: 소수점 이하 버림
    salePrice: Math.floor(salePrice), // ! 판매가: 소수점 이하 버림
  };

  // const cutOffUnit = subscribePriceCutOffUnit; // ! '10'원단위로 절사 (= 1원단위 버림)

  // ! 참고) 만약 고객 측에서 UI상의 salePrice 결과가 몇 원 차이나는 것에 대해 문의할 경우,
  //  => (숨김 처리한) 팩당 가격을 소수점 이하까지 계산해보면, 10원 단위로 절사한 가격임을 알 수 있음.
  // return {
  //   perPack: Math.floor(perPack), // ! 팩당가격 : 소수점 이하 버림 (웹개발기획서 22년 4월 2주) ,
  //   originPrice: Math.floor(originPrice / cutOffUnit) * cutOffUnit, // ! 원가:  1원 단위 절사
  //   salePrice: Math.floor(salePrice / cutOffUnit) * cutOffUnit, // ! 판매가: 1원 단위 절사
  // };
};
