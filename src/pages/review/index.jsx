import React, { useEffect, useState, useRef } from "react";
import MetaTitle from "/src/components/atoms/MetaTitle";
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import Styles from "/styles/css/review/index.module.scss";
import ReviewItem_Pagination from "@src/components/atoms/Pagination";
import Image from "next/image";
import RatingStars from "/src/components/atoms/RatingStars";
import ArrowLeft_m from "/public/img/icon/swiper-arrow-medium.svg";
import ArrowRight_m from "/public/img/icon/swiper-arrow-medium-style2.svg";
import Modal_bestReview from "@src/components/modal/Modal_bestReview";


import { slideUp, slideDown } from "/util/func/slideToggle";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
//필요한것만 두개중 가져가면됨
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/effect-fade";



const TEST_DATA = [
  {
    id: 1,
    title: "굿굿 너무 좋아요",
    detail: "저희강아지 밥 다먹고 빈그릇 핥는거 7년 키우면서 첨봄.. 굿굿",
    src: require("/public/img/pages/review/review_slide_1.png"),
  },
  {
    id: 2,
    title: "굿굿 너무 좋아요",
    detail:
      "진짜 잘먹어요 ;; 생식은 다 잘먹는다고해서 타업체샀다가 안먹어서 포기했는데ㅠㅠ사료는 눈물터져서 다시 막 찾다가 바프독차? 집...",
    src: require("/public/img/pages/review/review_slide_2.png"),
  },
  {
    id: 3,
    title: "굿굿 너무 좋아요",
    detail:
      "친구네 시바에게 선물했는데 생식 처음 도전이었는데도 아주 잘 먹었다고 합니다. 친구가 마진도 생각 안 하시는 거 같다고 아가는 잘...",
    src: require("/public/img/pages/review/review_slide_3.png"),
  },
];




