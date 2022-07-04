


export default function transformClearLocalCurrency(stringValue) {
  let number;
  if(typeof stringValue === 'number' && stringValue === 0){
    return number = 0;
  }

  if(!stringValue || typeof stringValue !== 'string' )return ;
  number = Number(stringValue.replace(/,/gi, ''));
  return number;
}