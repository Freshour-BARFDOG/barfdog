import React, { useEffect, useRef, useState } from 'react';
import sorting from '../../../util/func/sorting';
import s from '../../pages/review/review.module.scss';
import { Scrollbar } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Modal_bestReview from '../modal/Modal_bestReview';

export function Swiper_bestReview({
  items,
  onClickReviewItemHandler,
  selectedItemId,
  isActiveModal,
  setIsActiveModal,
}) {
  const scrollbarRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [itemList, setItemList] = useState([]);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  useEffect(() => {
    const sortedItemList = sorting(items, 'leakedOrder', 'ascend'); // 노출순서
    setItemList(sortedItemList);
  }, [items]);

  const swiperSettings_review = {
    className: `${s.swiper_review}`,
    slidesPerView: 'auto',
    spaceBetween: 20,
    scrollbar: {
      nextEl: scrollbarRef.current,
      draggable: true,
    },
    modules: [Scrollbar],
  };

  // const handleMouseEnter = () => {
  //   if (swiperInstance) {
  //     swiperInstance.autoplay.stop();
  //   }
  // };

  // const handleMouseLeave = () => {
  //   if (swiperInstance) {
  //     swiperInstance.autoplay.start();
  //   }
  // };

  // console.log(itemList);

  return (
    <div
      className={s.swiper_review_outerWrap}
      // onMouseEnter={handleMouseEnter}
      // onMouseLeave={handleMouseLeave}
    >
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          setSwiperInstance(swiper);
          swiper.params.scrollbar.nextEl = scrollbarRef.current;
        }}
      >
        {itemList?.length > 0 &&
          itemList?.map((item) => (
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

              <div className={s.swiper_review_box}>
                <div>
                  <div className={s.swiper_review_top}>
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
                    <div className={s.swiper_review_type}>
                      {item.orderType === 'item'
                        ? '일반구매'
                        : 'subscribe'
                        ? '정기구독'
                        : ''}
                    </div>
                  </div>

                  <p>{item.contents}</p>
                </div>
                <div className={s.swiper_review_name}>
                  {item.username.includes('@')
                    ? item.username.split('@')[0].trim()
                    : item.username}{' '}
                  보호자님
                </div>
              </div>
            </SwiperSlide>
          ))}
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
