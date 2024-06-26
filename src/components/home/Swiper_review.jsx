// 리뷰 Swiper
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from '@src/pages/mainPage.module.scss';
import { Navigation, Pagination, Lazy, Autoplay } from 'swiper';
import ArrowRight_m2 from '@public/img/icon/swiper-arrow-medium-style2.svg';
import Link from 'next/link';
import ArrowLeft_m from '@public/img/icon/swiper-arrow-medium.svg';
import ArrowRight_m from '@public/img/icon/swiper-arrow-medium2.svg';
import Quotation from '@public/img/pages/home/home_review_quotation.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import sorting from '@util/func/sorting';
import popupWindow from '@util/func/popupWindow';
// import { ArrowRight_m } from '@public/img/icon/swiper-arrow-medium-style2.svg';

const swiperSettings_review = {
  className: `${s.swiper_review}`,
  spaceBetween: 60,
  slidesPerView: 'auto',
  // loop: true,
  autoplay: {
    delay: 2500,
    disableOnInteraction: false,
  },
  centeredSlides: true,
  pagination: {
    clickable: true,
  },
  lazy: true,
  modules: [Lazy, Autoplay],
  breakpoints: {
    //반응형 조건 속성
    // 100: {
    //   slidesPerView: 1,
    //   spaceBetween: 20,
    // },
    601: {
      // slidesPerView: 1,
      spaceBetween: 70,
    },
    901: {
      // slidesPerView: 2,
      spaceBetween: 70,
    },
    // 1201: {
    //   slidesPerView: 1,
    //   spaceBetween: 30,
    // },
  },
};

export function Swiper_review({ data }) {
  const arrangedData = sorting(data, 'leakedOrder');
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReachedEnd, setIsReachedEnd] = useState(false);

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile, isReachedEnd]);

  function hideMoreView(e) {
    const slideLength = e.slides.length;
    if (slideLength && e.realIndex !== slideLength) {
      setIsReachedEnd(false);
    }
  }

  function showMoreView() {
    setIsReachedEnd(true);
  }

  return (
    <div className={s.swiper_review_outerWrap}>
      {/* <i className={s['swiper-button-prev']} ref={navPrevRef}>
        <ArrowLeft_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i>
      <i className={s['swiper-button-next']} ref={navNextRef}>
        <ArrowRight_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i> */}
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        // onInit={(swiper) => {
        // swiper.params.navigation.prevEl = navPrevRef.current;
        // swiper.params.navigation.nextEl = navNextRef.current;
        // swiper.params.pagination.el.classList.add(
        //   'swiper-pagination__reviewSection',
        // );
        // swiper.params.pagination.el.classList.add(
        //   s['swiper-pagination__reviewSection'],
        // );
        // swiper.navigation.destroy();
        // swiper.navigation.init();
        // swiper.navigation.update();
        // swiper.pagination.destroy();
        // swiper.pagination.init();
        // swiper.pagination.update();
        // }}
        onActiveIndexChange={hideMoreView}
        onReachEnd={showMoreView}
        {...swiperSettings_review}
      >
        {arrangedData?.length > 0 &&
          arrangedData.map((d, index) => (
            <SwiperSlide
              key={`bestReview-${d.id}-${index}`}
              className={s.swiper_review_box}
            >
              <figure className={s.swiper_review_bg}>
                <div className={s.swiper_review_img}>
                  <Image
                    src={d.imageUrl}
                    layout={'fill'}
                    objectFit="cover"
                    alt="카드 이미지"
                  />
                </div>
                <div className={s.swiper_review_txt}>
                  {/* <Image
                    src={require('/public/img/pages/home/home_review_quotation.png')}
                    objectFit="fit"
                    width={14}
                    height={13}
                    alt="카드 이미지"
                  /> */}
                  <Quotation width="100%" height="100%" viewBox="0 0 14 13" />
                </div>
                {/* 글 내용 */}
                <figcaption className={s.contents}>{d.contents}</figcaption>
              </figure>
            </SwiperSlide>
          ))}
        {/* <SwiperSlide className={s.swiper_review_more}>
          <Link href="/review" passHref>
            <a>
              <div className={s.image_wrap}>
                <ArrowRight_m2 width="100%" height="100%" viewBox="0 0 39 39" />
              </div>
              <div className={s.more}>더보기</div>
            </a>
          </Link>
        </SwiperSlide> */}
      </Swiper>
    </div>
  );
}

// const ArrowRight_withLink = () => {
//   const router = useRouter();

//   const onClickHandler = (e) => {
//     e.preventDefault();
//     router.push('/review');
//   };

//   return <>{/* <ArrowRight_m /> */}</>;
// };
