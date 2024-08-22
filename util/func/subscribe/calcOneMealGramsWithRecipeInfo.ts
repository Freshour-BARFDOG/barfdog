import {
  UnitOfDemicalPointOfOneDayRecommendKcalByUI,
  UnitOfDemicalPointOfOneMealGram,
} from '@util/func/subscribe/finalVar';

type SubscribeRecipeInfo = {
  selectedRecipeIds: number[];
  allRecipeInfos: {
    id: number;
    kcalPerGram: number;
    name: string;
  }[];
  oneDayRecommendKcal: number;
  isOriginSubscriber: boolean;
};

/**
 * <p>한 팩 무게 계산식 (API SERVER)</p>
 * => BigDecimal onePackGram = oneDayRecommendKcal.divide(kcalPerGram, 2 , BigDecimal.ROUND_HALF_UP).divide(BigDecimal.valueOf(numberOfMealsPerDay)).setScale(2, BigDecimal.ROUND_HALF_UP);
 */

export const calcOneMealGramsWithRecipeInfo = ({
  selectedRecipeIds,
  allRecipeInfos,
  oneDayRecommendKcal,
  isOriginSubscriber,
}: SubscribeRecipeInfo) => {
  if (!Array.isArray(selectedRecipeIds)) return [];
  if (selectedRecipeIds.filter((id) => typeof id === 'number').length === 0)
    return [];
  if (allRecipeInfos.length === 0) return [];

  return selectedRecipeIds.map((recipeId) => {
    const recipe = allRecipeInfos.filter((info) => info.id === recipeId)[0];

    // console.log('recipe>>>>', recipe);

    const numberOfMealsPerDay: number = 2; // '하루' 식사회수 => 하루 권장칼로리의 기준

    let kcalPerGram = 0;

    //! 기존 구독자일 경우 이전 레시피 사항 적용
    if (isOriginSubscriber) {
      switch (recipe.name) {
        case 'STARTER PREMIUM +':
          kcalPerGram = 1.49462;
          break;
        case 'TURKEY&BEEF +':
          kcalPerGram = 1.46324;
          break;
        case 'DUCK&LAMB +':
          kcalPerGram = 1.47532;
          break;
        case 'LAMB&BEEF +':
          kcalPerGram = 1.55097;
          break;
        default:
          kcalPerGram = recipe.kcalPerGram;
      }
    } else {
      kcalPerGram = recipe?.kcalPerGram;
    }
    // console.log('isOriginSubscriber', isOriginSubscriber);
    // console.log('kcalPerGram 변경 전>>>', recipe.kcalPerGram);
    // console.log('kcalPerGram 변경 후>>>', recipe.name, kcalPerGram);

    // 한 팩 무게 = 하루권장칼로리 /  무게상수(kcalPerGram) / 하루식사회수 => 소수점 둘 째자리에서 반올림 (웹개발기획서 22년 4월 2주)
    const oneMealGram: number = parseFloat(
      (oneDayRecommendKcal / kcalPerGram / numberOfMealsPerDay).toFixed(
        UnitOfDemicalPointOfOneMealGram,
      ),
    );

    // console.log(
    //   '******',
    //   oneDayRecommendKcal,
    //   kcalPerGram,
    //   numberOfMealsPerDay,
    //   oneMealGram,
    // );
    // console.log('******', recipe, kcalPerGram);

    return {
      oneMealGram: oneMealGram,
      recipeId: recipeId,
      recipeName: recipe?.name,
    };
  });
};

export const calcSubscribeOneDayRecommendKcal = (kcal: number) => {
  return kcal.toFixed(UnitOfDemicalPointOfOneDayRecommendKcalByUI) || 0; // 하루 권장칼로리: 소수점 둘째자리에서 반올림 (웹개발기획서 22년 4월 2주)
};
