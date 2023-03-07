import {useEffect, useState} from 'react';
import {getData} from '/src/pages/api/reqData';
import {itemExposureType} from '/store/TYPE/itemExposureType';
import {subscribePlanType} from '/store/TYPE/subscribePlanType';
import {useSubscribePlanInfo} from "./useSubscribePlanInfo";
import {seperateStringViaComma} from "../func/seperateStringViaComma";
import {useSubscribeRecipeInfo} from "./useSubscribeRecipeInfo";
import {calcSubscribePrice} from "../func/subscribe/calcSubscribePrices";
import {ONEMEALGRAM_DEMICAL} from "../func/subscribe/calcOneMealGramsWithRecipeInfo";


export const useSubscribeInfo = (subscribeId) => {
  const [info, setInfo] = useState( null );
  const subscribePlanInfo = useSubscribePlanInfo();
  const recipeInfo = useSubscribeRecipeInfo();
  
  useEffect( () => {
    // admin > setting > 가격 정책 > 플랜별 레시피 정보를 받지 못했을 경우, 실행하지 않음.
    // console.log("info: ",info);
    if ( info ) return;
    
    (async () => {
      try {
        const subscribeApiurl = `/api/subscribes/${subscribeId}`;
        let res = await getData( subscribeApiurl );
        // console.log('useSubscribeInfo: ',res)
        if ( res.status === 404 ) {
          alert( '구독정보를 불러오는데 실패했습니다.' );
          // res = DUMMY_RESPONSE(subscribeId);
        }
        const data = res.data;
        if (!data) return;
        const curRecipeIdList = data.subscribeRecipeDtoList.map((list) => list.recipeId);

        const recipeApiUrl = '/api/recipes';
        const recipe_res = await getData(recipeApiUrl);
        if(!recipe_res.data) return;
        const currentRecipes = recipeInfo.data.filter(
          (recipe) => curRecipeIdList.indexOf(recipe.id) >= 0,
        );

        // 중복된 레시피 성분 제거
        const memberIngredientsOrigin = currentRecipes
          .map((recipe) => recipe.ingredients)
          .join(',')
          .split(',');
        const memberIngredients = memberIngredientsOrigin
          .filter((ingr, index) => memberIngredientsOrigin.indexOf(ingr) === index)
          .join(', ');
        // 1.  레시피 중, 숨김상태(HIDDEN)의 상품이 있는가
        // 2. 레시피 중, 재고없음( inStock = false)인 상품이 있는가
        const isSoldOut =
          !!currentRecipes.filter( (list) => list.leaked === itemExposureType.HIDDEN ).length ||
          !!currentRecipes.filter( (list) => list.inStock === false ).length;
        // 구독 가격 계산
        const currentPlanName = data.subscribeDto.plan;
        const oneMealGrams = seperateStringViaComma(data.subscribeDto.oneMealGramsPerRecipe)?.
                map(oneMealGramString=>Number(parseFloat(oneMealGramString).toFixed(ONEMEALGRAM_DEMICAL))) || [];
        const pricePerGrams = currentRecipes.map( recipe => recipe.pricePerGram );
  
        // console.log(oneMealGrams);
        // console.log("currentRecipes: ", currentRecipes);
        // console.log("pricePerGrams: ", pricePerGrams);
        
        const discountPercent = subscribePlanInfo.planDiscountPercent[currentPlanName];
        const allPlanNameList = Object.keys( subscribePlanType );
        const allPriceList = allPlanNameList.map( (planName) =>
          ({[planName]: calcSubscribePrice( {
            discountPercent: subscribePlanInfo.planDiscountPercent[planName],
            oneMealGrams,
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
            overDiscount: data.subscribeDto.overDiscount,
            planName: currentPlanName,
            recipeNames: data.subscribeRecipeDtoList.map((list) => list.recipeName).join(', '),
            oneMealGramsPerRecipe: oneMealGrams,
          },
          // 레시피 정보
          recipe: {
            idList: curRecipeIdList,
            nameList: data.subscribeRecipeDtoList.map((list) => list.recipeName),
            ingredients: memberIngredients,
            pricePerGram : currentRecipes.map(list=>list.pricePerGram),
            inStockInfoList: currentRecipes.map((list) => ({ [list.name]: list.inStock })),
            leakedInfoList: currentRecipes.map((list) => ({ [list.name]: list.leaked })),
            soldOut: isSoldOut, // 재고소진여부 -> 재고소진 시, 사이트 전역에서, 유저에게 알림메시지
            allRecipeIdList: recipeInfo.data.map(recipe=>recipe.id)
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
  }, [subscribePlanInfo.isLoading, recipeInfo.loading] );
  
  
  return info;
};
