import React, {useState} from 'react';
import ModalWrapper from './ModalWrapper'
import s from "./modal.module.scss";


export const Modal_innerForm = (props) => {
  return (
    <>
      <section className={s['form-section']}>
        {props.children}
      </section>
      <div className={s['btn-section']}>
        <button className="admin_btn popup line" onClick={props.onCancle}>
          취소
        </button>
        <button className="admin_btn popup solid" onClick={props.onConfirm}>
          확인
        </button>
      </div>
    </>
  )
}


function Modal_alert({text, isConfirm, onClick, className,  children}) {


  const onClickHandler = () => {
    if (isConfirm && typeof isConfirm === "function") {
      const value = true;
      isConfirm(value);
    }
    if (onClick && typeof onClick === "function") {
      const value = true;
      onClick(value);
    }
  };

  return (
    <ModalWrapper className={`${s['modal-wrap']} ${className}`} data-modal-status={children ? 'hasChildren' : 'alert'}>
      <header className={s['title-section']}>
        {text && <pre className={`${s.text} ${s.only}`}>{text}</pre>}
      </header>
      {children || <div className={s['btn-section']}>
        <button className="admin_btn popup solid" onClick={onClickHandler}>
          확인
        </button>
      </div>}
    </ModalWrapper>
  );
}

export default Modal_alert