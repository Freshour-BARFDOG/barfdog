const transformDecimalNumber = (number, decimalPoint = 2) => {
  let num = typeof number === "number" ? String( number ) : number;
  const pointPos = num.indexOf( "." );
  
  if ( pointPos < 0 ) return Number( num ).toFixed( decimalPoint );
  
  const splitNumber = num.split( "." );
  const rightNum = splitNumber[1].substring( 0, decimalPoint );
  return Number( `${splitNumber[0]}.${rightNum}` ).toFixed( decimalPoint );
};

export default  transformDecimalNumber;