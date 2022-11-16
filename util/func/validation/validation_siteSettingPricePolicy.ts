
export function validate(obj) {
  let errors = {};
  const keys = Object.keys(obj);
  for (const key of keys) {
    const val = obj[key];
    switch (key) {
      default:
        errors[key] = valid_limitedNum(val);
    }
  }
  console.log('Valid Result (formValues) : ', errors);
  return errors;
}




export const valid_limitedNum = (numString: string) => {
  let error = '';
  const val = parseFloat(numString);
  if(val > 100 ||  val < 0){
    error =  '할인율 범위를 확인해주세요.';
  
  } else if(typeof val !== 'number'){
    error =  '유효하지 않은 항목입니다.';
  }
  
  return error;
};

