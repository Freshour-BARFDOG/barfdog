
type SubscribeRecipeInfo = {
  selectedRecipeIds: number[],
  allRecipeInfos: {
    id:number,
    kcalPerGram: number,
    name: string
  }[],
  oneDayRecommendKcal: number
};

export const ONEMEALGRAM_DEMICAL = 1; // 소수점 1번쨰 까지 (2번째 자리에서 반올림)
export const ONEMEALGRAM_DEMICAL_IN_DB = 2; // 소수점 1번쨰 까지 (2번째 자리에서 반올림)


export const calcOneMealGramsWithRecipeInfo = ({selectedRecipeIds, allRecipeInfos, oneDayRecommendKcal}:SubscribeRecipeInfo) => {
  if ( !Array.isArray( selectedRecipeIds ) ) return [];
  if ( selectedRecipeIds.filter( id => typeof id === 'number' ).length === 0 ) return [];
  if(allRecipeInfos.length === 0) return [];

  return selectedRecipeIds.map( recipeId => {

    const recipe = allRecipeInfos.filter( info => info.id === recipeId )[0];

    const packCountOfOneDayRecommendKcal:number = 2; // '하루' 식사회수 => 하루 권장칼로리의 기준

    // 한 팩 무게 = 하루권장칼로리 /  무게상수(kcalPerGram) / 하루식사회수 => 소수점 둘 째자리에서 반올림 (웹개발기획서 22년 4월 2주)
    const oneMealGram:number = parseFloat(( oneDayRecommendKcal / recipe.kcalPerGram ).toFixed( ONEMEALGRAM_DEMICAL )) / packCountOfOneDayRecommendKcal;
    // CF) API SERVER 계산식 => BigDecimal onePackGram = oneDayRecommendKcal.divide(KcalPerGram, 1 , BigDecimal.ROUND_HALF_UP).divide(BigDecimal.valueOf(standardPackCountOfOneDayRecommendKcal));
    // console.log( "oneDayRecommendKcal: ", oneDayRecommendKcal, "\nkcalPerGram: ", recipe.kcalPerGram, "\noneMealGram", oneMealGram );
    return {
      oneMealGram: oneMealGram, //  바프독 기존 워드프레스 사이트 > 1자리 수 사용
      recipeId: recipeId,
      recipeName: recipe.name,
    };
  } );
};



export const calcSubscribeOneDayRecommendKcal = (kcal:number) => {
  return kcal.toFixed(1) || 0;  // 하루 권장칼로리: 소수점 둘째자리에서 반올림 (웹개발기획서 22년 4월 2주)
};
