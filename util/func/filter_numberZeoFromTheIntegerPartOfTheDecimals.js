const filter_numberZeoFromTheIntegerPartOfTheDecimals = (stringTypeNumber, unit='+') => {
  let filteredValue = stringTypeNumber;
  const integer = filteredValue.split('.')[0];
  const decimal = filteredValue.split('.')[1];
  const hasComma = filteredValue.indexOf('.') >= 0;

 
  if (hasComma && !integer){
    filteredValue = '0' + filteredValue;
  } else  if(hasComma){
    const comma = '.';
    const hasMultipleComma = filteredValue.match(/./g).filter(s=>s === comma).length > 1;
    const clearValue = '';
    filteredValue = hasMultipleComma ? clearValue : filteredValue;
  }

  if (decimal && integer.length >= 2) {
    let transformedInteger;
    const zeroCharCode = 48;
    const isSecondCharZero = integer.charCodeAt(1) === zeroCharCode;
    transformedInteger = integer.replace(/(^0+)/, `${!isSecondCharZero ? '' : '0'}`);
    filteredValue = `${transformedInteger}.${decimal}`;
  }
  
  filteredValue = unit === '-' ? unit+filteredValue : filteredValue;
  return filteredValue;
}



export default filter_numberZeoFromTheIntegerPartOfTheDecimals;