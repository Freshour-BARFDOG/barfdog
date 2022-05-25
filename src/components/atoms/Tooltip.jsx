import React, { useState } from "react";
import styled from "styled-components";
import rem from "@src/components/atoms/rem";




const Wrap = styled.div`
  position: relative;
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
  background-color: #000;
  color: #fff;
  font-size: ${rem(13)} !important;
  padding: ${rem(12)} ${rem(16)};
  white-space: nowrap;
  animation: show var(--ani-default);
`;

const ToolTip = ({ message, style }) => {
  const [isActive, setIsActive] = useState(false);

  const onMouseEnterHandler = () => {
    setIsActive(true);
  }

   const onMouseLeaveHandler = () => {
    setIsActive(false);
  }


  return (
    <>
      <Wrap>
        <Icon
          onMouseEnter={onMouseEnterHandler}
          onMouseLeave={onMouseLeaveHandler}
        >
          i
        </Icon>
        {isActive && <MessageBody style={style}>{message}</MessageBody>}
      </Wrap>
    </>
  );
};

export default ToolTip;
