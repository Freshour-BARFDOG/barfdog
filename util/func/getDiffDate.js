import {transformToday} from './transformDate';

const getDiffDate = (diffNum) => {
  // diffNum: 양수 => 미래시점
  // diffNum: 음수 => 과거시점
  let dDay;
  let now = new Date();
  const calc = now.setDate( now.getDate() + Number( diffNum ) );
  dDay = new Date( calc ); // 디프넘버가 양수일 경우, 이전날짜를 츨력한다
  return transformToday( dDay );
};

export default getDiffDate;