import React, {useEffect, useState } from 'react';
import s from "./modal.module.scss";
import { useModalContext } from "@store/modal-context";
import ModalWrapper from './ModalWrapper';



function Modal_global_alert({children}) {

  const mct = useModalContext();
  const visibility = mct.isAlert;

  console.log(mct);

  const onHideModalHandler = () => {
    mct.alertHide();
  };
  
    return (
      <>
        <ModalWrapper
          data-modal-title="Modal Global Alert"
          className={`${s["global"]} ${s["modal_wrap"]} ${visibility ? s.active : s.inactive}`}
        >
          <header className={s.title_section}>
            <div className={`${s.text} ${s.only}`}>{children}</div>
          </header>
          <div className={s.btn_section}>
            <button
              className="admin_btn popup solid"
              onClick={onHideModalHandler}
            >
              확인
            </button>
          </div>
        </ModalWrapper>
      </>
    );
}

export default Modal_global_alert;