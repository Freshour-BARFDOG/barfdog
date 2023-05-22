import {UnitOfDemicalPointOfOneMealGram} from "@util/func/subscribe/calcOneMealGramsWithRecipeInfo";
import transformLocalCurrency from "@util/func/transformLocalCurrency";


// 한 팩 무게 = 하루권장칼로리 /  무게상수(kcalPerGram) / 하루식사회수 => 소수점 둘 째자리에서 반올림 (웹개발기획서 22년 4월 2주)
export const roundedOneMealGram = (gram:number) => {
  if(!gram) return;
  if(typeof gram !== 'number'){
    gram = Number(gram);
  }

  return parseFloat(( gram ).toFixed( UnitOfDemicalPointOfOneMealGram ));
  
};
