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
import { getData } from '../../pages/api/reqData';

// const DUMMY_DATA_Reponse = {
//   data: {
//     _embedded: {
//       queryReviewImagesDtoList: [
//         {
//           filename: 'filename1.jpg',
//           url: 'https://images.unsplash.com/photo-1560713781-d00f6c18f388?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1981&q=80',
//         },
//         {
//           filename: 'filename2.jpg',
//           url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2070&q=80',
//         },
//         {
//           filename: 'filename3.jpg',
//           url: 'https://images.unsplash.com/photo-1505575967455-40e256f73376?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=987&q=80',
//         },
//       ],
//     }
//   },
// };

export default function Modal_singleReviewImages({ isActiveModal, setIsActiveModal, reviewId }) {
  const [imageList, setImageList] = useState({});
  const [isLoading, setIsLoading] = useState({});

  useEffect(() => {
    if (!reviewId) return;
    const url = `/api/reviews/${reviewId}/images`;
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      let res = await getData(url);
      // res = DUMMY_DATA_Reponse; // ! TEST
      // console.log(res);
      if (!res.data) return;
      const itemList = res.data._embedded.queryReviewImagesDtoList;
      setImageList(itemList);
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, [reviewId]);


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
      <section className={`${s['modal-singleReivew']} ${zIndex['modal-bestReview']}`}>
        <div
          className={s.background}
          onClick={onHideModalHandler}
          style={{ cursor: 'pointer' }}
        ></div>
        <div className={s.body}>
          <div className={s.container}>
            {isLoading.fetching && <FullScreenLoading />}
            <Swiper_reviewImages imageList={imageList} />
          </div>
        </div>
      </section>
    </>
  );
}

const Swiper_reviewImages = ({ imageList }) => {
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
        className={`${s['swiper-button-prev']} ${isFirstSlide ? s.invisible : ''}`}
        ref={navPrevRef}
      >
        <ArrowLeft />
      </i>
      <i
        className={`${s['swiper-button-next']} ${isLastSlide ? s.invisible : ''}`}
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
        {imageList.length > 0 && imageList?.map((data, index) => (
          <SwiperSlide key={`review-image-${index + 1}`}>
            <div className={`${s['img-wrap']} img-wrap`}>
              <Image src={data.url} objectFit="contain" layout="fill" alt={data.filename} />
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
    width: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
    height: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
  };
  return style;
};
