
import React, { useEffect, useState, useRef } from "react";

import Layout from '/src/components/common/Layout'
import Wrapper from "/src/components/common/Wrapper";
import s from 'styles/css/survey/index.module.scss';
import { EffectFade, Pagination, Navigation } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import Link from 'next/link';
import Image from "next/image";

import ArrowLeft from '/public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from "/public/img/icon/swiper-arrow-large-r.svg";






function Swiper_main() {
  const navPrev_mainRef = useRef(null);
  const navNext_mainRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(()=>{
    if(window){
      setIsLoaded(true)
    }

  },[isLoaded])


  const swiperSettings_main = {
    className: `${s.swiper_main}`,
    spaceBetween: 0,
    loop: true,
    effect: "fade",
    centeredSlides: true,
    autoplay: { delay: 500, disableOnInteraction: false },
    slidesPerView: 1,
    navigation: {
      prevEl: navPrev_mainRef.current,
      nextEl: navNext_mainRef.current,
    },
    modules: [Navigation, EffectFade],
  };


  return (
    <div className={s.swiper_main_outerWrap}>
      <div className={s.swiper_navigation_container}>
        <i className={s["swiper-button-prev"]} ref={navPrev_mainRef}>
          <ArrowLeft />
        </i>

        <i
          className={s["swiper-button-next"]}
          ref={navNext_mainRef}
        >
          <ArrowRight />
        </i>
        <queto></queto>
      </div>

      {true &&  (<Swiper
        {...swiperSettings_main}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrev_mainRef.current;
          swiper.params.navigation.nextEl = navNext_mainRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        // onRealIndexChange={() => {
        //   console.log("change!");
        // }}
      >


          <SwiperSlide>
           11
          </SwiperSlide>
          <SwiperSlide>
           22
          </SwiperSlide>
          <SwiperSlide>
           33
          </SwiperSlide>
          
      </Swiper>)}

     
    </div>
  );
}







function Survey() {


  return (
    <Layout>
      <Wrapper>

      <Swiper_main />

    
      </Wrapper>
    </Layout>
  );
} 

export default Survey;