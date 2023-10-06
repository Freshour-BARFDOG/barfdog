import {orderDeadLineDayIndex} from './orderDeadLineDayIndex';


// # 주문마감시간
// 최초 : 매주 금요일 23:59:59
// 변경1: 매주 목요일 23:59:59 (고객사 요청 / 22년12월)
// # 주문 마감일자와 현재 연계된 기능 없음 (22.12.09 기준)
// 변경2: 매주 목요일 18:59:59 (고객사 요청 / 23년10월)


const getDDday = (dDayIndex, todayIndex) => {
  const weekNum = 7;
  return (dDayIndex - todayIndex + weekNum) % weekNum;
};

export const orderDeadLineTimeStamp = () => {
  const dDayIndex = orderDeadLineDayIndex();
  const todayIndex = new Date().getDay();
  let diffDate = getDDday(dDayIndex, todayIndex);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();

  // // 목요일로 변경
  // if (todayIndex !== 4) { // 4는 목요일을 나타냅니다 (일요일부터 0으로 시작)
  //   diffDate += (4 - todayIndex + 7) % 7;
  // }
  const nextDate = date + diffDate + 1;

  // 6시로 변경
  const DEADLINE = new Date(year, month, nextDate, 18, 0, 0);

  const gap = Math.floor((DEADLINE.getTime() - now.getTime()) / 1000);

  if (gap < 0) return;

  // 나머지를 올림해서, 변환
  const hour = Math.floor((gap % (60 * 60 * 24)) / (60 * 60));
  const min = Math.floor((gap % (60 * 60)) / 60);
  const sec = Math.floor(gap % 60);

  return `${diffDate}일 ${convertNum(hour)}:${convertNum(min)}:${convertNum(sec)}`;
};

const convertNum = (num) => {
  return num < 10 ? '0' + num.toString() : num.toString();
};