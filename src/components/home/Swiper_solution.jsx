// 리뷰 Swiper
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from '@src/pages/healthcare/kit/kit.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Lazy } from 'swiper';
import ArrowRight_m2 from '@public/img/icon/swiper-arrow-medium-style2.svg';
import Link from 'next/link';
import ArrowLeft_m from '@public/img/icon/swiper-arrow-medium.svg';
import ArrowRight_m from '@public/img/icon/swiper-arrow-medium2.svg';
import sorting from '@util/func/sorting';
import popupWindow from '@util/func/popupWindow';
// import { ArrowRight_m } from '@public/img/icon/swiper-arrow-medium-style2.svg';

const swiperSettings_solution = {
  className: `${s.swiper_solution}`,
  spaceBetween: 0,
  slidesPerView: 'auto',
  autoplay: { delay: 3000, disableOnInteraction: false },
  // loop: true,
  centeredSlides: false,
  pagination: {
    clickable: true,
  },
  navigation: true,
  // lazy: true,
  modules: [Autoplay, Pagination, Navigation, Lazy],
  breakpoints: {
    100: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    601: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    950: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1201: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
  },
};

export function Swiper_solution({ data }) {
  const arrangedData = sorting(data, 'leakedOrder');
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  // const [isMobile, setIsMobile] = useState(false);
  // const [isReachedEnd, setIsReachedEnd] = useState(false);

  // useEffect(() => {
  //   window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  // }, [isMobile, isReachedEnd]);

  // function hideMosolution(e) {
  //   const slideLength = e.slides.length;
  //   if (slideLength && e.realIndex !== slideLength) {
  //     setIsReachedEnd(false);
  //   }
  // }

  // function showMosolution() {
  //   setIsReachedEnd(true);
  // }

  return (
    <div className={s.swiper_solution_outerWrap}>
      <i className={s['swiper-button-prev']} ref={navPrevRef}>
        <ArrowLeft_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i>
      <i className={s['swiper-button-next']} ref={navNextRef}>
        <ArrowRight_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i>
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        // 슬라이드 변경될 때마다 active bullet 변화
        onSlideChange={(swiper) => {
          const pagination = swiper.pagination.el;
          const currentIdx = swiper.activeIndex;

          const bullets = Array.from(pagination.children);
          bullets.forEach((bullet, idx) => {
            bullet.style.backgroundColor =
              idx === currentIdx ? '#a3a3a3' : 'white';
          });
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.params.pagination.el.classList.add(
            'swiper-pagination__solutionSection',
          );
          swiper.params.pagination.el.classList.add(
            s['swiper-pagination__solutionSection'],
          );
          const initIndex = swiper.activeIndex;
          const bullets = Array.from(swiper.pagination.el.children);
          bullets.forEach((bullet, idx) => {
            bullet.style.backgroundColor =
              idx === initIndex ? '#a3a3a3' : 'white';
          });

          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        // onActiveIndexChange={hideMosolution}
        // onReachEnd={showMosolution}
        {...swiperSettings_solution}
      >
        <div className={s.solution_content}>
          <SwiperSlide className={s.swiper_solution_box}>
            <div className={s.solution_text_box}>
              <div className={s.solution_text_title}>
                <span>01. </span>
                <p>식이 솔루션 제공</p>
              </div>
              <p>
                기존 급여하고 계신 식단과 장내 환경을 종합적으로 분석한 결과를
                바탕으로 더 나은 식단 관리를 위한 전문적인 식이 솔루션을
                제공합니다
              </p>
            </div>
          </SwiperSlide>
          <SwiperSlide className={s.swiper_solution_box}>
            <div className={s.solution_text_box}>
              <div className={s.solution_text_title}>
                <span>02. </span>
                <p>질병 유발균 확인</p>
              </div>
              <p>
                피부질환, 장 질환(설사, 구토) 등 기타 질병을 유발할 수 있는
                유해균 보유 상황을 제공합니다
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide className={s.swiper_solution_box}>
            <div className={s.solution_text_box}>
              <div className={s.solution_text_title}>
                <span>03. </span>
                <p>유산균 종 검출 유무 확인</p>
              </div>
              <p>
                현재 급여 중인 유산균이 아이에게 알맞은 제품인지 파악할 수 있는
                유산균 종(19종) 검출 유무를 제공합니다
              </p>
            </div>
          </SwiperSlide>

          <SwiperSlide className={s.swiper_solution_box}>
            <div className={s.solution_text_box}>
              <div className={s.solution_text_title}>
                <span>04. </span>
                <p>장내 환경 변화 확인</p>
              </div>
              <p>
                검사를 할 때마다 분석 히스토리가 제공되어 주기적으로 반려견 장내
                환경 변화를 쉽게 파악할 수 있도록 도와드립니다
              </p>
            </div>
          </SwiperSlide>
        </div>
      </Swiper>
    </div>
  );
}

// const ArrowRight_withLink = () => {
//   const router = useRouter();

//   const onClickHandler = (e) => {
//     e.preventDefault();
//     router.push('/solution');
//   };

//   return <>{/* <ArrowRight_m /> */}</>;
// };
