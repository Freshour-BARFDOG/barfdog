import React, { useState } from 'react';
import styled from 'styled-components';
import rem from '/util/func/rem';

const Wrap = styled.div`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const Icon = styled.i`
  position: relative;
  background: #fff;
  z-index: 9;
  border-radius: 50%;
  border: ${rem(1)} solid #ababab;
  color: #ababab;
  font-size: ${rem(13)} !important;
  margin-left: ${rem(4)};
  line-height: 2;
  width: ${rem(16)};
  height: ${rem(16)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: ${props=> props.onClick ? 'pointer' : 'default'} !important;
`;

const MessageBody = styled.pre`
  background-color: ${(props) => (props.theme === 'white' ? '#fff' : '#111')};
  color: ${(props) => (props.theme === 'white' ? '#000' : '#fff')};
  box-shadow: ${(props) =>
    props.theme === 'white' ? `0 0 ${rem(10)} 0 rgba(0,0,0,0.15)` : 'none'};
  border: ${(props) => (props.theme === 'white' ? `${rem(1)} solid var(--color-line-04)` : 'none')};
  position: absolute;
  z-index: 10;
  left: 50%;
  bottom: -${rem(10)};
  transform: translate(-50%, 100%);
  border-radius: ${rem(4)};
  box-sizing: border-box;
  //min-width: ${rem(200)};

  font-size: ${rem(13)} !important;
  padding: ${rem(12)} ${rem(16)};
  white-space: nowrap;
  animation: show var(--ani-default);

  &[data-wordbreaking] {
    white-space: pre-wrap;
    min-width: ${rem(200)};
  }
  &[data-align='right'] {
    left: auto;
    right: 0;
    transform: translate(0, 100%);
  }
  &[data-align='left'] {
    left: 0;
    right: auto;
    transform: translate(0, 100%);
  }
  &[data-align='center'] {
    left: ${rem(24)};
    right: auto;
    top:50%;
    bottom:auto;
    transform: translate(0%, -50%);
  }
  &[data-device='pc'] {
    width: initial;
  }
  &[data-device='mobile'] {
    width: ${rem(200)};
    white-space: initial;
  }
`;

const ToolTip = ({
  message,
  style,
 iconStyle,
  messagePosition,
  device,
  theme,
  wordBreaking,
  onClick,
  ...props
}) => {
  const [isActive, setIsActive] = useState(false);

  const onMouseEnterHandler = () => {
    setIsActive(true);
  };

  const onMouseLeaveHandler = () => {
    setIsActive(false);
  };

  const onClickHandler = () => {
    if (onClick && typeof onClick === 'function') {
      onClick();
    }
  };

  return (
    <>
      <Wrap {...props}>
        <Icon
          style={iconStyle}
          onMouseEnter={onMouseEnterHandler}
          onMouseLeave={onMouseLeaveHandler}
          onClick={onClick && onClickHandler}
        >
          {typeof onClick === 'function' ? '?' : 'i'}
        </Icon>
        {isActive && (
          <MessageBody
            style={style}
            data-align={messagePosition}
            data-device={device}
            theme={theme}
            data-wordbreaking={wordBreaking}
          >
            {message}
          </MessageBody>
        )}
      </Wrap>
    </>
  );
};

export default ToolTip;
