export const availablePaymentState = ({reward}) => {
  let result = true;
  
  const SOME_STATE = false;
  // 적립금이 음수인 경우
  if ( Math.sign( Number( reward ) ) < 0 ) {
    result = false;
  } else if ( SOME_STATE ) {
    // ADD SOME VALIDATION
    
  }
  
  return result;
}