import {valid_dogBirthYearAndMonth, valid_dogWeight, valid_isEmpty} from "./validationPackage";




// - Validation > 분산 version
export const validate = (obj, targetStep) => {
  let errors;
  // if(typeof targetStepNum !== 'number' || !targetStepNum)return console.error('required pageNum')
  
  if(targetStep === 1){
    errors = validate_surveyStep1(obj);
  } else if(targetStep === 2){
    errors = validate_surveyStep2(obj);
  } else if(targetStep === 3){
    errors = validate_surveyStep3(obj);
  } else {
    errors = validate_surveyAllSteps(obj);
  }
  
  console.log('Valid Result (formValues) : ', errors);
  return errors;
};





const validate_surveyStep1 = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val) ? '이름 ' + valid_isEmpty(val) : '';
        break;
      case 'gender':
        errors[key] = valid_isEmpty(val) ? '성별 ' + valid_isEmpty(val) : '';;
        break;
      case 'birth':
        errors[key] = valid_dogBirthYearAndMonth(val) ? '출생년월 ' +  valid_dogBirthYearAndMonth(val) : '';
        break;
      case 'oldDog': // 노령견 여부 : 유효성 검사 불필요.
        errors[key] = '';
        break;
      case 'dogSize':
        errors[key] = valid_isEmpty(val) ? '체형 ' +  valid_isEmpty(val) : '';
        break;
      case 'dogType':
        errors[key] = valid_isEmpty(val) ? '견종 ' +  valid_isEmpty(val) : '';
        break;
      case 'weight':
        const strVal = typeof val !== 'string' ? val.toString() : val;
        errors[key] = valid_dogWeight(strVal) ? '몸무게 ' +  valid_dogWeight(strVal) : '';
        break;
      case 'neutralization':
        errors[key] = valid_isEmpty(val, {detail:true}) ? '중성화 여부 '+  valid_isEmpty(val, {detail:true}) : '';
        break;
    }
  }
  // console.log('Valid Result > STEP 1 : ', errors);
  return errors;
};





const validate_surveyStep2 = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      case 'activityLevel':
        errors[key] = valid_isEmpty(val) ? '활동량 ' +  valid_isEmpty(val) : '';
        break;
      case 'walkingCountPerWeek':
        errors[key] = valid_isEmpty(val) ? '평균 산책횟수 ' +  valid_isEmpty(val) : '';
        break;
      case 'walkingTimePerOneTime':
        errors[key] = valid_isEmpty(val) ? '1회 당 산책시간 ' +  valid_isEmpty(val) : '';
        break;
      case 'dogStatus':
        errors[key] = valid_isEmpty(val) ? '반려견 상태 ' +  valid_isEmpty(val) : '';
        break;
    }
  }
  
  // console.log('Valid Result > STEP 2 : ', errors);
  return errors;
};




const validate_surveyStep3 = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'snackCountLevel':
        errors[key] = valid_isEmpty(val) ? '간식급여횟수 ' +  valid_isEmpty(val) : '';
        break;
      case 'inedibleFood':
        errors[key] = valid_isEmpty(val) ? '못 먹는 음식 ' +  valid_isEmpty(val) + '\n특정한 음식을 선택해주세요.' : '';
        break;
      case 'inedibleFoodEtc':
        errors[key] = valid_isEmpty(val) ? '못 먹는 음식의 기타 ' +  valid_isEmpty(val) : '';
        break;
      case 'recommendRecipeId':
        errors[key] = valid_isEmpty(val) ? '특별히 챙겨주고 싶은 부분 ' +  valid_isEmpty(val) : '';
        break;
      case 'caution':
        errors[key] = valid_isEmpty(val) ? '기타 특이사항(질병 등) ' +  valid_isEmpty(val) : '';;
        break;
    }
  }
  
  // console.log('Valid Result > STEP 3 : ', errors);
  return errors;
};






//
// - Validation 통합 Version.
const validate_surveyAllSteps = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);
  
  for (const key of keys) {
    const val = obj[key];
    
    switch (key) {
      case 'name':
        errors[key] = valid_isEmpty(val) ? '이름 ' + valid_isEmpty(val) : '';
        break;
      case 'gender':
        errors[key] = valid_isEmpty(val) ? '성별 ' + valid_isEmpty(val) : '';;
        break;
      case 'birth':
        errors[key] = valid_dogBirthYearAndMonth(val) ? '출생년월 ' +  valid_dogBirthYearAndMonth(val) : '';
        break;
      case 'oldDog': // 노령견 여부 : 유효성 검사 불필요.
        errors[key] = '';
        break;
      case 'dogSize':
        errors[key] = valid_isEmpty(val) ? '체형 ' +  valid_isEmpty(val) : '';
        break;
      case 'dogType':
        errors[key] = valid_isEmpty(val) ? '견종 ' +  valid_isEmpty(val) : '';
        break;
      case 'weight':
        const strVal = typeof val !== 'string' ? val.toString() : val;
        errors[key] = valid_dogWeight(strVal) ? '몸무게 ' +  valid_dogWeight(strVal) : '';
        break;
      case 'neutralization':
        errors[key] = valid_isEmpty(val, {detail:true}) ? '중성화 여부 '+  valid_isEmpty(val, {detail:true}) : '';
        break;
      case 'activityLevel':
        errors[key] = valid_isEmpty(val) ? '활동량 ' +  valid_isEmpty(val) : '';
        break;
      case 'walkingCountPerWeek':
        errors[key] = valid_isEmpty(val) ? '평균 산책횟수 ' +  valid_isEmpty(val) : '';
        break;
      case 'walkingTimePerOneTime':
        errors[key] = valid_isEmpty(val) ? '1회 당 산책시간 ' +  valid_isEmpty(val) : '';
        break;
      case 'dogStatus':
        errors[key] = valid_isEmpty(val) ? '반려견 상태 ' +  valid_isEmpty(val) : '';
        break;
      case 'snackCountLevel':
        errors[key] = valid_isEmpty(val) ? '간식급여횟수 ' +  valid_isEmpty(val) : '';
        break;
      case 'inedibleFood':
        errors[key] = valid_isEmpty(val) ? '못 먹는 음식 ' +  valid_isEmpty(val) + ' 특정한 값을 선택해주세요.' : '';
        break;
      case 'inedibleFoodEtc':
        errors[key] = valid_isEmpty(val) ? '못 먹는 음식의 기타 ' +  valid_isEmpty(val) : '';
        break;
      case 'recommendRecipeId':
        errors[key] = valid_isEmpty(val) ? '특별히 챙겨주고 싶은 부분 ' +  valid_isEmpty(val) : '';
        break;
      case 'caution':
        errors[key] = valid_isEmpty(val) ? '기타 특이사항 ' +  valid_isEmpty(val) : '';;
        break;
    }
  }
  return errors;
};
