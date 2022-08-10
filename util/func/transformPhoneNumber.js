export const
  transformPhoneNumber = (phoneNum) => {
      if(!phoneNum)return;
    const RegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
    const error = !RegExp.test( phoneNum );
    if ( error ) return console.error( '입력받은 휴대전호번호의 형식이 올바르지 않습니다.' );
  
    let n1;
    let n2;
    let n3;
    
    if(phoneNum.length === 10){
      n1 = phoneNum.slice( 0, 3 );
      n2 = phoneNum.slice( 3, 6 );
      n3 = phoneNum.slice( 6, 10 );
      
    } else if(phoneNum.length === 11){
      n1 = phoneNum.slice( 0, 3 );
      n2 = phoneNum.slice( 3, 7 );
      n3 = phoneNum.slice( 7, 11 );
    }
   
    return `${n1}-${n2}-${n3}`;
  };