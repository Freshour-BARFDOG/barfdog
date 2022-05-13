import React, {useEffect, useState } from 'react';
import s from "./modal.module.scss";
import { useModalContext } from "@store/modal-context";
import ModalWrapper from './ModalWrapper';




function Modal_global_alert({ message }) {
  const mct = useModalContext();
  const modalState = mct.hasAlert;
  const [style, setStyle] = useState({});

  useEffect(() => {
    callbackAfterAnimation(modalState);
  }, [modalState]);

  const callbackAfterAnimation = (modalState) => {
    const delay = modalState ? 0 : 500;
    setTimeout(() => {
      setStyle({ display: modalState ? "block" : "none" });
    }, delay);
  };

  const onHideModalHandler = () => {
    mct.alertHide();
  };

  return (
    <>
      <ModalWrapper
        className={`${s["modal_wrap"]} ${s["global"]} ${
          modalState ? "active" : "inactive"
        }`}
        label="Modal Global Alert"
      >
        <div style={modalState ? { display: "block" } : style}>
          <header className={s.title_section}>
            <div className={`${s.text} ${s.only}`}>{message}</div>
          </header>
          <div className={s.btn_section}>
            <button
              className="admin_btn popup solid"
              onClick={onHideModalHandler}
            >
              확인
            </button>
          </div>
        </div>
      </ModalWrapper>
    </>
  );
}

export default Modal_global_alert;