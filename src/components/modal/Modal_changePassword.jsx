import React, {useEffect} from 'react';
import Link from 'next/link';
import s from './modal_changePassword.module.scss';
import ModalWrapper from '/src/components/modal/ModalWrapper';

export const Modal_changePassword = ({onHideModal, active}) => {
  
  useEffect(() => {
    const scrollYPos = window.scrollY;
    if(active){
      document.body.style.cssText = `
      overflow-y:scroll;
      position:fixed;
      top : -${scrollYPos}px;
    `;
    }
    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(scrollYPos));
    };
  }, [active]);
  
  
  
  return (
    <ModalWrapper
      positionCenter
      background
      className={s['modal-changePassword']}
    >
      <h4 className={s.title}>
        <pre>
          회원님은 임시 비밀번호로 로그인하셨습니다. <br/>소중한 개인정보 보호를 위해 비밀번호를
          변경해주세요.
        </pre>
      </h4>
      <div className={s['btn-section']}>
        <Link href={'/mypage/user/changePassword'}>
          <a className={`${s.btn} ${s.confirm}`} onClick={onHideModal}>비밀번호 변경</a>
        </Link>

        <button type={'button'} className={`${s.btn} ${s.cancel}`} onClick={onHideModal}>
          다음에 변경하기
        </button>
      </div>
    </ModalWrapper>
  );
};
