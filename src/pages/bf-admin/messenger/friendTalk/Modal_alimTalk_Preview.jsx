import React, {useState} from 'react';
import ModalWrapper from "/src/components/modal/ModalWrapper";
import PreviewFrame from "/public/img/preview-alimTalk.svg";
import s from './modal_alimTalk_preview.module.scss';
import CloseButton from "/src/components/atoms/CloseButton";
import rem from "/src/components/atoms/rem";



const TemplateContents = ({templateData}) => {
  const EmptyCont = ()=> <p>템플릿 이미지</p>
  return ( <div className={s['template-cont-wrap']}>
    {templateData || <EmptyCont/>}
  </div>)
}


const Modal_alimTalk_Preview = ({onModalActive, data}) => {
  const templateData = data.value || '임시데이터'; // _ 임시 데이터
  const onHideModal = () => {
    onModalActive(false);
  }
  return (
    <ModalWrapper
      background
      onBackgroundClick={onHideModal}
      style={{paddingTop: 0}}
      className={'animation-show'}
    >
      <div className={s['modal-inner']}>
        <header className={s['header']}>메시지 미리보기
          <CloseButton
            onClick={onHideModal}
            lineColor={'#fff'}
            style={{width: `${rem(24)}`, height: `${rem(24)}`}}
          />
        </header>
        <section className={s['body']}>
          <PreviewFrame/>
          <TemplateContents templateData={templateData}/>
        </section>
        <div className={s['btn_section']}>
          <button
            type="button"
            className="admin_btn confirm_l line"
            onClick={onHideModal}
          >
            닫기
          </button>
          <button
            type="submit"
            id="btn-create"
            className="admin_btn confirm_l solid"
          >
            전송하기
          </button>
        </div>

      </div>


    </ModalWrapper>)
}
export default Modal_alimTalk_Preview;