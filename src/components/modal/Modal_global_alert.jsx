import React, {useEffect, useState } from 'react';
import s from "./modal.module.scss";
import { useModalContext } from "/store/modal-context";
import ModalWrapper from './ModalWrapper';



function Modal_global_alert({ message, onClick, background,   ...props }) {
  const mct = useModalContext();
  const modalState = mct.hasAlert;
  const modalContextMessage = mct.message;
  const [style, setStyle] = useState({});
  const [targetScrollYPos, setTargetScrollYPos] = useState( null );
  
  useEffect(() => {
    callbackAfterAnimation(modalState);
    const scrollYPos = window.scrollY;
    if(modalState){
      document.body.style.cssText = `
      position:fixed;
      top : -${scrollYPos}px;
    `;
      setTargetScrollYPos(scrollYPos)
    } else {
      document.body.style.cssText = ``;
      window.scrollTo(0, parseInt(targetScrollYPos));
    }
  }, [modalState]);
  

  const callbackAfterAnimation = (modalState) => {
    const delay = modalState ? 0 : 500;
    setTimeout(() => {
      setStyle({ display: modalState ? "block" : "none" });
    }, delay);
  };

  const onClickHandler = ()=>{
    if(onClick && typeof onClick==='function'){
      onClick();
    } else {
      mct.alertHide();
    }
  }

  return (
    <>
      <ModalWrapper
        className={`${s['modal_wrap']} ${s['global']} ${modalState ? 'active' : 'inactive'}`}
        label="Modal Global Alert"
        {...props}
      >
        <div className={s['body']} style={modalState ? { display: 'flex' } : style}>
          <header className={s['title-section']}>
            <pre className={`${s.text} ${s.only}`}>{message || modalContextMessage}</pre>
          </header>
          <div className={s['btn-section']}>
            <button onClick={onClickHandler}>확인</button>
          </div>
        </div>
      </ModalWrapper>
      {modalState && background && <section className={s.background} />}
    </>
  );
}

export default Modal_global_alert;