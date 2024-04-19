import React from 'react';
import ModalWrapper from './ModalWrapper';
import s from './modal_consult.module.scss';

export const Modal_innerForm = ({ children, onCancel, onConfirm }) => {
  return (
    <>
      <section className={s['form-section']}>{children}</section>
      <div className={s.btn_section}>
        <button className="admin_btn popup solid" onClick={onConfirm}>
          상담하기
        </button>
        <button className="admin_btn popup line" onClick={onCancel}>
          닫기
        </button>
      </div>
    </>
  );
};

export default function Modal_consult({
  text1,
  text2,
  text3,
  isConfirm,
  onClick,
  className,
  children,
}) {
  const onClickHandler = () => {
    if (isConfirm && typeof isConfirm === 'function') {
      isConfirm(true);
    }
    if (onClick && typeof onClick === 'function') {
      onClick(true);
    }
  };

  return (
    <ModalWrapper
      id={s.modal}
      positionCenter
      className={`animation-show ${s.modal_consult_wrapper}`}
      style={{ position: 'relative', height: '20rem' }}
    >
      <header className={s['title-section']}>
        {text1 && (
          <div className={`${s.text} ${s.only}`}>
            {text1}
            <br />
            {text2}
            <br />
            {text3}
          </div>
        )}
      </header>
      {children || (
        <div className={s['btn-section']}>
          <button className="admin_btn popup solid" onClick={onClickHandler}>
            확인
          </button>
        </div>
      )}
    </ModalWrapper>
  );
}
