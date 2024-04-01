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
    spaceBetween: 300,
    speed: 5000,
    loop: true,
    slidesPerView: 1,
    effect: 'fade',
    autoplay: {
      delay: 200,
      disableOnInteraction: false,
      stopOnLastSlide: false,
    },

    loopedSlides: 1, //noSwiping : true,
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
                src={item.src1}
                objectFit="cover"
                width={250}
                height={350}
                alt={`data-${index}`}
                priority
                className={Styles.swiper_data_img}
              />
              <Image
                src={item.src2}
                objectFit="cover"
                width={500}
                height={550}
                alt={`dog-${index}`}
                priority
                className={Styles.swiper_dog_img}
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
const filenames1 = Array.from({ length: 5 }, (_, i) => `data${i + 1}.jpg`);
const filenames2 = Array.from({ length: 5 }, (_, i) => `dog${i + 1}.jpg`);

// 파일명을 사용하여 이미지를 배열에 추가
filenames1.forEach((filename, index) => {
  imageSources.push({
    src1: require(`/public/img/main/${filename}`),
    src2: require(`/public/img/main/${filenames2[index]}`),
  });
});
