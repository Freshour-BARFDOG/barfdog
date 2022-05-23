import React, { useEffect, useState, useRef } from "react";
import Layout from '/src/components/common/Layout'
import Styles from './survey.module.scss'
import Wrapper from "/src/components/common/Wrapper";
import MetaTitle from "@src/components/atoms/MetaTitle";
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectFade, Pagination, Navigation } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";








function SurveySwiper() {
  const navPrev_mainRef = useRef(null);
  const navNext_mainRef = useRef(null);

  const swiperSettings = {
    className: `swiperSurvey`,
    spaceBetween: 0,
    loop: false,
    // effect: "fade",
    centeredSlides: true,
    autoplay: false,
    slidesPerView: 1,
    navigation: {
      prevEl: navPrev_mainRef.current,
      nextEl: navNext_mainRef.current,
    },
    modules: [Navigation, EffectFade],
  };

  return (
    <div className={Styles.swiper_main_outerWrap}>
      <div className={Styles.swiper_navigation_container}>
        <i className={Styles["swiper-button-prev"]} ref={navPrev_mainRef}>
          [왼쪽페이지 버튼]
        </i>

        <i className={Styles["swiper-button-next"]} ref={navNext_mainRef}>
          [다음페이지 버튼]
        </i>
      </div>

      <Swiper
        {...swiperSettings}
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
        <SwiperSlide>111 페이지</SwiperSlide>
        <SwiperSlide>222 페이지</SwiperSlide>
        <SwiperSlide>333 페이지</SwiperSlide>
        <SwiperSlide>444 페이지</SwiperSlide>
      </Swiper>
    </div>
  );
}








function Survey() {
  return (
    <>
      <MetaTitle title="설문조사" />
      <Layout>
        <Wrapper>
          <SurveySwiper />
        </Wrapper>
      </Layout>
    </>
  );
} 

export default Survey;