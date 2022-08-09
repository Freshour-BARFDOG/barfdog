import transformDate, {transformToday} from './transformDate';

export const calcNextSubscribeDeliveryDate = (d = transformToday(), unit = '월일') => {
  // WEEK = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const FRI = 5; // 금
  const next_WED = 10;
  const theWeekAfterNext_WED = 17;
  const today = new Date( d ); // YYYY-MM-DD
  const dayOfWeek = today.getDay(); // num // 0 ~ 6
  const sundayOfWeek = today.getDate() - dayOfWeek; // 이번 주의 첫 번째 일 (SUN)
  const diff = sundayOfWeek + (dayOfWeek <= FRI ? next_WED : theWeekAfterNext_WED);
  const nextDeliveryDate = new Date( today.setDate( diff ) ).toISOString().substring( 0, 10 );
  // console.log(new Date(today.setDate(diff)).toISOString().substring(0,10));
  return transformDate( nextDeliveryDate, unit );
  // unit: null  > 'YYYY-MM-DD'
  // unit: 년월일 > 'YYYY년 MM월 DD일'
};

const getThisWednesDay = (d = 'YYYY-MM-DD')=>{
  const FRI = 5; // 금
  const next_WED = 10;
  const theWeekAfterNext_WED = 17;
  const today = new Date( d ); // YYYY-MM-DD
  const dayOfWeek = today.getDay(); // num // 0 ~ 6
  const sundayOfWeek = today.getDate() - dayOfWeek; // 이번 주의 첫 번째 일 (SUN)
  const WED = sundayOfWeek + 3
  const thisWED = new Date(today.setDate(WED)).toISOString().substring(0, 10);
  return thisWED;
}



export const calcChangedSubscribeDeliveryDate = (originDate='YYYY-MM-DD', periodInWeeks)=>{
  
  // const convertingOriginDate = transformDate(originDate);
  const convertingOriginDate = getThisWednesDay(originDate); // 그 주의 수요일.
  const weeks = periodInWeeks * 7;
  const prevDate =  new Date(convertingOriginDate);
  const nextDate = new Date(prevDate.setDate(prevDate.getDate() + weeks)); // 그 주의 수요일 + n주
  return transformDate(nextDate.toISOString()); // YYYY-MM-DD;

}