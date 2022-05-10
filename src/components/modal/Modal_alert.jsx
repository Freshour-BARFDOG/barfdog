import React from 'react';
import ModalWrapper from './ModalWrapper'
import s from "./modal.module.scss";



function Modal_alert({text, isConfirm}) {


  const onClickHandler = () => {
    if (isConfirm && typeof isConfirm === "function") {
      const value = true;
      isConfirm(value);
    }
  };

  return (
    <ModalWrapper className={`${s.modal_wrap}`}>
      <header className={s.title_section}>
        {text && <p className={`${s.text} ${s.only}`}>{text}</p>}
      </header>
      <div className={s.btn_section}>
        <button className="admin_btn popup solid" onClick={onClickHandler}>
          확인
        </button>
      </div>
    </ModalWrapper>
  );
}

export default Modal_alert