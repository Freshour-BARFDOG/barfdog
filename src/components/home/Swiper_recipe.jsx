// 레시피 Swiper
import React, { useEffect, useState } from 'react';
import s from '/src/pages/mainPage.module.scss';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import StartBanner from '@public/img/starterBanner.png';
import Link from "next/link";
import Styles from "@src/pages/mainPage.module.scss";
// import s from "/src/components/modal/modal_previewRecipeThumb.module.scss";

const swiperSettings_recipe = {
  className: `${s.swiper_recipe}`,
  slidesPerView: 'auto',
  centeredSlides: false,
  modules: [Navigation],
  breakpoints: {
    //반응형 조건 속성
    300: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    651: {
      //651 이상일 경우
      slidesPerView: 2, //레이아웃 2열
      spaceBetween: 20,
    },
    1001: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1201: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

export function Swiper_recipe({ data, isMobile }) {
  // console.log(data);

  return (
    <div className={s.swiper_recipe_outerWrap}>
      <Swiper {...swiperSettings_recipe}>
        {data?.length > 0 &&
          data.map((d, index) => (
            <SwiperSlide
              key={`recipe-${d.id}-${index}`}
              style={{
                width: '260',
                height: 'inherit',
              }}
              className={s.swiper_slide}
            >
              <div className={s.recipe_a}>
                  <div className={s.recipe_box}>
                    <div className={s.img_wrap}>
                      <Image src={d.imageUrl1} objectFit="fit" layout="fill" alt="레시피 이미지" priority />
                    </div>
                    <p className={s.uiNameKorean}>{d.uiNameKorean}</p>
                    <p className={s.desc}>{d.description}</p>
                    <Link passHref href={'/recipes'}>
                        <a className={s.recipe_btn}>+ 더보기</a>
                    </Link>
                  </div>
              </div>
            </SwiperSlide>
          ))}
      </Swiper>

      <div className={s.btn_box}>
        <div className={Styles.btn_box}>
          <Link href={'/surveyGuide'} passHref>
            <a type="button" className={Styles.btn_main}>
              정기구독 신청하러 가기
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
