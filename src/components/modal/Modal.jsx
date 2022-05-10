import React from 'react';
import styled from 'styled-components';



const ModalWrapper = styled.div`
  position: absolute;
  z-index: 1000;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  animation: show var(--ani-default) forwards;
  &.on {
    pointer-events: all;
  }
  &.off {
    animation: hide var(--ani-default) forwards;
    pointer-events: all;
  }
`;

const ModalBackground = styled.div`
  width:100%;
  height:100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalBody = styled.div`
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  animation: show var(--ani-default) forwards;
`;

function Modal({ children, title, onClick }) {
  const onClickHandler = () => {
  };
  return (
    <ModalWrapper title={title}>
      <ModalBackground onClick={onClick || onClickHandler}></ModalBackground>
      <ModalBody>{children}</ModalBody>
    </ModalWrapper>
  );
}

export default Modal;