import React, {useEffect, useRef, useState} from 'react';
import sorting from '../../../util/func/sorting';
import s from '../../pages/review/review.module.scss';
import {Navigation,Autoplay} from 'swiper';
import ArrowLeft from '../../../public/img/icon/swiper-arrow-large-l.svg';
import ArrowRight from '../../../public/img/icon/swiper-arrow-large-r.svg';
import {Swiper, SwiperSlide} from 'swiper/react';
import Image from 'next/image';
import Modal_bestReview from '../modal/Modal_bestReview';

export function Swiper_bestReview ({items}) {
  const navPrevRef = useRef( null );
  const navNextRef = useRef( null );
  const [isMobile, setIsMobile] = useState( false );
  const [isActiveModal, setIsActiveModal] = useState( false );
  const [itemList, setItemList] = useState( [] );
  const [selectedItemId, setSelectedItemId] = useState( {} );
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect( () => {
    window.innerWidth <= 600 ? setIsMobile( true ) : setIsMobile( false );
  }, [isMobile] );
  
  useEffect( () => {
    const sortedItemList = sorting( items, 'leakedOrder', 'ascend' ); // 노출순서
    setItemList( sortedItemList );
  }, [items] );
  
  const swiperSettings_review = {
    className: `${s.swiper_review}`,
    slidesPerView: 'auto',
    autoplay: {delay: 2500},
    spaceBetween: 40,
    loop: true,
    breakpoints: {
      300: {
        slidesPerView: 1,
        autoplay: {disableOnInteraction: true},
      },
      600: {
        slidesPerView: 2, //레이아웃 2열
        autoplay: {disableOnInteraction: true},
      },
      900: {
        slidesPerView: 3,
        autoplay: {disableOnInteraction: false},
      },
    },
    pagination: {
      clickable: true,
    },
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation, Autoplay],
  };
  
  const onClickReviewItemHandler = (e) => {
    const selectedReviewId = Number( e.currentTarget.dataset.id );
    setSelectedItemId( selectedReviewId );
    setIsActiveModal( true );
  };

  const handleMouseEnter = () => {
    if (swiperInstance) {
      swiperInstance.autoplay.stop();
    }
  };

  const handleMouseLeave = () => {
    if (swiperInstance) {
      swiperInstance.autoplay.start();
    }
  };
  
  // // console.log(itemList);
  return (
    <div 
      className={s.swiper_review_outerWrap}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <i className={s['swiper-button-prev']} ref={navPrevRef}>
        <svg viewBox="0 0 50 50">
          <ArrowLeft className={s.arrow_left}/>
        </svg>
      </i>
      <i className={s['swiper-button-next']} ref={navNextRef}>
        <svg viewBox="0 0 50 50">
          <ArrowRight className={s.arrow_right}/>
        </svg>
      </i>
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          setSwiperInstance(swiper);
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
      >
        {itemList?.length > 0 &&
          itemList?.map( (item) => (
            <SwiperSlide
              className={s.slide}
              key={`bestReview-${item.id}`}
              data-id={item.id}
              onClick={onClickReviewItemHandler}
            >
              <div className={s.mid_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    src={item.imageUrl}
                    objectFit="cover"
                    layout="fill"
                    alt="베스트 리뷰 이미지"
                  />
                </div>
              </div>
              <p className={s.content_title}>{item.contents}</p>
              <p>{item.contents}</p>
            </SwiperSlide>
          ) )}
      </Swiper>
      {isActiveModal && (
        <Modal_bestReview
          isActiveModal={isActiveModal}
          setIsActiveModal={setIsActiveModal}
          reviewId={selectedItemId}
        />
      )}
    </div>
  );
}