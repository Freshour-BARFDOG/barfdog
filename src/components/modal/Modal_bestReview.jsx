import s from "./modal_bestReview.module.scss";
import React, {useEffect, useState, useRef} from "react";
import zIndex from "/styles/global/zIndex.module.scss";
import rem from "/util/func/rem";
import CloseButton from "/src/components/atoms/CloseButton";
import ScrollContainer from "/src/components/atoms/ScrollContainer";


import Image from "next/image";
import ArrowLeft from "/public/img/icon/swiper-arrow-medium.svg";
import ArrowRight from "/public/img/icon/swiper-arrow-medium.svg";
import RatingStars from "/src/components/atoms/RatingStars";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";






function Modal_bestReview({ isActiveModal, setIsActiveModal, data }) {


  useEffect(() => {
    const scrollYPos = window.scrollY;
    if (isActiveModal) {
      document.body.style.cssText = `
        position:fixed;
        top : -${scrollYPos}px;
      `;
    }

    return () => {
      document.body.style.cssText = ``;
      window?.scrollTo(0, parseInt(-scrollYPos || 10) * -1);
    };
  }, [isActiveModal]);

  const onHideModalHandler = () => {
      setIsActiveModal(false);
    };

  return (
    <>
      <section
        className={`${s["modal-bestReview"]} ${zIndex["modal-bestReview"]}`}
      >
        <div className={s.background} onClick={onHideModalHandler}></div>
        <div className={s.body}>
          <div className={s.container}>
            <ModalCont onCloseModalHandler={onHideModalHandler} data={data} />
          </div>
        </div>
      </section>
    </>
  );
}

export default Modal_bestReview;






// 닫기 버튼 반응형 시 ,크기 변형
const closeButtonStyles = (windowWidth) => {
  if (!windowWidth) return;

  let style;
  const triggeredWindowWidth = 600;

  style = {
    width: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
    height: windowWidth > triggeredWindowWidth ? `${rem(40)}` : `${rem(20)}`,
  };
  return style;
};



const ModalCont = ({ onCloseModalHandler, data }) => {
  const [btnStylesObj, setBtnStyleObj] = useState({});
 
  useEffect(() => {
    setBtnStyleObj(closeButtonStyles(window.innerWidth));
  }, []);


  const text = `너무          잘먹고요. 모질이 좋아지는게 눈에 보여요.너무 잘먹고요. 모질이
              좋아지는게 눈에 보여요.너무 잘먹고요. 모질이 좋아지는게 눈에
              보여요.너무 잘먹고요. 모질이 좋아지는게 눈에 보여요.너무 잘먹고요.
              모질이 좋아지는게 눈에 보여요.너무 잘먹고요. 모질이 좋아지는게
              눈에 보여요. 너무 잘먹고요.좋아지는게 눈에 보여요.너무 잘먹고요. 모질이 좋아지는게 눈에
              보여요.너무 잘먹고요. 너무 잘먹고요. 너무 잘먹고요. 너무 잘먹고요. `;


  return (
    <article className={s.card}>
      <i className={s.btn_close_modal} onClick={onCloseModalHandler}>
        <CloseButton style={btnStylesObj} />
      </i>
      <figure className={s.cont}>
        <Swiper_bestReview />
        <div className={s.details}>
          <div className={s.row1}>
            <span className={s.date}>2022.01.20</span>
          </div>
          <div className={s.row2}>
            <h2 className={s.title}>굿굿</h2>
          </div>
          <div className={s.row3}>
            <i className={s.rating}>
              <RatingStars count={4} size={15} margin={5} />
            </i>
            <span className={s.name}>바*독</span>
          </div>
          <div className={s.row4}>
            {text.trim().length > 300 ? (
              <ScrollContainer height={200} scrollBarWidth={10}>{text}</ScrollContainer>
            ) : (
              text
            )}
          </div>
        </div>
      </figure>
    </article>
  );
};





const Swiper_bestReview = () => {

  const navPrevRef = useRef();
  const navNextRef = useRef();

  const swiperInit = true;
  const [isFirstSlide, setIsFirstSlide] = useState(swiperInit);
  const [isLastSlide, setIsLastSlide] = useState();


  const swiperSettings = {
    className: `${s.swiper_bestReivew}`,
    spaceBetween: 0,
    // loop: true,
    centeredSlides: true,
    slidesPerView: 1,
    navigation: {
      prevEl: navPrevRef.current,
      nextEl: navNextRef.current,
    },
    modules: [Navigation],
  };



  return (
    <div className={s.swiper_bestReview_outerWrap}>
      <i
        className={`${s["swiper-button-prev"]} ${
          isFirstSlide ? s.invisible : ""
        }`}
        ref={navPrevRef}
      >
        <ArrowLeft />
      </i>
      <i
        className={`${s["swiper-button-next"]} ${
          isLastSlide ? s.invisible : ""
        }`}
        ref={navNextRef}
      >
        <ArrowRight />
      </i>
      <Swiper
        {...swiperSettings}
        onInit={(swiper) => {
          swiper.params.navigation.prevEl = navPrevRef.current;
          swiper.params.navigation.nextEl = navNextRef.current;
          swiper.navigation.destroy();
          swiper.navigation.init();
          swiper.navigation.update();
        }}
        onSlideChange={(e) => {
          const curIdx = e.activeIndex;
          const totalSlideCount = e.slides.length - 1;
          setIsFirstSlide(curIdx === 0);
          setIsLastSlide(curIdx === totalSlideCount);
        }}
      >
        <SwiperSlide>
          <div className={`${s["img-wrap"]} img-wrap`}>
            <Image
              src={require("/public/img/pages/review/review_slide_2.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className={`${s["img-wrap"]} img-wrap`}>
            <Image
            priority
              src={require("/public/img/pages/review/review_slide_2.png")}
              objectFit="cover"
              layout="fill"
              alt="카드 이미지"
            />
          </div>
        </SwiperSlide>
        {/* {TEST_DATA.map((item) => (
          <SwiperSlide className={s.slide} key={item.id}>
            <div className={`${s.image} img-wrap`}>
              <Image
                src={require("/public/img/pages/review/review_slide_1.png")}
                objectFit="cover"
                layout="fill"
                alt="카드 이미지"
              />
            </div>
          </SwiperSlide>
        ))} */}
      </Swiper>
    </div>
  );
  
}