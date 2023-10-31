import React from 'react';
import {valid_isEmpty, valid_isEmptyArray} from "./validationPackage";
import {subscribePlanType} from "../../../store/TYPE/subscribePlanType";


export const validate = (obj) => {
  let errors = {};
  
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      case 'plan':
        errors[key] = valid_isEmpty(val);
        break;
      case 'recipeIdList':
        const plan = obj['plan'] ;
        const recipeIdList = val;
        errors[key] = valid_isEmptyArray(val) || valid_subscribePlanAndRecipes(plan, recipeIdList);
        break;
      case 'nextPaymentPrice':
        errors[key] = valid_isEmpty(val);
        break;
      case 'oneDayRecommendKcal':
        errors[key] = valid_isEmpty(val);
        break;
    }
  }
  // console.log('Valid Result (formValues) : ', errors);
  return errors;
};


const valid_subscribePlanAndRecipes = (plan, recipeIdList)=>{
  let error;
  if(plan === subscribePlanType.FULL.NAME){
    if(recipeIdList.length > 2){
      error= '선택 가능한 레시피수 초과입니다.'
    }
  } else if(plan === subscribePlanType.HALF.NAME || plan === subscribePlanType.TOPPING.NAME){
    if(recipeIdList.length > 1){
      error= '선택 가능한 레시피수 초과입니다.'
    }
  }
  return error;
}
