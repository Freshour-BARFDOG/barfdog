
type SubscribeRecipeInfo = {
  selectedRecipeIds: number[],
  allRecipeInfos: {
    id:number,
    kcalPerGram: number,
    name: string
  }[],
  oneDayRecommendKcal: number
};

export const UnitOfDemicalPointOfOneMealGram = 1; // 소수점 1번쨰 까지 (2번째 자리에서 반올림)
export const UnitOfDemicalPointOfOneMealGramInDatabase = 2; // 소수점 1번쨰 까지 (2번째 자리에서 반올림)
export const UnitOfDemicalPointOfOneDayRecommendKcal:number = 1;


/**
 * <p>한 팩 무게 계산식 (API SERVER)</p>
 * => BigDecimal onePackGram = oneDayRecommendKcal.divide(kcalPerGram, 2 , BigDecimal.ROUND_HALF_UP).divide(BigDecimal.valueOf(numberOfMealsPerDay)).setScale(2, BigDecimal.ROUND_HALF_UP);
 */

export const calcOneMealGramsWithRecipeInfo = ({selectedRecipeIds, allRecipeInfos, oneDayRecommendKcal}:SubscribeRecipeInfo) => {
  if ( !Array.isArray( selectedRecipeIds ) ) return [];
  if ( selectedRecipeIds.filter( id => typeof id === 'number' ).length === 0 ) return [];
  if(allRecipeInfos.length === 0) return [];

  return selectedRecipeIds.map( recipeId => {

    const recipe = allRecipeInfos.filter( info => info.id === recipeId )[0];

    const numberOfMealsPerDay:number = 2; // '하루' 식사회수 => 하루 권장칼로리의 기준

    // 한 팩 무게 = 하루권장칼로리 /  무게상수(kcalPerGram) / 하루식사회수 => 소수점 둘 째자리에서 반올림 (웹개발기획서 22년 4월 2주)
    const oneMealGram:number = parseFloat(( oneDayRecommendKcal / recipe.kcalPerGram / numberOfMealsPerDay ).toFixed( UnitOfDemicalPointOfOneMealGram ));

    return {
      oneMealGram: oneMealGram,
      recipeId: recipeId,
      recipeName: recipe.name,
    };
  } );
};


export const calcSubscribeOneDayRecommendKcal = (kcal:number) => {
  return kcal.toFixed(UnitOfDemicalPointOfOneDayRecommendKcal) || 0;  // 하루 권장칼로리: 소수점 둘째자리에서 반올림 (웹개발기획서 22년 4월 2주)
};
