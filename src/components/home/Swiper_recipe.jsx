// 레시피 Swiper
import React, { useEffect, useRef, useState } from 'react';
import s from '/src/pages/mainPage.module.scss';
import { Navigation } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import StartBanner from '@public/img/starterBanner.png';
import Link from 'next/link';
import Styles from '@src/pages/mainPage.module.scss';
import ArrowLeft_m from '@public/img/icon/swiper-arrow-medium.svg';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
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
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  // console.log(data);
  const [recipeDatas, setRecipeDatas] = useState([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const sortedData = data.sort((a, b) => a.id - b.id);
      setRecipeDatas(sortedData || []);
    }
  }, []);

  if (!data || !Array.isArray(data)) {
    return;
  }

  return (
    <div className={s.swiper_recipe_outerWrap}>
      <i className={Styles.swiper_button_prev_recipe} ref={navPrevRef}>
        <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <i className={Styles.swiper_button_next_recipe} ref={navNextRef}>
        <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
      </i>
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        {...swiperSettings_recipe}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {recipeDatas?.length > 0 &&
          recipeDatas?.map((d, index) => (
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
                    <Image
                      src={d.imageUrl1}
                      objectFit="fit"
                      layout="fill"
                      alt="레시피 이미지"
                      priority
                    />
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
              정기구독 신청하기
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
