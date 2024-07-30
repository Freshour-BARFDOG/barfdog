import React, { useEffect } from 'react';
import ModalWrapper from './ModalWrapper';
import s from './modal.module.scss';

function Modal_confirm({
  title,
  text,
  caution,
  isConfirm,
  positionCenter = false,
  theme,
  option = { wordbreak: false },
  height,
}) {
  const onCancleHandler = () => {
    if (isConfirm && typeof isConfirm === 'function') {
      isConfirm(false);
    }
  };
  const onConfirmHandler = () => {
    if (isConfirm && typeof isConfirm === 'function') {
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
    <ModalWrapper
      className={`${s['modal-wrap']} ${s['confirm']} ${
        positionCenter ? s.center : s['position-default']
      } ${height && s.height} `}
      background
      positionCenter={positionCenter}
      data-theme={theme}
    >
      {/*<div className={s.btn_close_modal} onClick={onCancleHandler}>*/}
      {/*  <CloseButton />*/}
      {/*</div>*/}
      <div className={s['title-section']}>
        {title ? (
          <>
            <p className={s.title}>{title}</p>
            {option.wordBreak ? (
              <p className={s.text}>{text}</p>
            ) : (
              <pre className={s.text}>{text}</pre>
            )}
          </>
        ) : (
          text &&
          (option.wordBreak ? (
            <p className={s.text}>{text}</p>
          ) : (
            <pre className={s.text}>{text}</pre>
          ))
        )}
        {caution && (
          <p className={s.caution_text}>
            {typeof caution === 'object'
              ? caution
              : caution.split('\n').map((line, index) => (
                  <React.Fragment key={index}>
                    {line}
                    <br />
                  </React.Fragment>
                ))}
          </p>
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
