import {useEffect, useState} from 'react';
import {getData} from '/src/pages/api/reqData';
import {itemExposureType} from '/store/TYPE/itemExposureType';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import {useSubscribePlanInfo} from "./useSubscribePlanInfo";


export const useSubscribeInfo = (subscribeId) => {
  const [info, setInfo] = useState( null );
  const subscribePlanInfo = useSubscribePlanInfo();
  
  useEffect( () => {
    // admin > setting > 가격 정책 > 플랜별 레시피 정보를 받지 못했을 경우, 실행하지 않음.
    if(!subscribePlanInfo.planDiscountPercent.FULL) return;
    
    if ( info ) return;
    
    (async () => {
      try {
        const url = `/api/subscribes/${subscribeId}`;
        let res = await getData( url );
        // console.log('useSubscribeInfo: ',res)
        if ( res.status === 404 ) {
          alert( '구독정보를 불러오는데 실패했습니다.' );
          // res = DUMMY_RESPONSE(subscribeId);
        }
        const data = res.data;
        if (!data) return;
        const curRecipeIdList = data.subscribeRecipeDtoList.map((list) => list.recipeId);

        const getAllRecipeInfoUrl = '/api/recipes';
        const recipe_res = await getData(getAllRecipeInfoUrl);
        if(!recipe_res.data) return;
        const allRecipes = recipe_res.data._embedded.recipeListResponseDtoList;
        const memberRecipes = allRecipes.filter(
          (recipe) => curRecipeIdList.indexOf(recipe.id) >= 0,
        );

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
          !!memberRecipes.filter( (list) => list.leaked === itemExposureType.HIDDEN ).length ||
          !!memberRecipes.filter( (list) => list.inStock === false ).length;
        // 구독 가격 계산
        const planName = data.subscribeDto.plan;
        const oneMealRecommendGram = data.subscribeDto.oneMealRecommendGram;
        const discountPercent = subscribePlanInfo.planDiscountPercent[planName];
        const pricePerGrams = memberRecipes.map( recipe => recipe.pricePerGram );
       
        
        const allPlanNameList = Object.keys( subscribePlanType );
        const allPriceList = allPlanNameList.map( planName =>
          ({[planName]: calcSubscribePrice( {
            discountPercent,
            oneMealRecommendGram,
            planName,
            pricePerGrams
          })
        }));
        
        let allPriceObj = {};
        for (const obj of allPriceList) {
          const key = Object.keys(obj)[0];
          const val = Object.values(obj)[0];
          allPriceObj[key] = val;
        }
        
        // console.log(data)
        const DATA = {
          // 구독 기본 정보 + 구독정보의 Dashboard
          info: {
            subscribeId: Number(subscribeId)  === data.subscribeDto.id ? Number(subscribeId) : null, // validation 요청한 페이지의 구독id와 server에서 받은 값을 대조
            dogId: data.subscribeDto.dogId,
            dogName: data.subscribeDto.dogName,
            subscribeCount: data.subscribeDto.subscribeCount,
            nextPaymentDate: data.subscribeDto.nextPaymentDate,
            nextPaymentPrice: data.subscribeDto.nextPaymentPrice,
            nextDeliveryDate: data.subscribeDto.nextDeliveryDate,
            usingMemberCouponId: data.subscribeDto.usingMemberCouponId, // 사용한 보유쿠폰 id,
            usedCoupon:{
              usingMemberCouponId: data.subscribeDto.usingMemberCouponId, // 사용된 쿠폰 id
              couponName: data.subscribeDto.couponName, // 쿠폰명
              discountCoupon: data.subscribeDto.discountCoupon, // 쿠폰 할인금액
            },
            countSkipOneTime: data.subscribeDto.countSkipOneTime,
            countSkipOneWeek: data.subscribeDto.countSkipOneWeek,
            couponName: data.subscribeDto.couponName,
            discountCoupon: data.subscribeDto.discountCoupon,
            discountGrade: data.subscribeDto.discountGrade,
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
            discountPercent: discountPercent,
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
  }, [subscribePlanInfo.isLoading] );
  
  
  return info;
};




export const subscribePriceCutOffUnit = 10; // 구독상품 > 10원 단위 절사.

export const calcSubscribePrice = ({discountPercent=0, oneMealRecommendGram=0, planName="", pricePerGrams= []}) => {
  const totalNumberOfPacks = subscribePlanType[planName].totalNumberOfPacks;
  const calcPriceList = pricePerGrams.map( pricePerGram => {
    return calcSubscribeItemPrice( {
        plan: {totalNumberOfPacks, discountPercent},
        recipe: {pricePerGram, oneMealRecommendGram}
      }
    );
  } );
  return calcSubscribeItemsAvgPrice( calcPriceList );
}

export const calcSubscribeItemPrice = ({
                               plan = {totalNumberOfPacks: 0, discountPercent: 0},
                               recipe = {pricePerGram: 0, oneMealRecommendGram: 0}
                             }) => {
  const recipePricePerGram = recipe.pricePerGram; // 1g 당 가격 상수 ( 어드민에서 입력한 값 )
  const recipeOneMealGram = recipe.oneMealRecommendGram; // 한 팩(한 끼) 무게
  const perPack = Number( (recipePricePerGram * recipeOneMealGram) );
  const totalNumberOfPacks = plan.totalNumberOfPacks;
  const discountPercent = plan.discountPercent;
  return {
    perPack: perPack, // 팩당가격상수 * 무게
    originPrice: totalNumberOfPacks * perPack, // 할인 전 가격
    salePrice: totalNumberOfPacks * perPack * (1 - discountPercent / 100), // 할인 후 가격 (판매가)
  };
};

export const calcSubscribeItemsAvgPrice= (subscribePriceList) => {
  if(!subscribePriceList.length) return console.error('ERROR: Required Array to calculate Average Subscribe Prices');
  let perPack = subscribePriceList.map((r) => r.perPack).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  let originPrice =
    subscribePriceList.map((r) => r.originPrice).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  let salePrice = subscribePriceList.map((r) => r.salePrice).reduce((acc, cur) => acc + cur) / subscribePriceList.length;
  const cutOffUnit = subscribePriceCutOffUnit; // ! '10'원단위로 절사 (= 1원단위 버림)
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
