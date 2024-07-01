import { useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import { itemExposureType } from '/store/TYPE/itemExposureType';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { useSubscribePlanInfo } from './useSubscribePlanInfo';
import { useSubscribeRecipeInfo } from './useSubscribeRecipeInfo';
import { calcSubscribePrice } from '../func/subscribe/calcSubscribePrices';
import { calcOneMealGramsWithRecipeInfo } from '../func/subscribe/calcOneMealGramsWithRecipeInfo';
import { seperateStringViaComma } from '../func/seperateStringViaComma';
import { valid_isTheSameArray } from '../func/validation/validationPackage';
import { originSubscribeIdList } from '/util/func/subscribe/originSubscribeIdList';

export const useSubscribeInfo = (subscribeId) => {
  const [info, setInfo] = useState(null);
  // get Subscribe Info in Admin settings
  const subscribePlanInfo = useSubscribePlanInfo();
  // get Recipe Info in Admin setting
  const recipeInfo = useSubscribeRecipeInfo();

  useEffect(() => {
    // validation: 이미 정보(info) 초기화되었을 경우, 실행하지 않음
    if (info) return;
    // validation: admmin > setting > 가격 정책 > 플랜별 레시피 정보
    if (subscribePlanInfo.isLoading) return;
    // validation:  admin > 상품관리 > 등록된 레시피 정보
    if (!recipeInfo.data) return;

    (async () => {
      try {
        // get SubscribeInfo
        const subscribeApiurl = `/api/subscribes/${subscribeId}`;
        let res = await getData(subscribeApiurl);
        const data = res.data;
        console.log(res);

        //! [추가] 기존 구독자인지 확인
        let isOriginSubscriber = originSubscribeIdList.includes(
          Number(subscribeId),
        );

        // validation: 현재 구독 정보
        if (!data || res.status === 404) {
          return alert('구독정보를 불러오는데 실패했습니다.');
        }

        // 레시피 정보
        const curRecipeIdList = data.subscribeRecipeDtoList.map(
          (list) => list.recipeId,
        );
        const currentRecipes = recipeInfo.data.filter(
          (recipe) => curRecipeIdList.indexOf(recipe.id) >= 0,
        );

        // 중복된 레시피 성분 제거
        const memberIngredientsOrigin = currentRecipes
          .map((recipe) => recipe.ingredients)
          .join(',')
          .split(',');
        const memberIngredients = memberIngredientsOrigin
          .filter(
            (ingr, index) => memberIngredientsOrigin.indexOf(ingr) === index,
          )
          .join(', ');
        // 1.  레시피 중, 숨김상태(HIDDEN)의 상품이 있는가
        // 2. 레시피 중, 재고없음( inStock = false)인 상품이 있는가
        const isSoldOut =
          !!currentRecipes.filter(
            (list) => list.leaked === itemExposureType.HIDDEN,
          ).length ||
          !!currentRecipes.filter((list) => list.inStock === false).length;

        // 구독가격 게산
        const currentPlanName = data.subscribeDto.plan;
        // 구독가격 게산에 필요한 validation
        const discountPercent =
          subscribePlanInfo.planDiscountPercent[currentPlanName];
        if (discountPercent === null) {
          alert(
            '구독 할인정보를 불러오는데 실패했습니다. 잠시 후 다시 시도해주세요.',
          );
          window.location.href = '/mypage/subscribe';
          return;
        }

        const oneMealGramsAfterUserChanges = seperateStringViaComma(
          data.subscribeDto.oneMealGramsPerRecipe,
          'number',
        );
        const oneMealGramsByCalculator = calcOneMealGramsWithRecipeInfo({
          selectedRecipeIds: curRecipeIdList,
          allRecipeInfos: currentRecipes,
          oneDayRecommendKcal: data.subscribeDto.oneDayRecommendKcal,
        }).map((recipe) => recipe.oneMealGram);

        const oneMealGrams = selectOneMealGrams({
          origin: oneMealGramsByCalculator,
          current: oneMealGramsAfterUserChanges,
        });
        const pricePerGrams = currentRecipes.map(
          (recipe) => recipe.pricePerGram,
        );
        const allPlanNames = Object.keys(subscribePlanType);
        const allPriceInfos = allPlanNames.map((planName) => ({
          [planName]: calcSubscribePrice({
            discountPercent: subscribePlanInfo.planDiscountPercent[planName],
            oneMealGrams,
            planName,
            pricePerGrams,
            isOriginSubscriber,
            recipeNameList: currentRecipes.map((recipe) => recipe.name),
          }),
        }));

        const DATA = {
          // 구독 기본 정보 + 구독정보 Dashboard
          info: {
            subscribeId:
              Number(subscribeId) === data.subscribeDto.id
                ? Number(subscribeId)
                : null, // validation 요청한 페이지의 구독id와 server에서 받은 값을 대조
            subscribeStatus: data.subscribeDto.subscribeStatus,
            dogId: data.subscribeDto.dogId,
            dogName: data.subscribeDto.dogName,
            subscribeCount: data.subscribeDto.subscribeCount,
            nextPaymentDate: data.subscribeDto.nextPaymentDate,
            nextPaymentPrice: data.subscribeDto.nextPaymentPrice,
            nextDeliveryDate: data.subscribeDto.nextDeliveryDate,
            usingMemberCouponId: data.subscribeDto.usingMemberCouponId, // 사용한 보유쿠폰 id,
            usedCoupon: {
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
            oneDayRecommendKcal: data.subscribeDto.oneDayRecommendKcal,
            planName: currentPlanName,
            recipeNames: data.subscribeRecipeDtoList
              .map((list) => list.recipeName)
              .join(', '),
            oneMealGramsPerRecipe: oneMealGrams,
          },
          // 선택한 레시피 정보
          recipe: {
            idList: curRecipeIdList,
            nameList: data.subscribeRecipeDtoList.map(
              (list) => list.recipeName,
            ),
            ingredients: memberIngredients,
            pricePerGram: currentRecipes.map((list) => list.pricePerGram),
            inStockInfoList: currentRecipes.map((list) => ({
              [list.name]: list.inStock,
            })),
            leakedInfoList: currentRecipes.map((list) => ({
              [list.name]: list.leaked,
            })),
            soldOut: isSoldOut, // 재고소진여부 -> 재고소진 시, 사이트 전역에서, 유저에게 알림메시지
            allRecipeIdList: recipeInfo.data.map((recipe) => recipe.id),
          },
          // 선택한 플랜 정보
          plan: {
            name: data.subscribeDto.plan,
            numberOfPacksPerDay:
              subscribePlanType[data.subscribeDto.plan]?.numberOfPacksPerDay,
            totalNumberOfPacks:
              subscribePlanType[data.subscribeDto.plan]?.totalNumberOfPacks,
            weeklyPaymentCycle:
              subscribePlanType[data.subscribeDto.plan]?.weeklyPaymentCycle,
            discountPercent: discountPercent,
          },
          price: getAllPriceInfos({ priceInfos: allPriceInfos }),
          // 보유힌 쿠폰 정보
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
  }, [subscribePlanInfo.isLoading, recipeInfo.loading]);

  return info;
};

const getAllPriceInfos = ({ priceInfos }) => {
  let priceInfoMap = {};
  for (const obj of priceInfos) {
    const key = Object.keys(obj)[0];
    const val = Object.values(obj)[0];
    priceInfoMap[key] = val;
  }

  return priceInfoMap;
};

const selectOneMealGrams = ({ origin, current }) => {
  // origin: 기존 계산식을 토대로 도출한 한 팩 무게
  // current: 유저의 구독 무게 변경으로 인한 한 팩 무게
  // console.log("origin === current ? ",origin, current);
  return valid_isTheSameArray(origin, current) ? origin : current;
};
