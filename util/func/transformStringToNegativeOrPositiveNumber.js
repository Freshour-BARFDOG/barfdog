const transformStringToNegativeOrPositiveNumber = (value, unit = '+') => {
  let recoveredNumber = value;
  if ( typeof recoveredNumber !== 'number' ) {
    return value;
  }
  recoveredNumber = unit === '-' ? recoveredNumber * -1 : recoveredNumber
  return recoveredNumber;
};
export default transformStringToNegativeOrPositiveNumber;