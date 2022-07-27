import transformDate, {transformToday} from './transformDate';

export const calcNextDeliveryDate = (d = transformToday(), unit = '월일') => {
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