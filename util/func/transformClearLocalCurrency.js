


export default function transformClearLocalCurrency(value) {
  let number;
  if(typeof value === 'number' && value === 0){
    return number = 0;
  } else if(typeof value === 'number'){
    return value;
    
  }

  if(!value || typeof value !== 'string' )return ;
  number = Number(value.replace(/,/gi, ''));
  return number;
}