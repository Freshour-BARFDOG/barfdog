import React, { useEffect, useRef, useState } from 'react';
import s from './popup_review.module.scss';
import MetaTitle from '@src/components/atoms/MetaTitle';
import Image from 'next/image';
import PopupWrapper from '/src/components/popup/PopupWrapper';
import { PopupCloseButton, PopupCloseButton_typeX } from '/src/components/popup/PopupCloseButton';
import RatingStars from '/src/components/atoms/RatingStars';
import { ItemRecommendlabel } from '/src/components/atoms/ItemLabel';
import rem from '/util/func/rem';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import ArrowLeft from '/public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from '/public/img/icon/swiper-arrow-large-r.svg';
import Modal from '/src/components/modal/Modal';
import { useModalContext } from '/store/modal-context';
import Modal_alert, { Modal_innerForm } from '/src/components/modal/Modal_alert';
import {getData, postObjData} from '/src/pages/api/reqData';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import {global_reviewStateType} from "/store/TYPE/reviewStateType";



export default function ReviewDetailPage({ reviewId }) {
  
  const getReviewInfoApiUrl = `/api/admin/reviews/${reviewId}`;
  const postRegisterBestReviewApiUrl = '/api/admin/reviews/best';
  const apiDataQuery = 'reviewDto';

  
  
  
  const [isLoading, setIsLoading] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [reviewStatus, setReviewStatus] = useState('요청');
  // const [isBestReview, setIsBestReview] = useState(false);
  const [isRejectStart, setRejectStart] = useState(false);
  const [itemValues, setItemValues] = useState({});
  const modalInnerInputRef = useRef();
  //
  // console.log(itemValues);
  // console.log(isBestReview);
  // useEffect( () => {
  //   (async ()=>{
  //     const res = await getData('/api/admin/reviews/best');
  //     console.log(res);
  //   })();
  // }, [itemValues.bestReview] );
  

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getReviewInfoApiUrl);
        console.log(res)
        if(res.data[apiDataQuery]){
          const DATA = res.data[apiDataQuery];
          const initialValues = {
            id: DATA.id,
            status: DATA.status,
            writtenDate: DATA.writtenDate,
            star: DATA.star,
            contents: DATA.contents,
            username: filter_blindingUserName(DATA.username),
            imageList: res.data.imageUrlList,
            bestReview: res.bestReview
          };
          setItemValues(initialValues);
          global_reviewStateType.forEach((type) => {
            if (type.ENG === DATA.status) {
              setReviewStatus(type.KOR);
            }
          });
        }else{
          alert('데이터를 가져올 수 없습니다.');
        }

        
      } catch (err) {
        console.error(err);
        console.error(err.response);
        // alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [getReviewInfoApiUrl, itemValues.bestReview]);

  const navPrev_mainRef = useRef();
  const navNext_mainRef = useRef();

  const mcx = useModalContext();
  const MODAL_ACTIVE_STATE = mcx.isActive;

  const onHideModal = () => {
    mcx.onHide();
    setModalMessage('');
    setRejectStart(false);
  };
  const onShowModal = () => {
    mcx.onShow();
  };

  const swiperSettings = {
    className: s.swiper,
    spaceBetween: 0,
    loop: true,
    centeredSlides: true,
    autoplay: false,
    slidesPerView: 1,
    navigation: {
      prevEl: navPrev_mainRef.current,
      nextEl: navNext_mainRef.current,
    },
    modules: [Navigation],
  };

  const onConfirmHandler = () => {
    console.log('리뷰 승인요청');
    // API > 리뷰 승인하기
    if (confirm(`리뷰를 승인하시겠습니까?`)) {
      setReviewStatus('승인');
      setModalMessage('리뷰가 승인되었습니다.');
      onShowModal();
    }
  };

  const onShowRejectModal = () => {
    setRejectStart(true);
    setModalMessage('리뷰 반려 사유를 입력해주세요.');
    mcx.onShow();
  };

  const onRejectHandler = () => {
    console.log('리뷰 반려요청');
    // API > 리뷰 반려하기
    if (confirm(`선택된 리뷰를 반려하시겠습니까?`)) {
      setReviewStatus('반려');
      const value = modalInnerInputRef.current.value;
      console.log(value);
      setModalMessage('리뷰가 반려되었습니다.');
      onShowModal();
      setRejectStart(false);
    }
  };

  const onSelectBestReview = async () => {
    if (confirm(`베스트리뷰로 선정하시겠습니까?`)) {
      const reviewIdList = [Number(reviewId)]; // - requerst body Param은 배열
      const body = {
        reviewIdList
      }
      const res = await postObjData(postRegisterBestReviewApiUrl, body)
      console.log(res);
      if(res.isDone){
        setItemValues(prevState => ({
          ...prevState,
          bestReview: true,
        }))
        setModalMessage(`선택하신 ${reviewId}번 리뷰가 \n베스트 리뷰로 선정되었습니다.`);
        onShowModal();
      }
    }
  };
  
 
  
  const filter_blindingUserName = (name) => {
    let blindingUserName;
    if(!name)return console.error('Required Value');
    if(typeof name !== 'string') return console.error('Required String Value');
    const letters = name.split('');
    const lastIndex = letters.length - 1;
    
    
    if(letters.length === 2){
      letters.splice(1,1,'*').join('');
    
    } else  if(letters.length > 2){
      blindingUserName = letters.map((letter, index)=> (index >= 1 && index !== lastIndex)  ? '*' : letter).join('');
    }
    return blindingUserName;
  }
  
  if(!reviewId) {
    return <FullScreenLoading/>
  };

  return (
    <>
      <MetaTitle title="리뷰 상세내용 | 팝업" />
      <div id={s.popup}>
        <PopupWrapper style={{ width: 640 }}>
          <header className={s.header}>
            <div className={s.row}>
              <div className={s.cont}>
                <h1 className={s['popup-title']}>리뷰상세</h1>
                <PopupCloseButton_typeX />
              </div>
            </div>
          </header>
          <main className={s.body}>
            {itemValues.bestReview && (
              <ItemRecommendlabel
                className={'animation-show'}
                label={'BEST'}
                style={{
                  left: `${rem(8)}`,
                  top: `${rem(72)}`,
                  backgroundColor: 'var(--color-primary04)',
                }}
              />
            )}
            <div className={s.row}>
              <div className={s['status-section']}>
                <div className={`${s['col']} ${s['status-id-wrap']}`}>
                  <span className={s['status-title']}>리뷰고유번호:</span>
                  <span className={s['review-id']}>{itemValues.id}</span>
                </div>
                <div className={`${s['col']} ${s['status-list']}`}>
                  <div>
                    <span className={s['status-title']}>처리상태:</span>
                    <span className={`${s['status']} pointColor`}>{reviewStatus}</span>
                  </div>
                  <div>
                    <span className={s['status-title']}>베스트리뷰:</span>
                    <span className={`${s['isBestReview']} pointColor`}>
                      {itemValues.bestReview ? 'Y' : 'N'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={s['controls-section']}>
                {reviewStatus === '요청' && (
                  <button className={`admin_btn line basic_m`} onClick={onConfirmHandler}>
                    리뷰승인
                  </button>
                )}
                {reviewStatus === '요청' && (
                  <button className={`admin_btn line basic_m`} onClick={onShowRejectModal}>
                    리뷰반려
                  </button>
                )}
                {!itemValues.bestReview && reviewStatus !== '반려' && (
                  <button
                    className={`admin_btn line basic_m ${
                      reviewStatus === ('요청' || '반려') ? 'disabled' : 'confirmed'
                    }`}
                    onClick={onSelectBestReview}
                  >
                    베스트리뷰 선정
                  </button>
                )}
              </div>
              <div className={s['info-section']}>
                <div className={s['info-row']}>
                  <span className={s.date}>{itemValues.writtenDate || '작성된 날짜가 없습니다.'}</span>
                </div>
                <div className={s['info-row']}>
                  <h3 className={s.title}>{itemValues.contents}</h3>
                </div>
                <div className={s['info-row']}>
                  <span className={s.rating}>
                    <RatingStars
                      id={'star'}
                      count={itemValues.star}
                      margin={4}
                      size={15}
                      disabled={true}
                    />
                  </span>
                  <p>
                    작성자 : <span className={s.name}>{itemValues.username}</span>
                  </p>
                </div>
              </div>
              <div className={s['cont-section']}>
                <pre className={s.userText}>{itemValues.contents}</pre>
                <Swiper
                  {...swiperSettings}
                  onInit={(swiper) => {
                    swiper.params.navigation.prevEl = navPrev_mainRef.current;
                    swiper.params.navigation.nextEl = navNext_mainRef.current;
                    swiper.navigation.destroy();
                    swiper.navigation.init();
                    swiper.navigation.update();
                  }}
                >
                  <div className={s.swiper_navigation_container}>
                    <i className={s['swiper-button-prev']} ref={navPrev_mainRef}>
                      <ArrowLeft />
                    </i>

                    <i className={s['swiper-button-next']} ref={navNext_mainRef}>
                      <ArrowRight />
                    </i>
                  </div>
                  {itemValues.imageList?.length > 0 && itemValues.imageList.map((data, index) => {
                    return (
                      <SwiperSlide key={`image-${data.id}-${index}`}>
                        <div className={s.userImages}>
                          <figure className={s['img-wrap']}>
                            <Image
                              src={data.url}
                              objectFit="contain"
                              layout="fill"
                              alt={`${data.filename}`}
                            />
                          </figure>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </div>
          </main>
          <section className={s['btn-section']}>
            <PopupCloseButton />
          </section>
        </PopupWrapper>
      </div>
      {MODAL_ACTIVE_STATE && (
        <Modal background title={'유효성 처리'}>
          <Modal_alert text={modalMessage} onClick={onHideModal}>
            {isRejectStart && (
              <>
                <Modal_innerForm onCancle={onHideModal} onConfirm={onRejectHandler}>
                  <label htmlFor={'reasonForRejection'}>
                    <input
                      id={'reasonForRejection'}
                      placeholder={'반려사유'}
                      type={'text'}
                      ref={modalInnerInputRef}
                    />
                  </label>
                </Modal_innerForm>
              </>
            )}
          </Modal_alert>
        </Modal>
      )}
      {isLoading.fetching && <FullScreenLoading />}
    </>
  );
}

ReviewDetailPage.getInitialProps = async ({ query }) => {
  const { reviewId } = query;
  return { reviewId };
};
