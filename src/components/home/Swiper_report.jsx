// report Swiper
import React, { useEffect, useRef, useState } from 'react';
import Styles from '@src/pages/healthcare/kit/kit.module.scss';
import { Navigation, Autoplay } from 'swiper';
// import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
// import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export function Swiper_report() {
  const swiperSettings_report = {
    className: `${Styles.swiper_report}`,
    spaceBetween: 20,
    speed: 3000,
    loop: true,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: true,
      stopOnLastSlide: false,
    },
    slidesPerView: 'auto',
    // loopedSlides: 10, //noSwiping : true,
    // loopAdditionalSlides: 1,

    modules: [Autoplay],
    breakpoints: {
      100: {
        slidesPerView: 2,
      },
      400: {
        slidesPerView: 2,
      },
      601: {
        slidesPerView: 4,
      },
      1201: {
        slidesPerView: 6,
      },
    },
  };

  return (
    <div className={Styles.swiper_report_outerWrap}>
      <Swiper
        {...swiperSettings_report}
        onInit={(swiper) => {
          const swiperWrapper = swiper.wrapperEl;
          if (swiperWrapper) {
            swiperWrapper.style.transitionTimingFunction = 'linear';
          }
        }}
      >
        {imageSources.slice(0, 9).map((item, index) => (
          <SwiperSlide
            className={Styles.swiper_report_box}
            key={`insta-image-source-${index}`}
          >
            <div className={Styles.swiper_report_img}>
              <Image
                src={item.src1}
                objectFit="cover"
                // width={244}
                // height={244}
                alt={`바프독 이미지1-${item.src1}`}
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const imageSources = [];

// 파일명의 배열 생성
const filenames1 = Array.from({ length: 10 }, (_, i) => `${i + 1}.jpg`);

// 파일명을 사용하여 이미지를 배열에 추가
filenames1.forEach((filename, index) => {
  imageSources.push({
    src1: require(`/public/img/healthcare/${filename}`),
  });
});