function Swiper_review({ onShowBestReviewModalHandler }) {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  const swiperSettings_review = {
    className: `${Styles.swiper_review}`,
    spaceBetween: 40,
    loop: true,
    centeredSlides: false,
    slidesPerView: isMobile ? 1 : 3,
    //모바일 에서는 1개 pc에서는 3개
    pagination: {
      clickable: true,
    },
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation],
    //존재하면 쓸수있음
  };


  const onClickReviewItemHandler = () => {
    onShowBestReviewModalHandler(true);
    
  }

  return (
    <div className={Styles.swiper_review_outerWrap}>
      <i className={Styles["swiper-button-prev"]} ref={navPrevRef}>
        <ArrowLeft_m />
      </i>
      <i className={Styles["swiper-button-next"]} ref={navNextRef}>
        <ArrowRight_m />
      </i>
      <Swiper
        {...swiperSettings_review}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        // onActiveIndexChange={hideMoreView}
        // onReachEnd={showMoreView}
        onClick={onClickReviewItemHandler}
      >
        {TEST_DATA.map((item) => (
          <SwiperSlide className={Styles.slide} key={item.id}>
            <div className={Styles.mid_box}>
              <div className={`${Styles.image} img-wrap`}>
                <Image
                  src={item.src}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                />
              </div>
            </div>
            <p className={Styles.content_title}>{item.title}</p>
            <p>{item.detail}</p>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}










const ReviewBox = () => {

  const ReviewList = () => {
    const reviewTotalCount = 7;
    const reviewList = [];
    for(let i =0; i < reviewTotalCount; i++){
      reviewList.push(<ReviewItem key={`reviewTotalCount-${i}`} />);
    }

    return <ul>{reviewList}</ul>;
    
  }


  const ReviewItem = () => {

    const [visible, setVisible ] =useState(false);
    const boxRef = useRef(null);
    const onClickHandler = (e) => {
      visible ? setVisible(false) : setVisible(true);
    };
    


    useEffect(() => {
      const selectedElem = boxRef.current;
      if (!selectedElem) return;
      visible ? slideDown(selectedElem) : slideUp(selectedElem);
    }, [visible]);

    return (
      <li>
        <figure className={Styles.grid_box} onClick={onClickHandler}>
          {/* 그리드 1 시작지점 */}
          <span>98</span>
          <div className={Styles.mid_box}>
            <i className={`${Styles.image_product} img-wrap`}>
              <Image
                src={require("public/img/pages/review/review_slide_sample.png")}
                objectFit="contain"
                layout="fill"
                alt="카드 이미지"
              />
            </i>
          </div>

          <i className={Styles.star_box}>
            <RatingStars count={3} margin={0} />
          </i>
          <p className={Styles.content}>
            <i className={`${Styles.image} img-wrap`}>
              <Image
                src={require("/public/img/shop/single/shop_main_slide_picture.png")}
                objectFit="contain"
                layout="fill"
                alt="카드 이미지"
              />
            </i>
            사진 굿굿 너무 좋아요
          </p>
          <span> 바&#42;독</span>
          <span> 2022.01.20</span>
        </figure>
        <div className={Styles.text_box} ref={boxRef}>
          <p className={Styles.text}>
            너무 잘먹고요. 모질이 좋아지는게 눈에 보여요.
          </p>
        </div>
      </li>
    );
  }


  return (
    <div className={Styles.tab_slide_box}>
      <div className={Styles.notice_board}>
        <div className={Styles.flex_title}>
          <div>No</div>
          <div>상품</div>
          <div>별점</div>
          <div className={Styles.px16_title_content}>제목</div>
          <div></div>
          <div>등록일</div>
        </div>
        <ul className="reviewBox">
          <ReviewList />
        </ul>
      </div>

      {/* // * B! Ventures > News Page > Pagination 사용예정  */}
      <div className={Styles.pagination_box}>
        <ReviewItem_Pagination itemCountPerGroup={5} itemTotalCount={100} />
      </div>
    </div>
  );
};















function ReviewPage() {

  const [isActiveModal, setIsActiveModal] = useState(false);

  const onShowBestReviewModalHandler = () => {
    setIsActiveModal(true);
  }



  return (
    <>
      <MetaTitle title="리뷰" />
      <Layout>
        <Wrapper>
          <section className={Styles.review_title}>
            <div>바프독 견주님들의 생생한 후기를 확인하세요</div>
          </section>

          <section className={Styles.swiper_box}>
            <Swiper_review
              onShowBestReviewModalHandler={onShowBestReviewModalHandler}
            />
          </section>

          <section className={Styles.review_write_ad}>
            <div className={Styles.red_box}>
              <div className={Styles.content_box}>
                <div className={`${Styles.image_left} img-wrap`}>
                  <Image
                    src={require("/public/img/pages/review/review_redbox_left.png")}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>

                <div className={Styles.text_box}>
                  <p className={Styles.top_text}>
                    리뷰 작성하고 BEST 리뷰가 되어보세요!
                  </p>
                  <p className={Styles.bot_text}>
                    지금 리뷰 작성하고 적립금 받기!
                  </p>
                </div>
                <div className={`${Styles.image_right} img-wrap`}>
                  <Image
                    src={require("/public/img/pages/review/review_redbox_right.png")}
                    objectFit="contain"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className={Styles.notice_text}>
            <div className={Styles.notice}>
              상품에 대한 후기를 남기는 공간입니다. 해당 게시판의 성격과 다른
              글은 사전동의 없이 담당 게시판으로 이동될 수 있습니다.
              <br />
              배송관련, 주문(취소/교환/환불)관련 문의 및 요청사항은 마이페이지
              내 1:1 문의에 남겨주시면 빠른 상담이 가능합니다.
            </div>
          </section>

          <section className={Styles.review_box}>
            <ReviewBox />
          </section>
        </Wrapper>
      </Layout>
      {isActiveModal && (
        <Modal_bestReview
          isActiveModal={isActiveModal}
          setIsActiveModal={setIsActiveModal}
        />
      )}
    </>
  );
}

export default ReviewPage;