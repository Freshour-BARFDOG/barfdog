import React, {useRef, useState} from 'react';
import s from "./popup_review.module.scss";
import MetaTitle from "@src/components/atoms/MetaTitle";
import Image from "next/image";
import PopupWrapper from "/src/components/popup/PopupWrapper";
import {PopupCloseButton, PopupCloseButton_typeX} from "/src/components/popup/PopupCloseButton";
import RatingStars from "/src/components/atoms/RatingStars";
import {ItemRecommendlabel} from "/src/components/atoms/ItemLabel";
import rem from "/src/components/atoms/rem";

import {Swiper, SwiperSlide} from "swiper/react";
import {Navigation} from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import ArrowLeft from "/public/img/icon/swiper-arrow-large-l.svg";
import ArrowRight from "/public/img/icon/swiper-arrow-large-r.svg";
import Modal from "/src/components/modal/Modal";
import {useModalContext} from "/store/modal-context";
import Modal_alert, { Modal_innerForm } from "/src/components/modal/Modal_alert";










const allDATA = [{link: 'https://images.unsplash.com/photo-1654124803072-3198bd80d438?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1024&q=80'}, {link: 'https://images.unsplash.com/photo-1638913662415-8c5f79b20656?ixlib=rb-1.2.1&ixid=MnwxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1740&q=80'}, {link: 'https://images.unsplash.com/photo-1654187808886-f52d45d8cd0c?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80'}]




