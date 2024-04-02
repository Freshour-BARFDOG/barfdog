// SNS Swiper
import React, { useEffect, useState } from 'react';
import Styles from '@src/pages/mainPage.module.scss';
import { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';

export function Swiper_bigdata() {
  const [isMobile, setIsMobile] = useState(false);

  const swiperSettings_bigdata = {
    className: `${Styles.swiper_bigdata}`,
    spaceBetween: 200,
    speed: 4000,
    loop: true,
    slidesPerView: 2,
    effect: 'fade',
    autoplay: {
      delay: 0,
      disableOnInteraction: false,
      stopOnLastSlide: false,
    },

    // loopedSlides: 1, //noSwiping : true,
    // observer: true,
    // observeParents: true,

    // loopAdditionalSlides: 1,
    // centeredSlides: true,

    modules: [Autoplay],
    breakpoints: {
      100: {
        // slidesPerView: 1,
        // spaceBetween: 20,
      },
      601: {
        // slidesPerView: 1,
        // spaceBetween: 20,
      },
      1201: {
        // slidesPerView: 1,
        // spaceBetween: 0,
      },
    },
  };

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  return (
    <div className={Styles.swiper_bigdata_outerWrap}>
      <Swiper
        {...swiperSettings_bigdata}
        // onInit={(swiper) => {

        //   // const swiperWrapper = swiper.wrapperEl;
        //   // if (swiperWrapper) {
        //   //   swiperWrapper.style.transitionTimingFunction = 'linear';
        //   // }
        // }}
      >
        {imageSources.slice(0, 5).map((item, index) => (
          <SwiperSlide
            className={Styles.swiper_bigdata_box}
            key={`image-source-${index}`}
          >
            <div className={Styles.swiper_bigdata_img}>
              <Image
                src={item.src}
                objectFit="contain"
                // layout="responsive"
                // layout="fill"
                width={1217 / 2}
                height={1530 / 2}
                alt={`daog-${index}`}
                priority
                className={Styles.swiper_data_img}
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
const filenames = Array.from({ length: 5 }, (_, i) => `dog${i + 1}.png`);

// 파일명을 사용하여 이미지를 배열에 추가
filenames.forEach((filename, index) => {
  imageSources.push({
    src: require(`/public/img/main/${filename}`),
  });
});
