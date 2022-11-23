import React from 'react';
import ModalWrapper from './ModalWrapper'
import s from "./modal.module.scss";


export const Modal_innerForm = ({ children, onCancel, onConfirm }) => {
  return (
    <>
      <section className={s['form-section']}>{children}</section>
      <div className={s['btn-section']}>
        <button className="admin_btn popup line" onClick={onCancel}>
          취소
        </button>
        <button className="admin_btn popup solid" onClick={onConfirm}>
          확인
        </button>
      </div>
    </>
  );
};


export default function Modal_alert ({text, isConfirm, onClick, className,  children}) {


  const onClickHandler = () => {
    if (isConfirm && typeof isConfirm === "function") {
      isConfirm(true);
    }
    if (onClick && typeof onClick === "function") {
      onClick(true);
    }
  };

  return (
    <ModalWrapper className={`${s['modal-wrap']} ${className}`} data-modal-status={children ? 'hasChildren' : 'alert'} positionCenter background>
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
