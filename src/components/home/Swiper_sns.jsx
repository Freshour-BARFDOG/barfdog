// SNS Swiper
import React, { useEffect, useRef, useState } from 'react';
import Styles from '@src/pages/mainPage.module.scss';
import { Navigation, Autoplay } from 'swiper';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';

export function Swiper_sns() {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  const swiperSettings_sns = {
    className: `${Styles.swiper_sns}`,
    spaceBetween: 0,
    loop: true,
    centeredSlides: false, // 가운데 갈지 말지 고민
    slidesPerView: 'auto',
    // autoplay: {delay: 2500, disableOnInteraction: false},
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation, Autoplay],
    breakpoints: {
      100: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      601: {
        slidesPerView: 2,
        spaceBetween: 20,
      },
      1201: {
        slidesPerView: 4,
        spaceBetween: 60,
      },
    },
  };

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  return (
    <div className={Styles.swiper_sns_outerWrap}>
      <i className={Styles.swiper_button_prev_sns} ref={navPrevRef}>
        <ArrowLeft_s />
      </i>
      <i className={Styles.swiper_button_next_sns} ref={navNextRef}>
        <ArrowRight_s />
      </i>
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
      }}
      >
        <SwiperSlide className={Styles.swiper_sns_box}>
          <a
            href="https://www.instagram.com/barfdog_official/"
            target={'_blank'}
            rel={'noreferrer'}
          >
            <div className={Styles.swiper_sns_img}>
              <Image
                src={require('/public/img/pages/home/instagram-beef.png')}
                objectFit="cover"
                width={244}
                height={244}
                alt="카드 이미지"
                priority
              />
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide className={Styles.swiper_sns_box}>
          <a
            href="https://www.instagram.com/barfdog_official/"
            target={'_blank'}
            rel={'noreferrer'}
          >
            <div className={Styles.swiper_sns_img}>
              <Image
                src={require('/public/img/pages/home/instagram-duck.png')}
                objectFit="cover"
                width={244}
                height={244}
                alt="카드 이미지"
                priority
              />
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide className={Styles.swiper_sns_box}>
          <a
            href="https://www.instagram.com/barfdog_official/"
            target={'_blank'}
            rel={'noreferrer'}
          >
            <div className={Styles.swiper_sns_img}>
              <Image
                src={require('/public/img/pages/home/instagram-lamb.png')}
                objectFit="cover"
                width={244}
                height={244}
                alt="카드 이미지"
                priority
              />
            </div>
          </a>
        </SwiperSlide>
        <SwiperSlide className={Styles.swiper_sns_box}>
          <a
            href="https://www.instagram.com/barfdog_official/"
            target={'_blank'}
            rel={'noreferrer'}
          >
            <div className={Styles.swiper_sns_img}>
              <Image
                src={require('/public/img/pages/home/instagram-turkey.png')}
                objectFit="cover"
                width={244}
                height={244}
                alt="카드 이미지"
                priority
              />
            </div>
          </a>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
