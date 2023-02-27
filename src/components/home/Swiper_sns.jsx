// SNS Swiper
import React, {useEffect, useRef, useState} from 'react';
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
        <ArrowLeft_s width='100%' height='100%' viewBox="0 0 28 28" />
      </i>
      <i className={Styles.swiper_button_next_sns} ref={navNextRef}>
        <ArrowRight_s width='100%' height='100%' viewBox="0 0 28 28" />
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
        {instaImageSources.map((item,index) =>(
          <SwiperSlide
            className={Styles.swiper_sns_box}
            key={`insta-image-source-${index}`}
          >
          <a
            href="https://www.instagram.com/barfdog_official/"
            target={'_blank'}
            rel={'noreferrer'}
          >
            <div className={Styles.swiper_sns_img}>
              <Image
                src={item.src}
                objectFit="cover"
                width={244}
                height={244}
                alt={`바프독 인스타그램 이미지-${index}`}
                priority
              />
            </div>
          </a>
        </SwiperSlide>))}
      </Swiper>
    </div>
  );
}



const instaImageSources = [
  {
    src: require("/public/img/pages/home/instagram/0바프렌즈 4기 최우수 발표.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/1바프독 리뉴얼 오픈예정.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/2바프렌즈 4기 활동 종료 안내.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/3램앤비프 레시피.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/4바프독을 선택해야 이유.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/5바프화이트커밍순피드.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/6덕앤램 레시피.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/7가격인상안내.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/8겨울매실 리뷰.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/9터키앤비프 레시피.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/10새해복인사.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/11슈퍼큐브 출시기념 할인.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/12스타터 레시피.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/13유순돌 리뷰.jpg")
  },
  {
    src: require("/public/img/pages/home/instagram/14슈퍼큐브 오픈.jpg")
  },
];
