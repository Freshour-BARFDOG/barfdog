export const transformBirthDay = (date) => {
  const RegExp = /^([1|2])([0-9]{3})([0|1])([0-9])([0|1|2|3])([0-9])$/;
  const error = !RegExp.test( date );
  if ( error ) return console.error( '입력받은 생년월일의 형식이 올바르지 않습니다.' );
  const yyyy = date.slice( 0, 4 );
  const mm = date.slice( 4, 6 );
  const dd = date.slice( 6, 8 );
  return `${yyyy}-${mm}-${dd}`;
};