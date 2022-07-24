// import s from '/src/pages/cart/ordersheet.module.scss';
import s from './modal_coupon.module.scss';
import React from 'react';
import ModalWrapper from './ModalWrapper';
import rem from "/util/func/rem";

export const Modal_coupon = ({onModalActive, data, className}) => {
  
  const templateData = '임시데이터'; // _ 임시 데이터
  const onHideModal = () => {
    onModalActive(false);
  }
  
  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        className={s['modal-container']} positionCenter>
        <section className={s.modal}>
          <div className={s.title_box}>
            <div className={s.title}>
              적용가능쿠폰 <span>쿠폰은 최대 1장까지 적용가능합니다.</span>
            </div>
          </div>
          <div className={s.content_box}>
            <div className={s.flex_box}>
              <div>쿠폰명</div>
              <div>적용가능수량</div>
              <div>유효기간</div>
              <div>할인금액</div>
            </div>
          </div>

          <div className={s.content_box}>
            <div className={s.flex_box2}>
              <div className={s.check_box}>
                <input type="radio" name="" id="" />
              </div>
              <div className={s.name_box}>
                <div className={s.name}>등급쿠폰 10%할인</div>
                <div className={s.count}><span>&nbsp;·&nbsp;</span>1개</div>
              </div>
              <div className={s.date}> <span>~</span> 2022.12.31</div>
              <div className={s.price}>1,640원</div>
            </div>
          </div>

          
          <div className={s.content_box}>
            <div className={s.flex_box2}>
              <div className={s.check_box}>
                <input type="radio" name="" id="" />
              </div>
              <div className={s.name_box}>
                <div className={s.name}>등급쿠폰 10%할인</div>
                <div className={s.count}><span>&nbsp;·&nbsp;</span>1개</div>
              </div>
              <div className={s.date}> <span>~</span> 2022.12.31</div>
              <div className={s.price}>1,640원</div>
            </div>
          </div>

          <div className={s.btn_box}>
            <div className={s.cancle_btn}>취소</div>
            <div className={s.choice_btn}>쿠폰적용</div>
          </div>
        </section>
      </ModalWrapper>
    </>
  );
};
