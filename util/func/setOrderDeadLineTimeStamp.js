


import { getOrderDeadLineDayIndex } from './getOrderDeadLineDayIndex';


// # 주문마감시간
// 최초: 매주 금요일 23:59:59
// 변경: 매주 목요일 23:59:59 (고객사 요청 / 22년12월)
// # 주문 마감일자와 현재 연계된 기능 없음 (22.12.09 기준)


const getDDday = (dDayIndex, todayIndex) => {
  const weekNum = 7;
  return (dDayIndex - todayIndex + weekNum) % weekNum;
};

export const orderDeadLineTimeStamp = () => {
  

  const dDayIndex = getOrderDeadLineDayIndex();
  const todayIndex = new Date().getDay();
  const diffDate = getDDday(dDayIndex, todayIndex);
  
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  //279141초 = 3600*24 (일) + 3600 (시간)  + 60 (분) +
  
  const nextDate = date + diffDate + 1;
  let DEADLINE = new Date(year, month, nextDate) || '';
 
  const gap = Math.floor((DEADLINE.getTime() - now.getTime()) / 1000);
  
  if (gap < 0) return;
  
  // 나머지를 올림해서, 변환
  const hour = Math.floor((gap % (60 * 60 * 24)) / (60 * 60));
  const min = Math.floor((gap % (60 * 60)) / 60);
  const sec = Math.floor(gap % 60);
  
  DEADLINE = `${diffDate}일 ${convertNum(hour)}:${convertNum(min)}:${convertNum(
    sec,
  )}`;
  
  return DEADLINE;
};




const convertNum = (num) => {
  return num < 10 ? '0' + num.toString() : num.toString();
};