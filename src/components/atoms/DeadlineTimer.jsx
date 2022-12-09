import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';
import zIndex from '/styles/module/zIndex.module.scss';
import useDeviceState from "/util/hook/useDeviceState";
import Favicon from '/public/img/icon/favicon.svg'
import {orderDeadLineTimeStamp} from "/util/func/setOrderDeadLineTimeStamp";


const Dealine_timer = ({ className }) => {
  const [message, setMessage] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const deviceState = useDeviceState();
  const isMobile = deviceState.isMobile;
  const deviceWidth = deviceState.deviceWidth;
  
  useEffect( () => {
    setTimeout( () => {
      setMessage( orderDeadLineTimeStamp() )
    }, 1000 );
  } );
  
  

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
          {isMobile && <IconWrap><Favicon /></IconWrap>}
          <Text>정기구독배송</Text>
          <Timer id="deadline">
            {message}
          </Timer>
          <NormalText> 이후 주문 마감!</NormalText>
          {!isMobile &&<Rect className="rect" />}
        </Wrap>
      )}
    </>
  );
};

export default Dealine_timer;




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