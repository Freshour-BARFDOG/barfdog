// 메인 Swiper
import React, { useRef } from 'react';
import Styles from '@src/pages/mainPage.module.scss';
import { EffectFade, Navigation, Pagination, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import ArrowLeft from '@public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from '@public/img/icon/swiper-arrow-large-r.svg';
import { Swiper, SwiperSlide } from 'swiper/react';
import Link from 'next/link';
import Image from 'next/image';
import sorting from '@util/func/sorting';

const swiperSettings_main = {
  className: `${Styles.swiper_main}`,
  spaceBetween: 0,
  loop: true,
  effect: 'fade',
  centeredSlides: true,
  autoplay: { delay: 3500, disableOnInteraction: false },
  slidesPerView: 1,
  // modules: [Pagination, Navigation, EffectFade, Autoplay],
  modules: [Pagination, EffectFade, Autoplay],
  pagination: {
    // type: 'fraction',
    clickable: true,
  },
  allowTouchMove: true,
};

export function Swiper_main({ data, isMobile }) {
  const navPrev_mainRef = useRef(null);
  const navNext_mainRef = useRef(null);
  const arrangedData = sorting(data, 'leakedOrder');

  return (
    <div className={Styles.swiper_main_outerWrap}>
      {/* <div className={Styles.swiper_navigation_container}>
        <i className={Styles['swiper-button-prev']} ref={navPrev_mainRef}>
          <ArrowLeft width="100%" height="100%" viewBox="0 0 50 50" />
        </i>

        <i className={Styles['swiper-button-next']} ref={navNext_mainRef}>
          <ArrowRight width="100%" height="100%" viewBox="0 0 50 50" />
        </i>
      </div> */}

      <Swiper
        // navigation={{
        //   prevEl: navPrev_mainRef.current,
        //   nextEl: navNext_mainRef.current,
        // }}
        {...swiperSettings_main}
        onInit={(swiper) => {
          // swiper.params.navigation.prevEl = navPrev_mainRef.current;
          // swiper.params.navigation.nextEl = navNext_mainRef.current;
          swiper.params.pagination.el.classList.add(
            'swiper-pagination__mainSection',
          );
          swiper.params.pagination.el.classList.add(
            Styles['swiper-pagination__mainSection'],
          );
          // swiper.navigation.destroy();
          // swiper.navigation.init();
          // swiper.navigation.update();
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
      >
        {arrangedData?.length > 0 &&
          arrangedData?.map((d, index) => (
            <SwiperSlide key={`main-banner-${d.id}`}>
              <section className={Styles.banner}>
                <div className={Styles.inner}>
                  <div className={`${Styles['img-wrap']} img-wrap clearfix`}>
                    <Link
                      href={isMobile ? d.mobileLinkUrl : d.pcLinkUrl || '/'}
                      passHref
                    >
                      <a>
                        <Image
                          // priority={true}
                          src={isMobile ? d.mobileImageUrl : d.pcImageUrl}
                          objectFit="cover"
                          objectPosition="50% 50%"
                          // layout="fill"
                          width={1452}
                          height={765}
                          alt={d.name}
                          style={{
                            borderRadius: '10px',
                          }}
                        ></Image>
                        {/* <Image
                          // ! [ TEST ] 변경
                          src="/img/main/mainBanner.jpg"
                        ></Image> */}
                      </a>
                    </Link>
                  </div>
                </div>
              </section>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
