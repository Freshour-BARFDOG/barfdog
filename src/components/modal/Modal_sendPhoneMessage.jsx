import ModalWrapper from '@src/components/modal/ModalWrapper';
import CloseButton from '@src/components/atoms/CloseButton';
import ScrollContainer from '@src/components/atoms/ScrollContainer';
import React from 'react';
import s from './modal_previewRecipeThumb.module.scss'
const Modal_sendPhoneMessage = ({setModalState}) => {
  // 문자보낼 친구이름
  // 문자보낼 핸드폰번호입력란
  ///

  const onModalHide = ()=>{
    setModalState(false);
  }

  const onSendPhoneMessage = ()=>{
    console.log('메시지 전송')
  }



  return (
    <ModalWrapper background positionCenter className={'modal_sendPhoneMessage'} id={'modal'}>
      <CloseButton className={'top-close-button'} onClick={onModalHide}/>
      <div className="row">
        <section className={'title-section'}>
          <h2>문자보내기</h2>
        </section>
        <section className="cont-section">
          <ScrollContainer scrollBarWidth={'0'} height={'168'}>
            <p>[바프독]</p>
            <p>
              <span>{'회원이름'}</span>님이<span> {`친구이름`}</span>님에게 바프독 적립금을
              선물했습니다.
            </p>
            <p>가입 후 마이페이지에서 추천코드를 입력해주세요!</p>
            <p>
              추천코드 : <span>{`qe2r1234`}</span>
            </p>
            <p>
              가입하러가기 : <span>{`homePageURL`}</span>
            </p>
          </ScrollContainer>
        </section>
        <section className="btn-section">
          <button type={'button'} className={'btn line'} onClick={onModalHide}>취소</button>
          <button type={'button'} className={'btn solid'} onClick={onSendPhoneMessage}>확인</button>
        </section>
      </div>
    </ModalWrapper>
  );
};

export default Modal_sendPhoneMessage;