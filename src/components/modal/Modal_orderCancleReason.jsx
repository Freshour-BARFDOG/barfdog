import ModalWrapper from './ModalWrapper';
import s from './modal_orderCancelReason.module.scss';
import CloseButton from '../atoms/CloseButton';
import React, {useState} from 'react';

export const Modal_orderCancleReason = ({ id, setActiveModal, onConfirm }) => {
  const [reason, setReason] = useState( '' );
  const onHideModal = () => {
    setActiveModal({
      [id]: false,
    });
  };
  
  const onConfirmHandler = ()=>{
    if(onConfirm && typeof onConfirm === 'function'){
      onConfirm(reason)
    }
    
  }
  
  const onInputChange = (e)=>{
    const {value} = e.currentTarget;
    setReason(value);
  }
  return (
    <ModalWrapper background positionCenter>
      <CloseButton onClick={onHideModal} className={s['close-button']} />
      <section className={s['title-section']}>
        <h4 className={s.title}>판매취소 사유를 입력해주세요.</h4>
      </section>
      <section className={s['body-section']}>
        <input type={'text'} placeholder={'판매 취소사유'} onChange={onInputChange} />
      </section>
      <section className={s['btn-section']}>
        <button type={'button'} className={'admin_btn line popup'} onClick={onHideModal}>
          취소
        </button>
        <button type={'button'} className={'admin_btn solid popup'} onClick={onConfirmHandler}>
          확인
        </button>
      </section>
    </ModalWrapper>
  );
};
