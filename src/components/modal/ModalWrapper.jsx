import React from 'react';
import styled from "styled-components";
import rem from "@src/components/atoms/rem";


const ModalWrap = styled.div`
  position: fixed;
  z-index: 1001;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  padding: ${rem(32)};
  width: ${rem(360)};
  background-color: #fff;
  box-sizing:border-box;
  border-radius: ${rem(6)};
  box-shadow: 0 0 ${rem(30)} rgba(0, 0, 0, 0.15);
  
  @media (max-width: ${rem(600)}) {
    width: auto;
  } ;
`;

function ModalWrapComponent({children, className}) {


  return <ModalWrap className={className}>{children}</ModalWrap>;
}

export default ModalWrapComponent;