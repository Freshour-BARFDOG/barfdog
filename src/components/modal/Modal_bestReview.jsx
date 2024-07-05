import s from './modal_bestReview.module.scss';
import React, { useEffect, useRef, useState } from 'react';
import zIndex from '/styles/module/zIndex.module.scss';
import rem from '/util/func/rem';
import CloseButton from '/src/components/atoms/CloseButton';
import ScrollContainer from '/src/components/atoms/ScrollContainer';

import Image from 'next/image';
import ArrowLeft from '/public/img/icon/swiper-arrow-medium.svg';
import ArrowRight from '/public/img/icon/swiper-arrow-medium.svg';
import RatingStars from '/src/components/atoms/RatingStars';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import axios from 'axios';
import { FullScreenLoading } from '../atoms/FullScreenLoading';
import { filter_blindingUserName } from '/util/func/filter_blindingUserName';

// const DUMMY_DATA = {
//   reviewDto: {
//     id: 39,
//     writtenDate: '2022-07-19',
//     star: 1,
//     username: '세바스찬',
//     contents:
//       '열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자 이상의 내용1열글자',
//   },
//   reviewImageDtoList: [
//     {
//       filename: 'filename1.jpg',
//       url: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=735&q=80',
//     },
//     {
//       filename: 'filename2.jpg',
//       url: 'https://images.unsplash.com/photo-1552053831-71594a27632d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=662&q=80',
//     },
//     {
//       filename: 'filename3.jpg',
//       url: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80',
//     },
//   ],
// };

export default function Modal_bestReview({
  isActiveModal,
  setIsActiveModal,
  reviewId,
}) {
  const [info, setInfo] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [btnStylesObj, setBtnStyleObj] = useState({});

  useEffect(() => {
    if (!reviewId) return;
    const url = `/api/reviews/${reviewId}/community`;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      const res = await axios
        .get(url, {
          headers: {
            'content-Type': 'application/json',
          },
        })
        .then((res) => {
          return res;
        })
        .catch((err) => {
          return err.response;
        });
      const data = res.data;
      // console.log(data);
      if (!data) return;
      const DATA = {
        id: data.reviewDto.id,
        writtenDate: data.reviewDto.writtenDate,
        star: data.reviewDto.star,
        username: data.reviewDto.username,
        contents: data.reviewDto.contents,
        imageList: data.reviewImageDtoList,
        titleByAdmin: data.reviewDto.titleByAdmin,
      };
      setInfo(DATA);
      // console.log(res);
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [reviewId]);

  useEffect(() => {
    setBtnStyleObj(closeButtonStyles(window.innerWidth));
  }, []);

  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (isActiveModal) {
      document.body.style.cssText = `
        position:fixed;
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
      <section
        className={`${s['modal-bestReview']} ${zIndex['modal-bestReview']}`}
      >
        <div
          className={s.background}
          onClick={onHideModalHandler}
          style={{ cursor: 'pointer' }}
        ></div>
        <div className={s.body}>
          <div className={s.container}>
            {isLoading.fetching && <FullScreenLoading />}
            <article className={s.card} data-id={info.id}>
              <i className={s.btn_close_modal} onClick={onHideModalHandler}>
                <CloseButton style={btnStylesObj} />
              </i>
              <div className={s.row1}>
                <span className={s.date}>{info.writtenDate}</span>
              </div>
              <Swiper_bestReview imgDataList={info.imageList} />

              <div className={s.swiper_review_top}>
                <div className={s.swiper_review_title}>
                  {info.titleByAdmin && <span>{info.titleByAdmin}</span>}
                </div>

                <div className={s.swiper_review_start}>
                  {/* 별 5개 */}
                  {[...Array(5)].map((_, index) => (
                    <>
                      <Image
                        src={'/img/icon/review-star.svg'}
                        alt="sns-insta"
                        width={18}
                        height={18}
                      />
                    </>
                  ))}
                </div>

                {/* [이전] 별 5개 */}
                {/* <i className={s.rating}>
                  <RatingStars count={5} size={15} margin={5} disabled />
                </i> */}
              </div>

              <figure className={s.cont}>
                <div className={s.row4}>
                  <ScrollContainer
                    className={s.row4_scroll}
                    height={220}
                    scrollBarWidth={
                      info?.contents?.trim().length > 300 ? '10' : '0'
                    }
                  >
                    {info.contents}
                  </ScrollContainer>
                  <div className={s.row3}>
                    <span className={s.name}>
                      {info.username?.includes('@')
                        ? info.username?.split('@')[0].trim()
                        : info.username}{' '}
                      보호자님
                    </span>
                    <span className={s.swiper_review_type}>
                      {info.orderType === 'item'
                        ? '일반구매'
                        : 'subscribe'
                        ? '정기구독'
                        : ''}
                    </span>
                  </div>
                </div>
              </figure>
            </article>
          </div>
        </div>
      </section>
    </>
  );
}

const Swiper_bestReview = ({ imgDataList }) => {
  const navPrevRef = useRef();
  const navNextRef = useRef();

  const swiperInit = true;
  const [isFirstSlide, setIsFirstSlide] = useState(swiperInit);
  const [isLastSlide, setIsLastSlide] = useState();

  const swiperSettings = {
    className: `${s.swiper_bestReivew}`,
    spaceBetween: 0,
    // loop: true,
    centeredSlides: true,
    slidesPerView: 1,
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Pagination, Navigation],
    pagination: {
      clickable: true,
    },
  };

  return (
    <div className={s.swiper_bestReview_outerWrap}>
      <i
        className={`${s['swiper-button-prev']} ${
          isFirstSlide ? s.invisible : ''
        }`}
        ref={navPrevRef}
      >
        <ArrowLeft />
      </i>
      <i
        className={`${s['swiper-button-next']} ${
          isLastSlide ? s.invisible : ''
        }`}
        ref={navNextRef}
      >
        <ArrowRight />
      </i>
      <Swiper
        {...swiperSettings}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.params.pagination.el.classList.add();
          swiper.params.pagination.el.classList.add();
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        onSlideChange={(e) => {
          const curIdx = e.activeIndex;
          const totalSlideCount = e.slides.length - 1;
          setIsFirstSlide(curIdx === 0);
          setIsLastSlide(curIdx === totalSlideCount);
        }}
      >
        {imgDataList?.map((data, index) => (
          <SwiperSlide key={`bestReview-inner-slide-${index + 1}`}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image
                src={data.url}
                objectFit="cover"
                layout="fill"
                alt={data.filename}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

// 닫기 버튼 반응형 시 ,크기 변형
const closeButtonStyles = (windowWidth) => {
  if (!windowWidth) return;

  let style;
  const triggeredWindowWidth = 600;

  style = {
    width: windowWidth > triggeredWindowWidth ? `${rem(20)}` : `${rem(10)}`,
    height: windowWidth > triggeredWindowWidth ? `${rem(20)}` : `${rem(10)}`,
  };
  return style;
};
