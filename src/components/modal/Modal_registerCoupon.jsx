import React, { useEffect, useRef, useState } from 'react';
import s from './modal_mypage_coupon.module.scss';
import Image from 'next/image';
import Link from 'next/link';
import ModalWithBackground from './Modal';
import ModalWrapper from './ModalWrapper';
import { putObjData } from '../../pages/api/reqData';
import Spinner from '../atoms/Spinner';

export const Modal_registerCoupon = ({isLoading, form, onChange, isActiveModal, setIsActiveModal, event }) => {
  
  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (isActiveModal) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        width:100%;
        top : -${scrollYPos}px;
      `;
    }

    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, [isActiveModal]);

  const onHideModalHandler = () => {
    setIsActiveModal(false);
  };
  
  return (
    <>
      <ModalWrapper
        id={s['modal-register-coupon']}
        background
        onBackgroundClick={onHideModalHandler}
        positionCenter
      >
        <h3 className={s.title}>
          쿠폰 등록을 위해 <br />
          비밀번호를 입력해주세요.
        </h3>
        <div className={s['input-wrap']}>
          <input id={'pw'} type="password" placeholder={'비밀번호 입력'}  value={form.pw || ''} onChange={onChange}/>
        </div>
        <div className={s['btn-section']}>
          <button type={'button'} className={s.btn} onClick={event}>
            {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '확인'}
          </button>
        </div>
      </ModalWrapper>
    </>
  );
};
