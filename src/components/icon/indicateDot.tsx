import s from "@src/pages/bf-admin/dashboard/dashboard.module.scss";
import React from "react";
import Styled from "styled-components";
import rem from "@util/func/rem";

const Icon = Styled.i`
  position:absolute;
  transform: translate(100%, 0);
  width:${(p) => rem(p.size || 7)};
  height:${(p) => rem(p.size || 7)};
  background-color: var(--color-main);
  border-radius: 50%;
  top:${(p) => rem(p.pos.top || 0)};
  right:${(p) => rem(p.pos.right || 0)};
  animation: flicker 2s cubic-bezier(0.19, 0.8, 0.57, 0.93) infinite;
 
`

type PropsType = {
  size: number;
  pos: {
    top: number;
    right: number;
  };
}

export const IndicateDot = ({pos, size}: PropsType, ...props) => {
  return <Icon pos={pos} size={size} {...props}/>
}
