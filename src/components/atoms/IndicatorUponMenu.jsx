import React, { useRef, useEffect } from "react";
import getElemIdx from "@util/func/getElemIdx";
import rem from "/src/components/atoms/rem";
import styled from "styled-components";

// * 최초 위치를 위해, parent Component에서 menu를 전달시켜서, 1회 실행 필요



const indicatorAniDirection = "left"; // 이동 기준
const Indicator = styled.i`
  position: absolute;
  bottom: 0;
  ${indicatorAniDirection}:0; // 초기 위치
  width: ${rem(107)};
  background-color: var(--color-main);
  height: ${rem(3)};
  transition: ${indicatorAniDirection} 0.3s ease;
`;

function IndicatorUponMenu({target}) {
  const indicatorRef = useRef();

  useEffect(() => {

      if (!indicatorRef.current || !target) return;

      const targetRef = target;
      const indicator = indicatorRef.current;
      const menuWidth = targetRef.offsetWidth;
      const menuIdx = getElemIdx(targetRef);
      const indicatorWidth = indicator.offsetWidth;

      const posX = menuWidth * menuIdx + menuWidth / 2 - indicatorWidth / 2;
      indicator.style[`${indicatorAniDirection}`] = `${rem(posX)}`;
  }, [target]);
  
  // const indicatorMove = () => {
  //   if (!indicatorRef.current || !target) return;

  //   const targetRef = target;
  //   const indicator = indicatorRef.current;
  //   const menuWidth = targetRef.offsetWidth;
  //   const menuIdx = getElemIdx(targetRef);
  //   const indicatorWidth = indicator.offsetWidth;

  //   const posX = menuWidth * menuIdx + menuWidth / 2 - indicatorWidth / 2;
  //   indicator.style[`${indicatorAniDirection}`] = `${rem(posX)}`;
  // };


  return <Indicator ref={indicatorRef} data-title={"menu indicator"}></Indicator>;
}

export default IndicatorUponMenu;
