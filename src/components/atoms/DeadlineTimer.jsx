import React, { useState, useEffect }from 'react'
import styled from 'styled-components';
import rem from '../../../util/func/rem';
import zIndex from '@styles/global/zIndex.module.scss';

const bgColor = '#FFCEBA';
const move_X = rem(40);



const Rect = styled.i`
  position: absolute;
  right: calc(${move_X} + ${rem(5)});
  bottom: ${rem(3)};
  transform: translate(0, 100%);
  border-top: ${rem(15)} solid ${bgColor};
  border-left: ${rem(9)} solid transparent;
  border-right: ${rem(9)} solid transparent;
`;


const Text = styled.b`
  font-size: ${rem(16)};
  color: var(--color-main);
  letter-spacing: ${rem(0.8)};
  white-space: nowrap;
`;

const NormalText = styled.span`
  font-size: ${rem(16)};
  color: #000;
  white-space: nowrap;
`;

const Timer = styled.span`
  margin: 0 ${rem(8)};
  white-space:nowrap;
  font-weight:400;
  width: ${rem(88)};
  text-align:left;
`;


const Wrap = styled.div`
  position: absolute;
  // ! z-index: 100;
  right: 0;
  top: 0;
  transform: translate(${move_X}, calc(-100% - ${rem(34)}));
  text-align: center;
  color: #000;
  font-size: ${rem(16)};
  padding: ${rem(10)} ${rem(20)} ${rem(8)};
  box-sizing: border-box;
  background-color: ${bgColor};
  border-radius: ${rem(8)};
`;



Date.prototype.deliveryDeadline = function () {
  
  const today = new Date().getDay();
  let d_Day;
  switch (today) {
  case 0: // 일
      d_Day = 5;
      break;
  case 1: // 월
      d_Day = 4;
      break;
  case 2:
      d_Day = 3;
      break;
  case 3:
      d_Day = 2;
      break;
  case 4:
      d_Day = 1;
      break;
  case 5:
      d_Day = 0; // 주문마감시간: 매주 금요일 23:59:59
      break;
  case 6:
      d_Day = 6;
      break;
  }


  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const date = now.getDate();
  const nextDate = date + d_Day + 1; 
  //279141초 = 3600*24 (일) + 3600 (시간)  + 60 (분) + 

  let DEADLINE = new Date(year, month, nextDate) || "";
  const gap = Math.floor((DEADLINE.getTime() - now.getTime()) / 1000);

  if(gap < 0) return;
  
  // 나머지를 올림해서, 변환
  const day = d_Day; 
  const hour = Math.floor( (gap % (60 * 60 * 24))  / (60 * 60)) ; 
  const min = Math.floor( (gap % ( 60 * 60)) / 60);
  const sec = Math.floor(gap % 60);

  function convertNum (num) {
    let convertedNum = num < 10 ? '0' + num.toString() : num.toString();
    return convertedNum;
  }

  
  DEADLINE = `${day}일 ${convertNum(hour)}:${convertNum(min)}:${convertNum(sec)}`;
  return DEADLINE;
}   
           

const Dealine_timer = () => {
  const [message, setMessage] = useState('');



  
  useEffect(() => {
    setTimeout(() => {
      setMessage(new Date().deliveryDeadline());
    }, 1000)
  })


  return (
    <Wrap
      id="deadline_timer"
      className={`${zIndex["gnb-subscribe-timer"]} flex-wrap`}
    >
      <Text>정기구독배송</Text>
      <Timer id="deadline">{message}</Timer>
      <NormalText> 이후 주문 마감!</NormalText>
      <Rect className="rect" />
    </Wrap>
  );
  
}




export default Dealine_timer;

