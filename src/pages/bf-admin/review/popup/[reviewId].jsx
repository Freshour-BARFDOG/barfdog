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
import { useModalContext } from '/store/modal-context';
import Modal_alert, { Modal_innerForm } from '/src/components/modal/Modal_alert';
import {getData, postObjData, putObjData} from '/src/pages/api/reqData';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import { reviewStatus } from '/store/TYPE/reviewStateType';




export default function ReviewDetailPage({ reviewId }) {
  const getReviewInfoApiUrl = `/api/admin/reviews/${reviewId}`;

  const [isLoading, setIsLoading] = useState({});
  const [modalMessage, setModalMessage] = useState('');
  const [isRejectStart, setRejectStart] = useState(false);
  const [info, setInfo] = useState({});
  const returnReasonInputRef = useRef();

  useEffect(() => {
    (async () => {
      try {
        setIsLoading((prevState) => ({
          ...prevState,
          fetching: true,
        }));
        const res = await getData(getReviewInfoApiUrl);
        // const res = DUMMY_RESPONSE;
        console.log(res);
        if (res.data?.reviewDto) {
          const DATA = res.data.reviewDto;
          const initInfo = {
            id: DATA.id,
            status: DATA.status,
            writtenDate: DATA.writtenDate,
            star: DATA.star,
            contents: DATA.contents,
            username: filter_blindingUserName(DATA.username),
            imageList: res.data.imageUrlList,
            bestReview: res.data.bestReview,
          };
          setInfo(initInfo);
        } else {
          alert('데이터를 가져올 수 없습니다.');
        }
      } catch (err) {
        // console.error(err);
        console.error(err.response);
        // alert('데이터를 가져올 수 없습니다.');
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [getReviewInfoApiUrl, info.bestReview]);

  const navPrev_mainRef = useRef();
  const navNext_mainRef = useRef();
  
  
  
  const onHideModal = () => {
    setModalMessage('');
    setRejectStart(false);
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

  const onApprovalReview = async () => {
    if (!confirm(`리뷰를 승인처리 하시겠습니까?`)) return;

    try {
      setIsLoading({ approval: true });
      const body = {
        reviewIdList: [reviewId],
      };
      const apiUrl = '/api/admin/reviews/approval';
      const res = await putObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        alert('선택된 리뷰가 승인처리 되었습니다.');
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading({ approval: false });
  };

  const onShowRejectModal = () => {
    setRejectStart(true);
    setModalMessage('리뷰 반려 사유를 입력해주세요.');
  };

  const onRejectHandler = async () => {
    const reason = returnReasonInputRef.current.value;
    if(!reason)return alert('반려사유를 입력하세요.');
    if (!confirm(`선택된 리뷰를 반려하시겠습니까?`)) return;
    
    try {
      setIsLoading({return: true});
      const body = {
        returnReason: reason
      }
      const apiUrl = `/api/admin/reviews/${reviewId}/return`;
      const res = await putObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        alert('리뷰가 반려처리 되었습니다.');
        setRejectStart(false);
        window.location.reload();
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading({return: false})
  };
  
  const onSetBestReview = async () => {
    if(!confirm(`베스트리뷰로 등록하시겠습니까?`)) return;
    
    try {
      setIsLoading({bestReview: true});
      const body = {
        reviewIdList: [reviewId]
      }
      const apiUrl = '/api/admin/reviews/best';
      const res = await postObjData(apiUrl, body);
      console.log(res);
      if (res.isDone) {
        alert(`베스트리뷰로 등록되었습니다.`);
        window.location.reload();
      }
    } catch (err) {
      console.error(err)
    }
    setIsLoading({bestReview: false})
  };
  
  const filter_blindingUserName = (name) => {
    let blindingUserName;
    if (!name) return console.error('Required Value');
    if (typeof name !== 'string') return console.error('Required String Value');
    const letters = name.split('');
    const lastIndex = letters.length - 1;
    
    if (letters.length === 2) {
      blindingUserName = letters
        .map((letter, index) => (index >= 1 ? '*' : letter))
        .join('');
    } else if (letters.length > 2) {
      blindingUserName = letters
        .map((letter, index) => (index >= 1 && index !== lastIndex ? '*' : letter))
        .join('');
    }
    return blindingUserName;
  };
  
  if (isLoading.fetching) {
    return <FullScreenLoading />;
  }

  // console.log(info);

  return (
    <>
      <MetaTitle title="리뷰 상세내용" admin={true} />
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
            {info.bestReview && (
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
                  <span className={s['review-id']}>{info.id}</span>
                </div>
                <div className={`${s['col']} ${s['status-list']}`}>
                  <div>
                    <span className={s['status-title']}>처리상태:</span>
                    <span className={`${s['status']} pointColor`}>
                      {reviewStatus.KOR[info.status]}
                    </span>
                  </div>
                  <div>
                    <span className={s['status-title']}>베스트리뷰:</span>
                    <span className={`${s['isBestReview']} pointColor`}>
                      {info.bestReview ? 'Y' : 'N'}
                    </span>
                  </div>
                </div>
              </div>
              <div className={s['controls-section']}>
                {info.status === reviewStatus.REQUEST && (
                  <button className={`admin_btn line basic_m`} onClick={onApprovalReview}>
                    리뷰승인
                  </button>
                )}
                {info.status === reviewStatus.REQUEST && (
                  <button className={`admin_btn line basic_m`} onClick={onShowRejectModal}>
                    리뷰반려
                  </button>
                )}
                {!info.bestReview && info.status !== reviewStatus.RETURN && (
                  <button
                    className={`admin_btn line basic_m autoWidth ${
                      info.status === (reviewStatus.REQUEST || reviewStatus.RETURN)
                        ? 'disabled'
                        : 'confirmed'
                    }`}
                    onClick={onSetBestReview}
                  >
                    베스트리뷰 선정
                  </button>
                )}
              </div>
              <div className={s['info-section']}>
                <div className={s['info-row']}>
                  <span className={s.date}>{info.writtenDate || '작성된 날짜가 없습니다.'}</span>
                </div>
                <div className={s['info-row']}>
                  <h3 className={s.title}>{info.contents}</h3>
                </div>
                <div className={s['info-row']}>
                  <span className={s.rating}>
                    <RatingStars
                      id={'star'}
                      count={info.star}
                      margin={4}
                      size={15}
                      disabled={true}
                    />
                  </span>
                  <p>
                    작성자 : <span className={s.name}>{info.username}</span>
                  </p>
                </div>
              </div>
              <div className={s['cont-section']}>
                <pre className={s.userText}>{info.contents}</pre>
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
                  {info.imageList?.length > 0 &&
                    info.imageList.map((data, index) => {
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
      {isRejectStart && (
        <Modal_alert text={modalMessage}>
          <Modal_innerForm onCancel={onHideModal} onConfirm={onRejectHandler}>
            <label htmlFor={'reasonForRejection'}>
              <input
                id={'reasonForRejection'}
                placeholder={'반려사유'}
                type={'text'}
                ref={returnReasonInputRef}
              />
            </label>
          </Modal_innerForm>
        </Modal_alert>
      )}
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { reviewId } = query;

  return { props: { reviewId } };
}


// const DUMMY_RESPONSE = {
//   data: {
//     reviewDto: {
//       id: 523,
//       status: 'APPROVAL',
//       writtenDate: '2022-08-13',
//       star: 3,
//       username: '관리자',
//       contents: '열글자 이상의 구독 리뷰11',
//     },
//     imageUrlList: [
//       {
//         filename: 'filename1.jpg',
//         url: 'https://images.unsplash.com/photo-1661704107314-b603320832be?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//       },
//     ],
//     bestReview: false,
//     _links: {
//       self: {
//         href: 'http://localhost:8080/api/admin/reviews/523',
//       },
//       create_best_reviews: {
//         href: 'http://localhost:8080/api/admin/reviews/best',
//       },
//       approve_reviews: {
//         href: 'http://localhost:8080/api/admin/reviews/approval',
//       },
//       return_review: {
//         href: 'http://localhost:8080/api/admin/reviews/523/return',
//       },
//       profile: {
//         href: '/docs/index.html#resources-admin-query-review',
//       },
//     },
//   },
// };
