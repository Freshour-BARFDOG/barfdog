import Modal_confirm from '/src/components/modal/Modal_confirm';
import s from './modal_tempPassword.module.scss';
import React, {useEffect} from 'react';
import ModalWrapper from "@src/components/modal/ModalWrapper";
import {useRouter} from "next/router";

export const Modal_tempPasswrod = ({isConfirm}) => {
  
  const router = useRouter();
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
  
  const onCancleHandler = () => {
    if (isConfirm && typeof isConfirm === 'function') {
      isConfirm(false);
    }
  };
  const onConfirmHandler = () => {
    if (isConfirm && typeof isConfirm === 'function') {
      isConfirm(true);
    } else {
      router.push('/mypage/user/changePassword');
    }
  };
  
  
  return (
    <ModalWrapper id={s['temporary-password-modal']} positionCenter background>
      <div className={s['title-section']}>
        <p>회원님은 임시 비밀번호로 로그인하셨습니다.</p>
        <p>소중한 개인정보 보호를 위해 비밀번호를 변경해주세요.</p>
      </div>
      <div className={s['btn-section']}>
        <button className="admin_btn popup solid" onClick={onConfirmHandler}>비밀번호 변경</button>
        <button className={`admin_btn popup line ${s.cancel}`} onClick={onCancleHandler}>다음에 변경하기</button>
      </div>
    </ModalWrapper>
  )
};