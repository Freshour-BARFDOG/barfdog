import React from 'react';
import styled from "styled-components";
import rem from "@src/components/atoms/rem";


const ModalWrap = styled.div`
  position: fixed;
  z-index: 1001;
  left: 50%;
  top:0;
  transform: translate(-50%, 0%);
  padding: ${rem(32)};
  width: ${rem(360)};
  background-color: #fff;
  box-sizing: border-box;
  border-radius: ${rem(6)};
  box-shadow: 0 0 ${rem(30)} rgba(0, 0, 0, 0.15);

  overflow:hidden;
  transition-property: top, opacity, height;
  transition-duration: 0.3s;
  transition-timing-function: ease-out;

  &.active {
    top: 10vh;
    height:auto;
    opacity: 1;
    pointer-events: all;
    margin:auto;
    padding:
  }
  &.inactive {
    top: 0;
    height:0;
    opacity: 0;
    margin:0;
    padding:0;
    pointer-events: none;
  }

  @media (max-width: ${rem(600)}) {
    width: auto;
  } ;
`;

function ModalWrapComponent({children, className, style, label}) {


  return (
    <ModalWrap className={className} style={style} modal-label={label}>
      {children}
    </ModalWrap>
  );
}

export default ModalWrapComponent;