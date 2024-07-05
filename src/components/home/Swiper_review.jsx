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
import { getData } from '../../pages/api/reqData';
// import { ArrowRight_m } from '@public/img/icon/swiper-arrow-medium-style2.svg';

const swiperSettings_review = {
  className: `${s.swiper_review}`,
  spaceBetween: 40,
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
    // 901: {
    //   spaceBetween: 20,
    // },
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
  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const searchPageSize = 10;
        const url = `/api/reviews/best`;
        const res = await getData(url);
        // console.log(res);
        if (res?.status === 200) {
          const data = res.data._embedded?.queryBestReviewsDtoList;

          // console.log('data', data);

          setItemList(data);
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  // console.log(itemList);

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

  // console.log(itemList);

  return (
    <div className={s.swiper_review_outerWrap}>
      <Swiper
        onActiveIndexChange={hideMoreView}
        onReachEnd={showMoreView}
        {...swiperSettings_review}
      >
        {itemList?.length > 0 &&
          itemList.map((d, index) => (
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
                  {d.titleByAdmin && (
                    <div className={s.swiper_review_title}>
                      <span>{d.titleByAdmin}</span>
                    </div>
                  )}
                  {/* 글 내용 */}
                  <figcaption className={s.contents}>{d.contents}</figcaption>
                  <div className={s.swiper_review_bottom}>
                    <div className={s.swiper_review_start}>
                      {/* 별 5개 */}
                      {[...Array(5)].map((_, index) => (
                        <>
                          <Image
                            src={'/img/icon/review-star.svg'}
                            alt="sns-insta"
                            width={18}
                            height={18}
                          />
                        </>
                      ))}
                    </div>
                    <div className={s.swiper_review_info}>
                      <div className={s.swiper_review_name}>
                        {d.username.includes('@')
                          ? d.username.split('@')[0].trim()
                          : d.username}{' '}
                        보호자님
                      </div>
                      <div className={s.swiper_review_type}>
                        {d.orderType === 'item'
                          ? '일반구매'
                          : 'subscribe'
                          ? '정기구독'
                          : ''}
                      </div>
                    </div>
                  </div>
                </div>
              </figure>
            </SwiperSlide>
          ))}
      </Swiper>
    </div>
  );
}
