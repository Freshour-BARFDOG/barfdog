import Link from 'next/link';
import React from 'react';
import s from 'src/pages/mainPage.module.scss';
import LogoMain from '/public/img/logo_main.png';
import Image from 'next/image';
import BackgroundVideo from 'next-video/background-video';

export function Main_top() {
  // 1. 영상 소개
  return (
    <section className={s.intro_top_wrapper}>
      <div className={s.inner}>
        <div className={s.video_wrapper}>
          <Image
            src="/img/main.jpg"
            alt="main"
            width={1500}
            height={1966}
          ></Image>
          {/* <video
            poster="영상썸네일"
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
          >
            <source src="/videos/main-video.mp4#t=0.001" type="video/mp4" />
            <Image
              src="/img/main.jpg"
              alt="loading"
              width={30}
              height={30}
            ></Image>
            <p>.</p>
          </video> */}

          {/* [if lte IE8]>
         <p>브라우저 버전이 낮다</p>
<![   ndif] */}

          {/* <BackgroundVideo
            src={'/videos/main-video.mp4'}
            muted
            autoPlay
            loop
            playsInline
          /> */}

          {/* <BackgroundVideo
            src={
              'https://stream.mux.com/Xbd6bt00mGSaB00SKAj2HwsNCs82aynTjIaUTX00Yr402XU.m3u8'
            }
            muted
            autoPlay
            loop
            playsInline
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '60vh',
              objectFit: 'cover',
            }}
          /> */}

          {/* <video
            muted
            autoPlay
            loop
            playsInline
            preload="metadata"
            controls={false}
          >
            <source
              src="https://stream.mux.com/Xbd6bt00mGSaB00SKAj2HwsNCs82aynTjIaUTX00Yr402XU.m3u8"
              type="application/x-mpegURL"
            />
          </video> */}

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
