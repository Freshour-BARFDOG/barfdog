// SNS Swiper
import React, { useEffect, useRef, useState } from 'react';
import Styles from '@src/pages/mainPage.module.scss';
import { Navigation, Autoplay } from 'swiper';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export function Swiper_sns() {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const swiperSettings_sns = {
    className: `${Styles.swiper_sns}`,
    spaceBetween: 0,
    speed: 3000,
    loop: true,
    slidesPerView: 6,
    observer: true,
    observeParents: true,
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      stopOnLastSlide: false,
    },

    // loopedSlides: 10, //noSwiping : true,
    // loopAdditionalSlides: 1,
    // centeredSlides: false,

    // navigation: {
    //   prevEl: navPrevRef.current,
    //   nextEl: navNextRef.current,
    // },
    modules: [Navigation, Autoplay],
    breakpoints: {
      100: {
        slidesPerView: 4,
        spaceBetween: 0,
      },
      601: {
        //   slidesPerView: 3,
        //   spaceBetween: 0,
      },
      1201: {
        //   slidesPerView: 6,
        //   spaceBetween: 0,
      },
    },
  };

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  return (
    <div className={Styles.swiper_sns_outerWrap}>
      {/* <i className={Styles.swiper_button_prev_sns} ref={navPrevRef}>
        <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <i className={Styles.swiper_button_next_sns} ref={navNextRef}>
        <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i> */}
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        {...swiperSettings_sns}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();

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
                  alt={`바프독 인스타그램 이미지-${index}`}
                  priority
                />
                <Image
                  src={item.src2}
                  objectFit="cover"
                  width={244}
                  height={244}
                  alt={`바프독 인스타그램 이미지-${index}`}
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
//     src: require('/public/img/main/review/review1.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/1바프독 리뉴얼 오픈예정.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/2바프렌즈 4기 활동 종료 안내.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/3램앤비프 레시피.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/4바프독을 선택해야 이유.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/5바프화이트커밍순피드.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/6덕앤램 레시피.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/7가격인상안내.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/8겨울매실 리뷰.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/9터키앤비프 레시피.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/10새해복인사.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/11슈퍼큐브 출시기념 할인.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/12스타터 레시피.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/13유순돌 리뷰.jpg'),
//   },
//   {
//     src: require('/public/img/pages/home/instagram/14슈퍼큐브 오픈.jpg'),
//   },
// ];
