// 리뷰 Swiper
import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import s from '@src/pages/mainPage.module.scss';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, Lazy } from 'swiper';
import ArrowRight_m2 from '@public/img/icon/swiper-arrow-medium-style2.svg';
import Link from 'next/link';
import ArrowLeft_m from '@public/img/icon/swiper-arrow-medium.svg';
import ArrowRight_m from '@public/img/icon/swiper-arrow-medium2.svg';
import Starter from '/public/img/main/starter.png';
import TurkeyBeef from '/public/img/main/turkeyBeef.png';
import DuckLamb from '/public/img/main/duckLamb.png';
import LambBeef from '/public/img/main/lambBeef.png';
import Chicken from '/public/img/main/chicken.png';
import Lamb from '/public/img/main/lamb.png';
import Turkey from '/public/img/main/turkey.png';
import Beef from '/public/img/main/beef.png';
// import Quotation from '@public/img/pages/home/home_review_quotation.svg';

import Image from 'next/image';
import sorting from '@util/func/sorting';
import popupWindow from '@util/func/popupWindow';
// import { ArrowRight_m } from '@public/img/icon/swiper-arrow-medium-style2.svg';

const swiperSettings_review = {
  className: `${s.swiper_review}`,
  spaceBetween: 0,
  slidesPerView: 'auto',
  autoplay: { delay: 3000, disableOnInteraction: false },
  // loop: true,
  centeredSlides: false,
  pagination: {
    clickable: true,
  },
  navigation: true,
  // lazy: true,
  modules: [Autoplay, Pagination, Navigation, Lazy],
  breakpoints: {
    100: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    601: {
      slidesPerView: 1,
      spaceBetween: 20,
    },
    950: {
      slidesPerView: 2,
      spaceBetween: 40,
    },
    1201: {
      slidesPerView: 3,
      spaceBetween: 40,
    },
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
      <i className={s['swiper-button-prev']} ref={navPrevRef}>
        <ArrowLeft_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i>
      <i className={s['swiper-button-next']} ref={navNextRef}>
        <ArrowRight_m width="100%" height="100%" viewBox="0 0 39 39" />
      </i>
      <Swiper
        navigation={{
          prevEl: navPrevRef.current,
          nextEl: navNextRef.current,
        }}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.params.pagination.el.classList.add(
            'swiper-pagination__reviewSection',
          );
          swiper.params.pagination.el.classList.add(
            s['swiper-pagination__reviewSection'],
          );
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
          swiper.pagination.destroy();
          swiper.pagination.init();
          swiper.pagination.update();
        }}
        onActiveIndexChange={hideMoreView}
        onReachEnd={showMoreView}
        {...swiperSettings_review}
      >
        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={Starter}
                // layout={'fill'}
                // objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>STARTER PREMIUM+</p>
            <div className={s.contents}>
              <p className={s.text}>
                흰살코기인 닭과 칠면조로 설계하여 질감이 부드러워요! 소화에
                부담이 없어 생식을 처음 접하는 반려견들에게 추천하는
                레시피랍니다.
              </p>
              <div className={s.meat}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>닭, 칠면조</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>
        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={TurkeyBeef}
                // src="/img/main/turkeyBeef.png"
                // layout={'fill'}
                // width={996 / 2}
                // height={900 / 2}
                // objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>TURKEY & BEEF+</p>
            <div className={s.contents}>
              <p className={s.text}>
                성장 단계의 자견의 발육과 성견의 영양 보충에 도움을 주는
                레시피로 면역 체계에 좋은 셀레늄이 다량 들어 노화 방지, 혈액순환
                촉진, 항암력 증진 등에 도움을 준답니다!
              </p>
              <div className={s.meat}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>칠면조, 소</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>
        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={DuckLamb}
                // layout={'fill'}
                // width={904 / 2}
                // height={842 / 2}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>DUCK & LAMB+</p>
            <div className={s.contents}>
              <p className={s.text}>
                기력 회복이 필요한 반려견에게 추천하는 에너지 보충에 탁월한
                레시피랍니다. 필수 아미노산과 레시틴 성분이 아주 풍부하여 피로
                회복에 도움을 준답니다!
              </p>
              <div className={s.meat} style={{ width: '9rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>오리, 양</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={LambBeef}
                // layout={'fill'}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>LAMB & BEEF+</p>
            <div className={s.contents}>
              <p className={s.text}>
                흰살코기인 닭과 칠면조로 설계하여 질감이 부드러워요! 소화에
                부담이 없어 생식을 처음 접하는 반려견들에게 추천하는
                레시피랍니다.
              </p>
              <div className={s.meat} style={{ width: '8rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>양, 소</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={Chicken}
                // layout={'fill'}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>PREMIUM CHICKEN</p>
            <div className={s.contents}>
              <p className={s.text}>
                첫 생식인 친구들에게 추천하는 레시피 중 하나로, 다른 레시피에
                비해 칼슘, 인 함량이 낮아 노령견에게도 아주 적합한 레시피입니다.
              </p>
              <div className={s.meat} style={{ width: '7rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>닭</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={Lamb}
                // layout={'fill'}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>PREMIUM LAMB</p>
            <div className={s.contents}>
              <p className={s.text}>
                활동량이 많은 아이들에게 영양제 같은 레시피! 빠른 피로·근력
                회복을 원한다면 최고 등급의 양고기를 사용한 램 레시피를
                추천합니다.
              </p>
              <div className={s.meat} style={{ width: '7rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>양</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={Turkey}
                // layout={'fill'}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>PREMIUM TURKEY</p>
            <div className={s.contents}>
              <p className={s.text}>
                슈퍼푸드 칠면조를 사용하여 혈액순환 촉진과 천연 칼슘, 인을 통해
                성장기 자견에게 훌륭한 영양을 줄 수 있는 레시피랍니다.
              </p>
              <div className={s.meat} style={{ width: '8.5rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>칠면조</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg}>
            <div className={s.swiper_review_img}>
              <Image
                src={Beef}
                // layout={'fill'}
                objectFit="cover"
                alt="카드 이미지"
              />
            </div>
            <p className={s.title}>PREMIUM BEEF</p>
            <div className={s.contents}>
              <p className={s.text}>
                단 한끼라도 건강하고 알찬 진짜 음식을 주고 싶다면? 필수
                아미노산이 풍부한 비프 레시피를 급여해보세요. 다른 레시피에 비해
                칼슘, 인 함량이 낮아 노령견에게도 아주 적합한 레시피입니다.
              </p>
              <div className={s.meat} style={{ width: '7rem' }}>
                <span className={s.meat_title}>메인 육류</span>
                <div className={s.meat_line}></div>
                <span className={s.content}>소</span>
              </div>
            </div>
          </figure>
        </SwiperSlide>

        <SwiperSlide className={s.swiper_review_box}>
          <figure className={s.swiper_review_bg_end}>
            <p className={s.title_end}>
              올바른 음식은 <br />
              반려견의 삶을 <br />
              변화시킬 수 있습니다
            </p>
            <div className={s.contents_end}>
              <p className={s.text}>
                가공되지 않은 풍부한 육즙과 영양소로 우리 아이들에게 건강을
                선물해주세요
              </p>
              <button className={s.recipe_more_btn}>레시피 더 알아보기</button>
            </div>
          </figure>
        </SwiperSlide>

        {/* --- map --- */}
        {/* {arrangedData?.length > 0 &&
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
                <div className={s.swiper_review_txt}></div>
                <div className={s.contents}>
                  <p className={s.text}>
                    흰살코기인 닭과 칠면조로 설계하여 질감이 부드러워요!
                    <br />
                    소화에 부담이 없어 생식을 처음 접하는 반려견들에게
                    <br />
                    추천하는 레시피랍니다.
                  </p>
                </div>
              </figure>
            </SwiperSlide>
          ))} */}

        {/* --- 더보기 추가 버튼 [삭제] --- */}
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

const ArrowRight_withLink = () => {
  const router = useRouter();

  const onClickHandler = (e) => {
    e.preventDefault();
    router.push('/review');
  };

  return <>{/* <ArrowRight_m /> */}</>;
};
