export const calcDogAge = (yyyymm, calcMethod = 'american') => {
  let age;
  if(!yyyymm)return;
  const dogBirthYear = Number( yyyymm.slice( 0, 4 ) );
  const dogBirthMonth = Number( yyyymm.slice( 4, 6 ));
  const curYear = new Date().getFullYear();
  const curMonth = new Date().getMonth() +1 ;
  
  
  const calcedYear = curYear - dogBirthYear;
  const calcedMonth = curMonth - dogBirthMonth + (calcedYear * 12);
  // // console.log('caledY: ', calcedYear);
  // // console.log('caledMonth: ', calcedMonth);
  
  if(calcedMonth < 0){
    console.error('계산된 나이가 음수입니다. 계산할 수 없습니다.');
    return age='-';
    
  }
  const y = Math.floor(calcedMonth / 12);
  const m = calcedMonth % 12;
  return age = y ? `${y}년 ${m}개월` : `${m}개월`;
}




export const calcDogAgebyMonth = (month) =>{
  let age;
  const mon = typeof month !== 'number' ? Number(month) : month;
  const y = Math.floor(mon / 12);
  const m = mon % 12;
  return age = y ? `${y}살` : `${m}개월`;
}