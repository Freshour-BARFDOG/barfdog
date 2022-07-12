import {transformToday} from './transformDate';

export const getDiffDate = (diffNum) => {
  // diffNum: 양수 => 미래시점
  // diffNum: 음수 => 과거시점
  let dDay;
  let now = new Date();
  const calc = now.setDate( now.getDate() + Number( diffNum ) );
  dDay = new Date( calc ); // ! diff 가 양수일 경우, 이전날짜를 츨력한다
  return transformToday( dDay );
};


export const getDiffDateNumber = (fromDate, toDate) => {
  //d1, d2 : 'yyyy-dd-mm';
  const dt1 = new Date(fromDate).getTime();
  const dt2 = new Date(toDate).getTime();

  const dateUnit = 1000 * 60 * 60 * 24;
  const diffDateNum = Math.floor((dt1 - dt2) / dateUnit)
  return diffDateNum ;
};

