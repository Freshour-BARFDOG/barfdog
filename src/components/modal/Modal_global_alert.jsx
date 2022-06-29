import React, {useEffect, useState } from 'react';
import s from "./modal.module.scss";
import { useModalContext } from "/store/modal-context";
import ModalWrapper from './ModalWrapper';



function Modal_global_alert({ message, onClick, background }) {
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

  const onClickHandler = ()=>{
    if(onClick && typeof onClick==='function'){
      mct.alertHide();
      onClick();
    }
  }

  return (
    <>
      <ModalWrapper
        className={`${s["modal_wrap"]} ${s["global"]} ${
          modalState ? "active" : "inactive"
        }`}
        label="Modal Global Alert"
      >
        <div className={s['body']} style={modalState ? { display: "flex" } : style}>
          <header className={s['title-section']}>
            <pre className={`${s.text} ${s.only}`}>{message}</pre>
          </header>
          <div className={s['btn-section']}>
            <button
              onClick={onClickHandler || onHideModalHandler}
            >
              확인
            </button>
          </div>
        </div>
      </ModalWrapper>
      {modalState && background && <section className={s.background}/> }

    </>
  );
}

export default Modal_global_alert;