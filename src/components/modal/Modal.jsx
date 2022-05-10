import React, { useState } from 'react';
import styled from 'styled-components';

const ModalBackground = styled.div`
  position: absolute;
  z-index:1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.3);
  animation: show var(--ani-default) forwards;
  &.on {
    pointer-events: all;
  }
  &.off {
    animation: hide var(--ani-default) forwards;
    pointer-events: all;
  }
`;

const ModalBody = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background-color:#fff;
  animation: show var(--ani-default) forwards;
`;

function Modal({ children, title, onClick }) {
  const onClickHandler = () => {
  };
  return (
    <ModalBackground title={title} onClick={onClick || onClickHandler}>
      <ModalBody>{children}</ModalBody>
    </ModalBackground>
  );
}

export default Modal;