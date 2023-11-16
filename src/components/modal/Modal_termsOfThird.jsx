import React, {useEffect} from 'react';
import ModalWrapper from './ModalWrapper';
import CloseButton from '../atoms/CloseButton';
import s from './modal_terms.module.scss';
import ScrollContainer from '/src/components/atoms/ScrollContainer';

const Modal_termsOfThird = ({ modalState, setModalState }) => {


  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (modalState) {
      document.body.style.cssText = `
        overflow-y:scroll;
        position:fixed;
        top : -${scrollYPos}px;
      `;
    }

    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, [modalState]);




  const onModalHide = () => {
    setModalState(false);
  };

  return (
    <ModalWrapper
      background
      className={s['modal-wrap']}
      positionCenter={true}
      onBackgroundClick={onModalHide}
    >
      <CloseButton className={s['x-button']} onClick={onModalHide} />
      <header className={s['title-section']}>
        <h3 className={s.title}>개인정보 제3자 제공동의</h3>
      </header>
      <section className={'body'}>
        <ScrollContainer className={s.scrollContainer} height={417} scrollBarWidth={'8'}>
          <h6>1. 제공받는 자 : 농업협동조합중앙회</h6>
          <h6>2. 제공받는 자의 이용목적 </h6>
○ 콕뱅크 내 바프독 서비스 제공
          <br />
          <h6>3. 제공할 개인정보의 항목 : 전화번호</h6>
          <h6>4. 제공받는 자의 개인정보 보유·이용기간</h6>
원칙적으로 개인정보 제공에 관한 동의일로부터 제공 목적이 달성될 때까지 보유·이용됩니다. 다만, 동의를 철회하거나 위 기간이 경과한 후에는 위에 기재된 이용 목적과 관련된 분쟁해결, 민원처리, 법령상 의무이행만을 위하여 동의를 철회한 날 또는 위 기간이 만료된 날부터 최장 3년의 범위 내에서만 「개인정보 보호법」 제21조제3항에 따라 다른 개인정보 파일과 분리하여 보유·이용됩니다.

<br />
          <h6>5. 동의를 거부할 권리 및 그에 따른 불이익의 내용</h6>
위 개인정보의 제공에 대한 동의를 거부할 권리가 있습니다. 다만, 위 개인정보의 제공에 관한 동의는 서비스 이용을 위한 필수적인 사항이므로 동의하지 않으시는 경우 서비스 이용이 불가합니다.



          <br />
          <br />
        </ScrollContainer>
      </section>
      <div className={s['btn-section']}>
        <button type={'button'} onClick={onModalHide}>
          확인
        </button>
      </div>
    </ModalWrapper>
  );
};

export default Modal_termsOfThird;
