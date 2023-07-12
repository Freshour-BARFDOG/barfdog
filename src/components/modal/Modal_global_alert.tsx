import React, { useEffect, useState } from 'react';
import s from './modal.module.scss';
import { useModalContext } from '@store/modal-context';
import ModalWrapper from './ModalWrapper';


interface PropsInterface {
  message?: string;
  onClick?: Function;
  background?: boolean;
}
export default function Modal_global_alert({ message, onClick, background, ...props }:PropsInterface) {
  
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const modalContextMessage = mct.message;
  const [style, setStyle] = useState({});
  const [targetScrollYPos, setTargetScrollYPos] = useState(null);
 
  

  useEffect(() => {
    callbackAfterAnimation(hasAlert);
    const scrollYPos = window.scrollY;
    if (hasAlert) {
      document.body.style.cssText = `
      position:fixed;
      top : -${scrollYPos}px;
    `;
      setTargetScrollYPos(scrollYPos);
      window.scrollTo(0, parseInt(scrollYPos || targetScrollYPos));
    }
    return () => {
      document.body.style.cssText = ``;
      window.scrollTo(0, parseInt(scrollYPos || targetScrollYPos)); // alert가 unmounted 되고,  body의 fixed styled이 사라지면서, scrollY position이 화면 최상단으로 변경되는 것을 막음
    };
  }, [hasAlert]);

  const callbackAfterAnimation = (modalState) => {
    const delay = modalState ? 0 : 500;
    setTimeout(() => {
      setStyle({ display: modalState ? 'block' : 'none' });
    }, delay);
  };
 
  // KEYBOARD EVENT
  useEffect(() => {
    if (window && typeof window !== 'undefined' && hasAlert) {
      document.documentElement.addEventListener('keydown', keyDownHandler);
    }
    return ()=>{
      // console.log('Unmounted global alert && Delete keydown Event');
      document.documentElement.removeEventListener('keydown', keyDownHandler);
    }
  }, []);
  
  
  
  const keyDownHandler = (event) => {
    //////////////////////////////////
    // ! esc key는 enterkey 이벤트와 달리, callback event발생이 안되므로, 삭제함 (221103목)
    // const escKey = event.keyCode === 27;
    //////////////////////////////////
    const enterKey = event.keyCode === 13;
  
    // ! validation: alert외에 다른 elem의 enterKey 이벤트와 겹치지 않기 위함
    const hasEventHandler = (onClick && typeof onClick === 'function');
    const mctCallback = mctCallbackObj();
  
    
    
    if (enterKey) {
      if(mctCallback.hasCallback || hasEventHandler) {
        executeHandler();
      }
      document.documentElement.removeEventListener('keydown', keyDownHandler);
    }
    
    
  };

  
  const executeHandler = () => {
    const mctCallback = mctCallbackObj();
    if(mctCallback.hasCallback){
      mctCallback.callback();
    } else if (onClick && typeof onClick === 'function') {
      onClick();
    } else {
      mct.alertHide();
    }
  };
  
  
  const mctCallbackObj = ()=>{
    let result = {
      hasCallback: false,
      callback: null,
    };
    for (const key in mct.callback) {
      const cb = mct.callback[key];
      if(cb && typeof cb ==='function'){
        result.hasCallback = true;
        result.callback = cb;
      }
    }
    return result;
  }
  
  
  
  return (
    <>
      <ModalWrapper
        className={`${s['modal_wrap']} ${s['global']} ${hasAlert ? 'active' : 'inactive'}`}
        label="Modal Global Alert"
        {...props}
      >
        <div className={s['body']} style={hasAlert ? { display: 'flex' } : style}>
          <header className={s['title-section']}>
            <pre className={`${s.text} ${s.only}`}>{message || modalContextMessage}</pre>
          </header>
          <div className={s['btn-section']}>
            <button onClick={executeHandler}>확인</button>
          </div>
        </div>
      </ModalWrapper>
      {hasAlert && background && <section className={s.background} />}
    </>
  );
}
