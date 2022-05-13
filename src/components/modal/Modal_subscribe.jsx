import s from "./modal_subscribe.module.scss";
import React from "react";
import styled from "styled-components";
import { useModalContext } from "@store/modal-context";
import rem from "@src/components/atoms/rem";

const Modal = styled.div`
  position: fixed;
  // z-index: ${modal_zindex};
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
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
`;

const ModalBody = styled.div`
  background-color:#fff;
  box-shadow: 0 0 30px rgba(0,0,0,0.15);
  border-radius: ${rem(8)};
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: show var(--ani-default) forwards;
`;


function Modal_subscribe() {
  const mct = useModalContext();
  const MODAL_ACTIVE_STATE = mct.subscribe?.isActive;

  console.log(MODAL_ACTIVE_STATE);
  const onClickHandler = () => {
    mct.subscribe.onHide();
  };

  return (
    <>
      {MODAL_ACTIVE_STATE && (
        <Modal className={s.ModalWrapper}>
          <ModalBackground onClick={onClickHandler} />
          <ModalBody>
            <div className={s.container}>
              <div className={s.cont}>
                <ul>
                  <li>내용물</li>
                </ul>
              </div>
            </div>
          </ModalBody>
        </Modal>
      )}
    </>
  );
}

export default Modal_subscribe;
