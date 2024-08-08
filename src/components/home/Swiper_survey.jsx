import React, { useEffect, useRef, useState } from 'react';
import s from '@src/pages/mainPage.module.scss';
import { Navigation, Pagination, Lazy, Autoplay } from 'swiper';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

const swiperSettings_survey = {
  className: `${s.swiper_survey}`,
  spaceBetween: 120,
  slidesPerView: 'auto',
  centeredSlides: true,
  pagination: {
    clickable: true,
  },
  lazy: true,
  modules: [Lazy, Pagination, Autoplay],
  autoplay: { delay: 3000, disableOnInteraction: false },
  breakpoints: {
    //반응형 조건 속성
    // 100: {
    //   slidesPerView: 1,
    //   spaceBetween: 20,
    // },
    // 901: {
    //   spaceBetween: 20,
    // },
    // 1201: {
    //   slidesPerView: 1,
    //   spaceBetween: 30,
    // },
  },
};

export function Swiper_survey() {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReachedEnd, setIsReachedEnd] = useState(false);

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile, isReachedEnd]);

  function hideMoreView(e) {
    const slideLength = e.slides.length;
    if (slideLength && e.realIndex !== slideLength) {
      setIsReachedEnd(false);
    }
  }

  function showMoreView() {
    setIsReachedEnd(true);
  }

  return (
    <div className={s.swiper_survey_outerWrap}>
      <Swiper
        onInit={(swiper) => {
          swiper.params.pagination.el.classList.add(
            'swiper-pagination__surveySection',
          );
          swiper.params.pagination.el.classList.add(
            s['swiper-pagination__surveySection'],
          );

          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        onActiveIndexChange={hideMoreView}
        onReachEnd={showMoreView}
        {...swiperSettings_survey}
      >
        {arrangedData.map((d, index) => (
          <SwiperSlide key={`survey-${index}`} className={s.swiper_survey_box}>
            <div className={s.swiper_survey_img}>
              <Image
                src={require(`/public/img/pages/main/AIstart${index + 1}.png`)}
                priority
                alt="카드 이미지"
              />
            </div>
            <div className={s.text_box}>
              {d.content1} <br />
              {d.content2} <br />
              {d.content3}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}
const arrangedData = [
  {
    id: 1,
    content1: '바프독 AI 맞춤 설문을 통해',
    content2: '우리 아이의 평소 모습을 알려주세요',
    content3: '(설문 소요시간 5분 내외)',
  },
  {
    id: 2,
    content1: '설문 내용을 기반으로 우리 아이만을 위한',
    content2: 'AI 맞춤 식단을 추천해 드립니다',
  },
  {
    id: 3,
    content1: '맞춤 식단은 구독 후 일정에 맞춰 배송되며',
    content2: '언제든 구성과 일정을 변경할 수 있습니다',
  },
];