function ReviewDetailPage() {

  const [reviewStatus, setReviewStatus] = useState('요청');
  const [isBestReview, setIsBestReview] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [isRejectStart, setRejectStart] = useState(false);
  const modalInnerInputRef = useRef();


  const navPrev_mainRef = useRef();
  const navNext_mainRef = useRef();

  const mcx = useModalContext();
  const MODAL_ACTIVE_STATE = mcx.isActive;

  const onHideModal = () => {
    mcx.onHide();
    setModalMessage('');
    setRejectStart(false);
  }
  const onShowModal = () => {
    mcx.onShow();
  }

  const swiperSettings = {
    className: s.swiper, spaceBetween: 0, loop: true, centeredSlides: true, autoplay: false, slidesPerView: 1,
    navigation: {
      prevEl: navPrev_mainRef.current, nextEl: navNext_mainRef.current,
    }, modules: [Navigation],
  };
  const convertedText = 'Textarea입력된 리뷰내용 출력 \n 서버에서 받은 Text \n 줄바꿈처리 \n';

  const onConfirmHandler = () => {
    console.log('리뷰 승인요청');
    // API > 리뷰 승인하기
    if (confirm(`리뷰를 승인하시겠습니까?`)) {
      setReviewStatus('승인');
      setModalMessage('리뷰가 승인되었습니다.');
      onShowModal();
    };
  }


  const onShowRejectModal = ()=>{
    setRejectStart(true);
    setModalMessage('리뷰 반려 사유를 입력해주세요.');
    mcx.onShow();

  }

  const onRejectHandler = () => {
    console.log('리뷰 반려요청');
    // API > 리뷰 반려하기
    if (confirm(`선택된 리뷰를 반려하시겠습니까?`)) {
      setReviewStatus('반려');
      const value = modalInnerInputRef.current.value;
      console.log(value);
      setModalMessage('리뷰가 반려되었습니다.');
      setRejectStart(false);
    };
  }

  const onSelectBestReview = () => {
    if (confirm(`베스트리뷰로 선정하시겠습니까?`)) {
      setIsBestReview(true);
      setModalMessage('선택하신 리뷰(ID:1234)가 \n베스트 리뷰로 선정되었습니다.');
      onShowModal();
    };
  }




  return (<>
    <MetaTitle title="리뷰 상세내용 | 팝업"/>
    <div id={s.popup}>
      <PopupWrapper style={{width: 640}}>
        <header className={s.header}>
          <div className={s.row}>
            <div className={s.cont}>
              <h1 className={s["popup-title"]}>리뷰상세</h1>
              <PopupCloseButton_typeX/>
            </div>
          </div>
        </header>
        <main className={s.body}>
          {isBestReview && <ItemRecommendlabel className={'animation-show'} label={'BEST'} style={{
            left: `${rem(8)}`, top: `${rem(72)}`, backgroundColor: 'var(--color-primary04)'
          }}/>}
          <div className={s.row}>
            <div className={s['status-section']}>
              <div className={`${s['col']} ${s['status-id-wrap']}`}>
                <span className={s['status-title']}>리뷰고유번호:</span>
                <span className={s['review-id']}>561234</span>
              </div>
              <div className={`${s['col']} ${s['status-list']}`}>
                <div>
                  <span className={s['status-title']}>처리상태:</span>
                  <span className={`${s['status']} pointColor`}>{reviewStatus}</span>
                </div>
                <div>
                  <span className={s['status-title']}>베스트리뷰:</span>
                  <span className={`${s['isBestReview']} pointColor`}>{isBestReview ? 'Y' : 'N'}</span>
                </div>
              </div>
            </div>
            <div className={s['controls-section']}>
              {reviewStatus === '요청' &&
                <button className={`admin_btn line basic_m`} onClick={onConfirmHandler}>리뷰승인</button>}
              {reviewStatus === '요청' &&
                <button className={`admin_btn line basic_m`} onClick={onShowRejectModal}>리뷰반려</button>}
              {!isBestReview && (reviewStatus !== '반려') && <button
                className={`admin_btn line basic_m ${reviewStatus === ('요청' || '반려') ? 'disabled' : 'confirmed'}`}
                onClick={onSelectBestReview}>베스트리뷰 선정</button>}
            </div>
            <div className={s['info-section']}>
              <div className={s['info-row']}>
                <span className={s.date}>2022.01.20</span>
              </div>
              <div className={s['info-row']}>
                <h3 className={s.title}>굿굿 너무 좋아요</h3>
              </div>
              <div className={s['info-row']}>
                <span className={s.rating}><RatingStars count={4} size={15} margin={4}/></span>
                <p>작성자 : <span className={s.name}>김바프</span></p>
              </div>
            </div>
            <div className={s['cont-section']}>
              <pre className={s.userText}>{convertedText}</pre>
              <Swiper
                {...swiperSettings}
                onInit={(swiper) => {
                  swiper.params.navigation.prevEl = navPrev_mainRef.current;
                  swiper.params.navigation.nextEl = navNext_mainRef.current;
                  swiper.navigation.destroy();
                  swiper.navigation.init();
                  swiper.navigation.update();
                  // swiper.pagination.destroy();
                  // swiper.pagination.init();
                  // swiper.pagination.update();
                }}
              >
                <div className={s.swiper_navigation_container}>
                  <i className={s["swiper-button-prev"]} ref={navPrev_mainRef}>
                    <ArrowLeft/>
                  </i>

                  <i
                    className={s["swiper-button-next"]}
                    ref={navNext_mainRef}
                  >
                    <ArrowRight/>
                  </i>
                </div>
                <label htmlFor=""></label>
                {allDATA.map((data, index) => {
                  return (<SwiperSlide key={`image-${index}`}>
                    <div className={s.userImages}>
                      <figure className={s['img-wrap']}>
                        <Image
                          src={data.link}
                          objectFit="contain"
                          layout="fill"
                          alt={`리뷰 이미지`}
                        />
                      </figure>
                    </div>
                  </SwiperSlide>)
                })}
              </Swiper>
            </div>
          </div>
        </main>
        <section className={s["btn-section"]}>
          <PopupCloseButton/>
        </section>
      </PopupWrapper>
    </div>
    {MODAL_ACTIVE_STATE && (
      <Modal background title={'유효성 처리'}>
        <Modal_alert text={modalMessage} onClick={onHideModal}>
          {isRejectStart && (<>
            <Modal_innerForm onCancle={onHideModal} onConfirm={onRejectHandler}>
              <label htmlFor={'reasonForRejection'}>
                <input
                  id={'reasonForRejection'}
                  placeholder={"반려사유"}
                  type={'text'}
                  ref={modalInnerInputRef}
                />
              </label>
            </Modal_innerForm></>)
          }

        </Modal_alert>
      </Modal>)
    }

  </>)
}
// form > 취소버튼 / 확인버튼 -> value가져오기

export default ReviewDetailPage;