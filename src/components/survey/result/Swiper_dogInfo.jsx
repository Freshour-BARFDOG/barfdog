// 리뷰 Swiper
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from './surveyStatistics.module.scss';
import { Navigation, Pagination, Lazy } from 'swiper';
import Link from 'next/link';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export function Swiper_dogInfo({ data }) {
  //   const arrangedData = sorting(data, 'leakedOrder');
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReachedEnd, setIsReachedEnd] = useState(false);

  const swiperSettings_review = {
    className: `${s.swiper_dogInfo}`,
    spaceBetween: 120,
    slidesPerView: 1,
    // loop: true,
    centeredSlides: true,
    pagination: {
      clickable: true,
    },
    lazy: true,
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Lazy, Navigation],
    breakpoints: {
      //   300: {
      //     slidesPerView: 1,
      //     spaceBetween: 0,
      //   },
      //   600: {
      //     spaceBetween: 100,
      //   },
      //   1001: {
      //     slidesPerView: 3,
      //     spaceBetween: 20,
      //   },
      // 1201: {
      //   slidesPerView: 2,
      //   spaceBetween: 50,
    },
  };

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile, isReachedEnd]);

  //   function hideMoreView(e) {
  //     const slideLength = e.slides.length;
  //     if (slideLength && e.realIndex !== slideLength) {
  //       setIsReachedEnd(false);
  //     }
  //   }

  //   function showMoreView() {
  //     setIsReachedEnd(true);
  //   }

  console.log(data);

  return (
    <div className={s.swiper_dogInfo_outerWrap}>
      <i className={s.swiper_button_prev_sns} ref={navPrevRef}>
        <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <i className={s.swiper_button_next_sns} ref={navNextRef}>
        <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <Swiper
        // onActiveIndexChange={hideMoreView}
        // onReachEnd={showMoreView}
        {...swiperSettings_review}
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {/* 1. 키 */}
        <SwiperSlide key={`dogTypeInfo-1`} className={s.swiper_dogInfo_box}>
          <div className={s.swiper_dogInfo_img}>
            <Image
              src={'/img/survey/statistics/height.png'}
              alt="height"
              width={108 * 1.4}
              height={80 * 1.4}
            />
          </div>

          <div className={s.swiper_dogInfo_txt}>
            <h4>키</h4>
            <div className={s.txt_content_wrapper}>
              <span>최소</span>
              <span className={s.txt_content}>
                {data?.height?.min + ' cm' || '-'}{' '}
              </span>
            </div>
            <div className={s.txt_content_wrapper}>
              <span>최대</span>
              <span className={s.txt_content}>
                {data?.height?.max + ' cm' || '-'}
              </span>
            </div>
          </div>
        </SwiperSlide>

        {/* 2. 몸무게 */}
        <SwiperSlide
          key={`dogTypeInfo-1`}
          className={`${s.swiper_dogInfo_box} ${s.weight_box}`}
        >
          <div className={s.swiper_dogInfo_img}>
            <Image
              src={'/img/survey/statistics/weight.png'}
              alt="weight"
              width={108 * 1.2}
              height={80 * 1.2}
            />
          </div>

          <div className={s.swiper_dogInfo_txt}>
            <h4>몸무게</h4>
            <div className={s.txt_content_wrapper}>
              <span>최소</span>
              <span className={s.txt_content}>
                {data?.weight?.min + ' kg' || '-'}{' '}
              </span>
            </div>
            <div className={s.txt_content_wrapper}>
              <span>최대</span>
              <span className={s.txt_content}>
                {data?.weight?.max + ' kg' || '-'}
              </span>
            </div>
          </div>
        </SwiperSlide>

        {/* 3. 많이 걸리는 질병 */}
        <SwiperSlide
          key={`dogTypeInfo-1`}
          className={`${s.swiper_dogInfo_box} ${s.disease_box}`}
        >
          <div className={s.swiper_dogInfo_img}>
            <Image
              src={'/img/survey/statistics/disease.png'}
              alt="disease"
              width={108 * 1.2}
              height={80 * 1.2}
            />
          </div>

          <div className={`${s.swiper_dogInfo_txt} ${s.disease_wrapper}`}>
            <h4>많이 걸리는 질병</h4>
            <div className={s.txt_content_wrapper}>
              <span>최소</span>
              <span className={s.txt_content}>
                {data?.weight?.min + ' kg' || '-'}{' '}
              </span>
            </div>
            <div className={s.txt_content_wrapper}>
              <span>최대</span>
              <span className={s.txt_content}>
                {data?.weight?.max + ' kg' || '-'}
              </span>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
