import Link from 'next/link';
import React from 'react';
import s from 'src/pages/mainPage.module.scss';
import LogoMain from '/public/img/logo_main.png';
import Image from 'next/image';
// import videoSrc from '/public/videos/main-video.mp4';
import videoSrc from '../../../videos/main-video.mp4';
// import Video from 'next-video';
import BackgroundPlayer from 'next-video/background-player';

export function Main_top() {
  // 1. 영상 소개
  return (
    <section className={s.intro_top_wrapper}>
      <div className={s.inner}>
        <div className={s.video_wrapper}>
          {/* <video
            poster="영상썸네일"
            muted={true}
            autoPlay={true}
            loop={true}
            playsinline={true}
          >
            <source src={videoSrc} type="video/mp4" />
          </video> */}
          {/* <video
            autoPlay={true}
            muted={true}
            loop={true}
            playsinline={true}
            src={require('/public/videos/main-video.mp4')}
          /> */}

          <BackgroundPlayer
            autoPlay={true}
            muted={true}
            loop={true}
            playsInline={true}
            preload={'auto'}
            src={videoSrc}
          />

          <div className={s.text_box}>
            <h1>
              우리는 사료가 아닌
              <br /> 음식을 만듭니다
            </h1>
            <h2>보다 나은 견생을 위한 선택</h2>
            <div className={s.image_wrap}>
              <Image
                src={require('/public/img/logo_main.png')}
                alt="카드 이미지"
              />
            </div>
            <div className={s.btn_box}>
              <Link href={'/survey'} passHref>
                <a type="button" className={s.btn_survey}>
                  설문하고 추천받기
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
