import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';
import zIndex from '/styles/module/zIndex.module.scss';
import useDeviceState from '/util/hook/useDeviceState';
import Favicon from '/public/img/icon/favicon.svg';
import { orderDeadLineTimeStamp } from '/util/func/orderDeadLineTimeStamp';
import { getData } from '/src/pages/api/reqData';
import CloseButton from './CloseButton';
import s from './topLineBAnner.module.scss';

// 하단 배너
const Dealine_timer = ({ className, setIsBottomBannerVisible }) => {
  const [message, setMessage] = useState(null);

  const [dayValue, setDayValue] = useState('');
  const deviceState = useDeviceState();
  const isMobile = deviceState.isMobile;
  const deviceWidth = deviceState.deviceWidth;

  const getValueApiUrl = `/api/banners/deadline`;

  useEffect(() => {
    (async () => {
      try {
        const res = await getData(getValueApiUrl);
        // console.log(res);
        setDayValue(res.data.orderDeadline);
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setMessage(orderDeadLineTimeStamp(dayValue));
    }, 100);
  });

  const onHideHandler = () => {
    setIsBottomBannerVisible(false);
  };

  return (
    <div className={s.deadline_banner_wrapper}>
      <Wrap
        onClick={onHideHandler}
        id="deadline_timer"
        className={`${
          zIndex['gnb-subscribe-timer']
        } ${'scroll-container'} flex-wrap ${className ? className : ''} ${
          isMobile ? s.isMobile : ''
        }`}
        isMobile={isMobile}
      >
        <Text>AI추천 맞춤식단 정기구독</Text>
        <span className={s.deadline_timer_text}>{message}</span>
        <NormalText>이후 주문 마감!</NormalText>
        <CloseButton
          onClick={onHideHandler}
          className={s.bottom_close_button}
          lineColor={'#fff'}
        />
      </Wrap>
    </div>
  );
};

export default Dealine_timer;

const Rect = styled.i`
  position: absolute;
  left: calc(${rem(54)} + ${rem(5)});
  bottom: ${rem(4)};
  transform: translate(0, 100%);
  border-top: ${rem(15)} solid #ffceba;
  border-left: ${rem(9)} solid transparent;
  border-right: ${rem(9)} solid transparent;
`;

const Text = styled.b`
  font-size: ${rem(16)};
  ${'' /* color: var(--color-main); */}
  color: #FAFF00;
  font-weight: normal;
  letter-spacing: ${rem(0.8)};
  white-space: nowrap;
`;

const NormalText = styled.span`
  font-size: ${rem(14)};
  color: #000;
  white-space: nowrap;
  display: flex;
  align-items: center;
`;

// const Timer = styled.span`
//   margin: 0 ${rem(8)};
//   white-space: nowrap;
//   font-weight: 400;
//   text-align: left;
//   width: ${rem(112)};
//   ${(props) =>
//     props.isMobile &&
//     `
//     width: ${rem(75)};
//   `}
// `;

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
  ${'' /* padding: ${rem(10)} ${rem(20)} ${rem(8)}; */}
  box-sizing: border-box;
  display: flex;
  justify-content: center !important;
  align-items: center;
  ${'' /* background-color: #ffceba; */}
  ${'' /* border-radius: ${rem(8)}; */}
  position: fixed;
  width: ${rem(600)};
  margin: auto;
  left: 0;
  right: 0;
  bottom: ${(props) => (props.isMobile ? rem(79) : rem(88.5))};
  top: auto;
  transform: initial;
  background-color: rgba(0, 0, 0, 0.85);
  border-radius: 0;
  height: ${(props) => (props.isMobile ? rem(32) : rem(40))};
  font-size: ${(props) => (props.isMobile ? rem(12) : rem(18))};
  color: #fff;
  &.scroll-container {
    ${'' /* justify-content: flex-start !important; */}
    overflow-x: scroll;
    white-space: nowrap;
    padding: 0 rem(10);
    box-sizing: border-box;
    ${
      '' /* > * {
      width: auto;
    } */
    }
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }
  }

  span {
    color: #fff;
  }
  * {
    font-size: inherit;
  }
`;
