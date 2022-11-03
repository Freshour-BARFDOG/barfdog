import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';
import zIndex from '/styles/module/zIndex.module.scss';
import CloseButton from './CloseButton';
import useDeviceState from "/util/hook/useDeviceState";
import Favicon from '/public/img/icon/favicon.svg'




const Rect = styled.i`
  position: absolute;
  left: calc(${rem(54)} + ${rem(5)});
  bottom: ${rem(4)};
  transform: translate(0, 100%);
  border-top: ${rem(15)} solid #FFCEBA;
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
  white-space: nowrap;
  font-weight: 400;
  width: ${rem(88)};
  text-align: left;
`;

const ButtonWrap = styled.span`
  position: absolute;
  left:${rem(20)};
  top:50%;
  transform:translateY(-50%);
`;


const IconWrap = styled.i`
  display: flex;
  align-content: center;
  margin-right: ${rem(4)};
`;

const Wrap = styled.div`
  position: absolute;
  // ! z-index: 100;
  left: 0;
  top: 0;
  transform: translate(${rem(0)}, calc(-100% - ${rem(24)}));
  text-align: center;
  color: #000;
  font-size: ${rem(16)};
  padding: ${rem(10)} ${rem(20)} ${rem(8)};
  box-sizing: border-box;
  background-color: #FFCEBA;
  border-radius: ${rem(8)};
  @media (max-width: ${rem(600)}) {
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    top: auto;
    transform: initial;
    background-color: rgba(0, 0, 0, 0.85);
    border-radius: 0;
    height: ${rem(40)};
    font-size: ${rem(14)};
    color: #fff;
    &.scroll-container {
      justify-content: flex-start !important;
      overflow-x: scroll;
      white-space: nowrap;
      padding: 0 rem(10);
      box-sizing: border-box;
      > * {
        width: auto !important;
      }
      &::-webkit-scrollbar {
        width: 0;
        height: 0;
      }
    }
    
    span {color: #fff;}
    *{font-size: inherit;}
  }
`;


const Dealine_timer = ({ className }) => {
  const [message, setMessage] = useState('');
  const [isVisible, setIsVisible] = useState(true);
  const deviceState = useDeviceState();
  const isMobile = deviceState.isMobile;
  const deviceWidth = deviceState.deviceWidth;


  useEffect(() => {
    setTimeout(() => {
      setMessage(new Date().deliveryDeadline());
    }, 1000);
  });


  const onHideHandler = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <Wrap
          onClick={onHideHandler}
          id="deadline_timer"
          className={`${zIndex['gnb-subscribe-timer']} ${deviceWidth < 380 && 'scroll-container'} flex-wrap ${className ? className : ''}`}
        >
          {/*{isMobile && <ButtonWrap><CloseButton lineColor={'#fff'}/></ButtonWrap>}*/}
          {isMobile && <IconWrap><Favicon /></IconWrap>}
          <Text>정기구독배송</Text>
          <Timer id="deadline">{message}</Timer>
          <NormalText> 이후 주문 마감!</NormalText>
          {!isMobile &&<Rect className="rect" />}
        </Wrap>
      )}
    </>
  );
};

export default Dealine_timer;








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

  let DEADLINE = new Date(year, month, nextDate) || '';
  const gap = Math.floor((DEADLINE.getTime() - now.getTime()) / 1000);

  if (gap < 0) return;

  // 나머지를 올림해서, 변환
  const day = d_Day;
  const hour = Math.floor((gap % (60 * 60 * 24)) / (60 * 60));
  const min = Math.floor((gap % (60 * 60)) / 60);
  const sec = Math.floor(gap % 60);
  
  DEADLINE = `${day}일 ${convertNum(hour)}:${convertNum(min)}:${convertNum(sec)}`;
  return DEADLINE;
};


function convertNum(num) {
  let result = num < 10 ? '0' + num.toString() : num.toString();
  return result;
}



