// SNS Swiper
import React, { useEffect, useRef, useState } from 'react';
import Styles from '@src/pages/mainPage.module.scss';
import { Navigation, Autoplay } from 'swiper';
// import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
// import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export function Swiper_sns() {
  // const navPrevRef = useRef(null);
  // const navNextRef = useRef(null);

  const swiperSettings_sns = {
    className: `${Styles.swiper_sns}`,
    spaceBetween: 0,
    speed: 3000,
    loop: true,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      stopOnLastSlide: false,
    },
    slidesPerView: 'auto',
    // loopedSlides: 10, //noSwiping : true,
    // loopAdditionalSlides: 1,
    // centeredSlides: false,

    // navigation: {
    //   prevEl: navPrevRef.current,
    //   nextEl: navNextRef.current,
    // },
    // modules: [Navigation, Autoplay],
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
    <div className={Styles.swiper_sns_outerWrap}>
      {/* <i className={Styles.swiper_button_prev_sns} ref={navPrevRef}>
        <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <i className={Styles.swiper_button_next_sns} ref={navNextRef}>
        <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i> */}
      <Swiper
        // navigation={{
        //   prevEl: navPrevRef.current,
        //   nextEl: navNextRef.current,
        // }}
        {...swiperSettings_sns}
        onInit={(swiper) => {
          // swiper.params.navigation.prevEl = navPrevRef.current;
          // swiper.params.navigation.nextEl = navNextRef.current;
          // swiper.navigation.destroy();
          // swiper.navigation.init();
          // swiper.navigation.update();

          const swiperWrapper = swiper.wrapperEl;
          if (swiperWrapper) {
            swiperWrapper.style.transitionTimingFunction = 'linear';
          }
        }}
      >
        {instaImageSources.slice(0, 22).map((item, index) => (
          <SwiperSlide
            className={Styles.swiper_sns_box}
            key={`insta-image-source-${index}`}
          >
            <a
              href="https://www.instagram.com/barfdog_official/"
              target="_blank"
              rel="noreferrer"
            >
              <div className={Styles.swiper_sns_img}>
                <Image
                  src={item.src1}
                  objectFit="cover"
                  width={244}
                  height={244}
                  alt={`바프독 인스타그램 이미지1-${item.src1}`}
                  priority
                />
                <Image
                  src={item.src2}
                  objectFit="cover"
                  width={244}
                  height={244}
                  alt={`바프독 인스타그램 이미지2-${item.src2}`}
                  priority
                />
              </div>
            </a>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

const instaImageSources = [];

// 파일명의 배열 생성
const filenames1 = Array.from({ length: 21 }, (_, i) => `review${i + 1}.jpg`);
const filenames2 = Array.from({ length: 21 }, (_, i) => `review${i + 22}.jpg`);

// 파일명을 사용하여 이미지를 배열에 추가
filenames1.forEach((filename, index) => {
  instaImageSources.push({
    src1: require(`/public/img/main/review/${filename}`),
    src2: require(`/public/img/main/review/${filenames2[index]}`),
  });
});

// const instaImageSources = [
//   {
//     src1: require('/public/img/main/review/review1.jpg'),
//     src2: require('/public/img/main/review/review22.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review2.jpg'),
//     src2: require('/public/img/main/review/review23.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review3.jpg'),
//     src2: require('/public/img/main/review/review24.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review4.jpg'),
//     src2: require('/public/img/main/review/review25.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review5.jpg'),
//     src2: require('/public/img/main/review/review26.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review6.jpg'),
//     src2: require('/public/img/main/review/review27.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review7.jpg'),
//     src2: require('/public/img/main/review/review28.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review8.jpg'),
//     src2: require('/public/img/main/review/review29.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review9.jpg'),
//     src2: require('/public/img/main/review/review30.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review10.jpg'),
//     src2: require('/public/img/main/review/review31.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review11.jpg'),
//     src2: require('/public/img/main/review/review32.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review12.jpg'),
//     src2: require('/public/img/main/review/review33.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review13.jpg'),
//     src2: require('/public/img/main/review/review34.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review14.jpg'),
//     src2: require('/public/img/main/review/review35.jpg'),
//   },

//   {
//     src1: require('/public/img/main/review/review15.jpg'),
//     src2: require('/public/img/main/review/review36.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review16.jpg'),
//     src2: require('/public/img/main/review/review37.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review17.jpg'),
//     src2: require('/public/img/main/review/review38.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review18.jpg'),
//     src2: require('/public/img/main/review/review39.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review19.jpg'),
//     src2: require('/public/img/main/review/review40.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review20.jpg'),
//     src2: require('/public/img/main/review/review41.jpg'),
//   },
//   {
//     src1: require('/public/img/main/review/review21.jpg'),
//     src2: require('/public/img/main/review/review42.jpg'),
//   },
// ];

// const instaImageSources = [
//   {
//     src: require('/public/img/main/review/review1.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review2.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review3.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review4.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review5.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review6.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review7.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review8.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review9.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review10.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review11.jpg'),
//   },

//   {
//     src: require('/public/img/main/review/review12.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review13.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review14.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review15.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review16.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review17.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review18.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review19.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review20.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review21.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review22.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review23.jpg'),
//   },

//   {
//     src: require('/public/img/main/review/review24.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review25.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review26.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review27.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review28.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review29.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review30.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review31.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review32.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review33.jpg'),
//   },

//   {
//     src: require('/public/img/main/review/review34.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review35.jpg'),
//   },

//   {
//     src: require('/public/img/main/review/review36.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review37.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review38.jpg'),
//   },

//   {
//     src: require('/public/img/main/review/review39.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review40.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review41.jpg'),
//   },
//   {
//     src: require('/public/img/main/review/review42.jpg'),
//   },
// ];
