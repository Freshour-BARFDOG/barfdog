import React, {useEffect} from "react";
import ModalWrapper from "./ModalWrapper";
import s from "./modal.module.scss";
import CloseButton from "@src/components/atoms/CloseButton";

function Modal_confirm({ title, text, isConfirm, positionCenter ,theme}) {
  const onCancleHandler = () => {
    if (isConfirm && typeof isConfirm === "function") {
      isConfirm(false);
    }
  };
  const onConfirmHandler = () => {
    if (isConfirm && typeof isConfirm === "function") {
      isConfirm(true);
    }
  };
  
  useEffect(() => {
    const scrollYPos = window.scrollY;
    document.body.style.cssText = `
      overflow-y:scroll;
      position:fixed;
      width:100%;
      top : -${scrollYPos}px;
    `;
    
    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, []);

  return (
    <ModalWrapper className={`${s['modal-wrap']} ${s['confirm']}`} background positionCenter={positionCenter} data-theme={theme} >
      {/*<div className={s.btn_close_modal} onClick={onCancleHandler}>*/}
      {/*  <CloseButton />*/}
      {/*</div>*/}
      <div className={s['title-section']}>
        {title ? (
          <>
            <p className={s.title}>{title}</p>
            <p className={s.text}>{text}</p>
          </>
        ) : (
          text && <p className={`${s.text} ${s.only}`}>{text}</p>
        )}
      </div>
      <div className={s['btn-section']}>
        <button className="admin_btn popup line" onClick={onCancleHandler}>
          취소
        </button>
        <button className="admin_btn popup solid" onClick={onConfirmHandler}>
          확인
        </button>
      </div>
    </ModalWrapper>
  );
}

export default Modal_confirm;
