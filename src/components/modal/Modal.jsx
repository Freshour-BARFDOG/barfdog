import React from 'react';
import styled from 'styled-components';
import { useModalContext } from "@store/modal-context";
import zIndex from "/styles/global/zIndex.module.scss";





const ModalContainer = styled.div`
  position: fixed;
  // ! z-index: 1000; // global zindex에서 관리
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


function ModalWithBackground({ children, title, onClick, background }) {

  const mcx = useModalContext();
  const MODAL_ACTIVE_STATE = mcx.isActive;
  const onClickHandler = () => {
    mcx.onHide();
    
  }

  return (
    <>
      {MODAL_ACTIVE_STATE && (
        <ModalContainer
          title={title}
          className={`${zIndex["modal-withBackground"]}`}
        >
          {background && (
            <ModalBackground
              onClick={onClick || onClickHandler}
            ></ModalBackground>
          )}
          <ModalBody>{children}</ModalBody>
        </ModalContainer>
      )}
    </>
  );
}

export default ModalWithBackground;