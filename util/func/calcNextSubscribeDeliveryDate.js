import transformDate, {transformToday} from './transformDate';
import {orderDeadLineDayIndex} from "./orderDeadLineDayIndex";

const WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
const TARGET_DAY = 'TUE'; // 매주 정기구독 발송되는 요일 // ! 고객사 측에서 정기구독 발송 요일 변경 ( 수 -> 화)

export const calcNextSubscribeDeliveryDate = (d = transformToday(), unit = '월일') => {
 
  
  const ONEWEEK = 7;
  const NEXT_TARGET_DAY = WEEK.indexOf(TARGET_DAY) + ONEWEEK;
  const THEWEEKAFTERNEXT_TARGET_DAY = NEXT_TARGET_DAY + ONEWEEK;
  const today = new Date( d ); // YYYY-MM-DD
  const dayOfWeek = today.getDay(); // num // 0 ~ 6
  const sundayOfWeek = today.getDate() - dayOfWeek; // 이번 주의 첫 번째 일 (SUN)
  const ORDER_DEADLINE_DAY_INDEX = orderDeadLineDayIndex();
  const diff = sundayOfWeek + (dayOfWeek <= ORDER_DEADLINE_DAY_INDEX ? NEXT_TARGET_DAY : THEWEEKAFTERNEXT_TARGET_DAY);
  const nextDeliveryDate = new Date( today.setDate( diff ) ).toISOString().substring( 0, 10 );
  // // console.log('다음 정기구독 발송 예정일: ',new Date(today.setDate(diff)).toISOString().substring(0,10));
  return transformDate( nextDeliveryDate, unit );
  // unit: null  > 'YYYY-MM-DD'
  // unit: 년월일 > 'YYYY년 MM월 DD일'
};

const getThisTuesDay = (d = 'YYYY-MM-DD')=>{
  const today = new Date( d ); // YYYY-MM-DD
  const dayOfWeek = today.getDay(); // num // 0 ~ 6
  const sundayOfWeek = today.getDate() - dayOfWeek; // 이번 주의 첫 번째 일 (SUN)
  // const WED = sundayOfWeek + 3;
  const TUES = sundayOfWeek + WEEK.indexOf(TARGET_DAY);
  const thisTUES = new Date(today.setDate(TUES)).toISOString().substring(0, 10);
  return thisTUES;
}



export const calcChangedSubscribeDeliveryDate = (originDate='YYYY-MM-DD', periodInWeeks)=>{
  
  // const convertingOriginDate = tran sformDate(originDate);
  const convertingOriginDate = getThisTuesDay(originDate);
  const weeks = periodInWeeks * 7;
  const prevDate =  new Date(convertingOriginDate);
  const nextDate = new Date(prevDate.setDate(prevDate.getDate() + weeks));
  return transformDate(nextDate.toISOString()); // YYYY-MM-DD;

}