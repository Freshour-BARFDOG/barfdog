import transformDate, {transformToday} from './transformDate';

export const calcNextSubscribeDeliveryDate = (d = transformToday(), unit = '월일') => {
  // WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const FRI = 5; // 금
  const next_WED = 10;
  const theWeekAfterNext_WED = 17;
  const today = new Date( d ); //
  const dayOfWeek = today.getDay(); // num // 0 ~ 6
  const sundayOfWeek = today.getDate() - dayOfWeek; // 이번 주의 첫 번째 일 (SUN)
  const diff = sundayOfWeek + (dayOfWeek <= FRI ? next_WED : theWeekAfterNext_WED);
  const nextDeliveryDate = new Date( today.setDate( diff ) ).toISOString().substring( 0, 10 );
  // console.log(new Date(today.setDate(diff)).toISOString().substring(0,10));
  return transformDate( nextDeliveryDate, unit );
  // unit: null  > 'YYYY-MM-DD'
  // unit: 년월일 > 'YYYY년 MM월 DD일'
};




export const calcChangedSubscribeDeliveryDate = (originDate='YYYY-MM-DD', periodInWeeks)=>{
  const convertingOriginDate = transformDate(originDate);
  const weeks = periodInWeeks * 7;
  const prevDate = new Date(convertingOriginDate);
  const nextDate = new Date(prevDate.setDate(prevDate.getDate() + weeks));
  return transformDate(nextDate.toISOString()); // YYYY-MM-DD

}