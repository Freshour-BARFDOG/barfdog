import { useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import { itemExposureType } from '/store/TYPE/itemExposureType';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';

export const useSubscribeInfo = (subscribeId) => {
  const [info, setInfo] = useState(null);
  useEffect(() => {
    if(info) return;
    (async () => {
      try {
        const url = `/api/subscribes/${subscribeId}`;
        let res = await getData(url);
        console.log(res)
        /// ! TEST TEST TEST TEST TEST
        if(res.status === 404 ) {
          res = DUMMY_RESPONSE(subscribeId);
        }
        /// ! TEST TEST TEST TEST TEST
        const data = res.data;
        if (!data) return;
        const curRecipeIdList = data.subscribeRecipeDtoList.map((list) => list.recipeId);

        const getAllRecipeInfoUrl = 'api/recipes';
        const recipe_res = await getData(getAllRecipeInfoUrl);
        if(!recipe_res.data) return;
        const allRecipes = recipe_res.data._embedded.recipeListResponseDtoList;
        const memberRecipes = allRecipes.filter(
          (recipe) => curRecipeIdList.indexOf(recipe.id) >= 0,
        );
  
        // //////// ! TEST : 2번째 상품 강제 품절처리 테스트
        // const testRecipes = allRecipes.filter(
        //   (recipe) => curRecipeIdList.indexOf(recipe.id) >= 0,
        // );
        //
        // const memberRecipes = testRecipes.map((rc,index)=>({
        //   ...rc,
        //   inStock: false,
        // }))
        // console.log(memberRecipes)
        // //////// ! TEST : 2번째 상품 강제 품절처리 테스트

        // 중복된 레시피 성분 제거
        const memberIngredientsOrigin = memberRecipes
          .map((recipe) => recipe.ingredients)
          .join(',')
          .split(',');
        const memberIngredients = memberIngredientsOrigin
          .filter((ingr, index) => memberIngredientsOrigin.indexOf(ingr) === index)
          .join(', ');
        // 1.  레시피 중, 숨김상태(HIDDEN)의 상품이 있는가
        // 2. 레시피 중, 재고없음( inStock = false)인 상품이 있는가
        const isSoldOut =
          !!memberRecipes.filter((list) => list.leaked === itemExposureType.HIDDEN).length ||
          !!memberRecipes.filter((list) => list.inStock === false).length;

        // 구독 가격 계산
        const planName = data.subscribeDto.plan;
        const oneMealRecommendGram = data.subscribeDto.oneMealRecommendGram;
        
        
        const calcEveryPlanPrice = (plan)=>{
          const calcPriceList = memberRecipes.map(recipe => {
            const pricePerGram = recipe.pricePerGram;
            return calcSubscribePrices(plan, {pricePerGram: pricePerGram, oneMealGram: oneMealRecommendGram });
          });
          return calcAvgSubscribePrices(calcPriceList);
        }
  
        const allPlanNameList = Object.keys(subscribePlanType);
        const allPriceList = allPlanNameList.map(planName=>({[planName]: calcEveryPlanPrice(planName)}));
        let allPriceObj= {};
        for (const obj of allPriceList) {
          const key = Object.keys(obj)[0];
          const val = Object.values(obj)[0];
          allPriceObj[key] = val;
        }
        
        // console.log(data)
        const DATA = {
          // 구독 기본 정보 + 구독정보의 Dashboard
          info: {
            subscribeId: subscribeId  === data.subscribeDto.id ? subscribeId : null, // validation 요청한 페이지의 구독id와 server에서 받은 값을 대조
            dogId: '',
            dogName: data.subscribeDto.dogName,
            subscribeCount: data.subscribeDto.subscribeCount,
            nextPaymentDate: data.subscribeDto.nextPaymentDate,
            nextPaymentPrice: data.subscribeDto.nextPaymentPrice,
            nextDeliveryDate: data.subscribeDto.nextDeliveryDate,
            usingMemberCouponId: data.subscribeDto.usingMemberCouponId, // 사용한 보유쿠폰 id,
            couponName: data.subscribeDto.couponName,
            discount: data.subscribeDto.discount,
            planName: planName,
            recipeNames: data.subscribeRecipeDtoList.map((list) => list.recipeName).join(', '),
            oneMealRecommendGram: oneMealRecommendGram,
          },
          // 레시피 정보
          recipe: {
            idList: curRecipeIdList,
            nameList: data.subscribeRecipeDtoList.map((list) => list.recipeName),
            ingredients: memberIngredients,
            pricePerGram : memberRecipes.map(list=>list.pricePerGram),
            inStockInfoList: memberRecipes.map((list) => ({ [list.name]: list.inStock })),
            leakedInfoList: memberRecipes.map((list) => ({ [list.name]: list.leaked })),
            soldOut: isSoldOut, // 재고소진여부 -> 재고소진 시, 사이트 전역에서, 유저에게 알림메시지
            allRecipeIdList: allRecipes.map(recipe=>recipe.id)
          },
          plan: {
            name: data.subscribeDto.plan,
            numberOfPacksPerDay: subscribePlanType[data.subscribeDto.plan].numberOfPacksPerDay,
            totalNumberOfPacks: subscribePlanType[data.subscribeDto.plan].totalNumberOfPacks,
            weeklyPaymentCycle: subscribePlanType[data.subscribeDto.plan].weeklyPaymentCycle,
            discountPercent: subscribePlanType[data.subscribeDto.plan].discountPercent,
          },
          price: allPriceObj,
          // 멤버가 보유힌 쿠폰 정보
          coupon: data.memberCouponDtoList.map((coupon) => ({
            memberCouponId: coupon.memberCouponId,
            name: coupon.name,
            discountType: coupon.discountType,
            discountDegree: coupon.discountDegree,
            availableMaxDiscount: coupon.availableMaxDiscount,
            availableMinPrice: coupon.availableMinPrice,
            remaining: coupon.remaining,
            expiredDate: coupon.expiredDate,
          })),
          // 배송정보 => 추가 필요여부에 따라서, 추후 수정
          delivery: {},
        };
        
        setInfo(DATA);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);
  
  
  return info;
};



const calcSubscribePrices = (planType, recipe={pricePerGram: 0, oneMealGram: 0}) => {
  const recipePricePerGram = recipe.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
  const recipeOneMealGram= recipe.oneMealGram; // 한 팩(한 끼) 무게
  const perPack = Number((recipePricePerGram * recipeOneMealGram));
  const totalNumberOfPacks = subscribePlanType[planType].totalNumberOfPacks;
  const discountPercent = subscribePlanType[planType].discountPercent;
  return {
    perPack: perPack, // 팩당가격상수 * 무게
    originPrice: totalNumberOfPacks * perPack, // 할인 전 가격
    salePrice: totalNumberOfPacks * perPack * (1 - discountPercent / 100), // 할인 후 가격 (판매가)
  };
};


const calcAvgSubscribePrices= (subscribePriceList) => {
  if(!subscribePriceList.length) return console.error('ERROR: Required Array to calculate Average Subscribe Prices');
  let perPack = subscribePriceList.map((r) => r.perPack).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  let originPrice =
    subscribePriceList.map((r) => r.originPrice).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  let salePrice = subscribePriceList.map((r) => r.salePrice).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  const cutOffUnit = 10; // ! '10'원단위로 절사 (= 1원단위 버림)
  perPack = Math.floor(perPack);
  originPrice = Math.floor(originPrice / cutOffUnit) * cutOffUnit;
  salePrice = Math.floor(salePrice / cutOffUnit) * cutOffUnit;
  
  // ! 참고) 만약 고객 측에서 UI상의 salePrice 결과가 몇 원 차이나는 것에 대해 문의할 경우,
  //  => (숨김 처리한) 팩당 가격을 소수점 이하까지 계산해보면, 10원 단위로 절사한 가격임을 알 수 있음.
  return {
    perPack,  // ! 팩당가격 : 소수점 이하 버림
    originPrice,  // ! 원가:  1원 단위 절사
    salePrice,  // ! 판매가: 1원 단위 절사
  };
}


export const calcSubscribePrice = (planType, pricePerGramList, oneMealGram ) => {
  const calcPriceList = pricePerGramList.map((pricePerGram) => {
    return calcSubscribePrices(planType, { pricePerGram, oneMealGram });
  });
  return calcAvgSubscribePrices(calcPriceList);
};


///////
let DUMMY_RESPONSE = ( subscribeId) => ({
  data: {
    subscribeDto: {
      id: subscribeId,
      dogName: '김바프',
      subscribeCount: 3,
      plan: 'FULL',
      oneMealRecommendGram: 101.0,
      nextPaymentDate: '2022-07-28T09:56:38.693',
      nextPaymentPrice: 120000,
      nextDeliveryDate: '2022-07-30',
      usingMemberCouponId: 3104,
      couponName: '관리자 직접 발행 쿠폰2',
      discount: 3000,
    },
    subscribeRecipeDtoList: [
      {
        recipeId: 13,
        recipeName: '스타트',
      },
      {
        recipeId: 14,
        recipeName: '터키비프',
      },
    ],
    memberCouponDtoList: [
      {
        memberCouponId: 49,
        name: '관리자 직접 발행 쿠폰1',
        discountType: 'FIXED_RATE',
        discountDegree: 10,
        availableMaxDiscount: 100000,
        availableMinPrice: 5000,
        remaining: 3,
        expiredDate: '2022-07-25T09:56:38.693',
      },
      {
        memberCouponId: 3200,
        name: '관리자 직접 발행 쿠폰2',
        discountType: 'FIXED_RATE',
        discountDegree: 20,
        availableMaxDiscount: 70000,
        availableMinPrice: 50000,
        remaining: 3,
        expiredDate: '2022-08-25T09:56:38.693',
      },
      {
        memberCouponId: 3104,
        name: '쿠폰3',
        discountType: 'FLAT_RATE',
        discountDegree: 5000,
        availableMaxDiscount: 1000000,
        availableMinPrice: 5000,
        remaining: 3,
        expiredDate: '2022-09-25T09:56:38.693',
      },
    ],
    recipeDtoList: [
      {
        id: 13,
        name: '스타트',
        description: '레시피 설명',
        pricePerGram: 48.234,
        gramPerKcal: 1.23456,
        inStock: false,
        imgUrl: 'http://localhost:8080/display/recipes?filename=스타트2.jpg',
      },
      {
        id: 14,
        name: '터키비프',
        description: '레시피 설명',
        pricePerGram: 48.234,
        gramPerKcal: 1.23456,
        inStock: false,
        imgUrl: 'http://localhost:8080/display/recipes?filename=터키비프2.jpg',
      },
      {
        id: 15,
        name: '덕램',
        description: '레시피 설명',
        pricePerGram: 48.234,
        gramPerKcal: 1.23456,
        inStock: true,
        imgUrl: 'http://localhost:8080/display/recipes?filename=덕램2.jpg',
      },
      {
        id: 16,
        name: '램비프',
        description: '레시피 설명',
        pricePerGram: 48.234,
        gramPerKcal: 1.23456,
        inStock: true,
        imgUrl: 'http://localhost:8080/display/recipes?filename=램비프2.jpg',
      },
    ],
    _links: {
      self: {
        href: 'http://localhost:8080/api/subscribes/3106',
      },
      profile: {
        href: '/docs/index.html#resources-query-subscribe',
      },
    },
  },
});
