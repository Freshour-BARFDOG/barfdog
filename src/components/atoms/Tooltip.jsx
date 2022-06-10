import React, { useState } from "react";
import styled from "styled-components";
import rem from "@src/components/atoms/rem";




const Wrap = styled.div`
  position: relative;
  z-index: 10;
  display: inline-flex;
  align-items: center;
`;
const Icon = styled.i`
  border-radius: 50%;
  border: ${rem(1)} solid #ababab;
  color: #ababab;
  font-size: ${rem(13)} !important;
  line-height: 2;
  width: ${rem(16)};
  height: ${rem(16)};
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor:pointer;
`;
const MessageBody = styled.div`
  position: absolute;
  left: 50%;
  bottom: -${rem(10)};
  transform: translate(-50%, 100%);
  border-radius: ${rem(4)};
  box-sizing: border-box;
  background-color: #000;
  color: #fff;
  font-size: ${rem(13)} !important;
  padding: ${rem(12)} ${rem(16)};
  white-space: nowrap;
  animation: show var(--ani-default);
  &[data-align="right"]{
    left:auto;
    right:0;
    transform:translate(0,100%);
  }
  &[data-device="pc"]{
    width: initial;
  }
  &[data-device="mobile"]{
    width: ${rem(200)};
    white-space: initial;
  }
`;

const ToolTip = ({ message, style, messagePosition,device ,...props }) => {
  const [isActive, setIsActive] = useState(false);

  const onMouseEnterHandler = () => {
    setIsActive(true);
  }

   const onMouseLeaveHandler = () => {
    setIsActive(false);
  }


  return (
    <>
      <Wrap {...props}>
        <Icon onMouseEnter={onMouseEnterHandler} onMouseLeave={onMouseLeaveHandler}>
          i
        </Icon>
        {isActive && <MessageBody style={style} data-align={messagePosition} data-device={device}>{message}</MessageBody>}
      </Wrap>
    </>
  );
};

export default ToolTip;
