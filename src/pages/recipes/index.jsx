import React, { useState, useRef, useEffect } from "react";
import s from './recipes.module.scss';
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-fade';
import { EffectCards, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import MetaTitle from "/src/components/atoms/MetaTitle";
import Image from 'next/image';
import Link from "next/link";
import { useModalContext } from '/store/modal-context';
import Modal_recipes from "/src/components/modal/recipes/Modal_recipes";
import {Modal_cont_point_01} from "/src/components/modal/recipes/Modal_cont_point_01";
import {Modal_cont_point_02} from "/src/components/modal/recipes/Modal_cont_point_02";
import {Modal_cont_point_03} from "/src/components/modal/recipes/Modal_cont_point_03";
import {Modal_cont_point_04} from "/src/components/modal/recipes/Modal_cont_point_04";
import {Modal_cont_ingredient_01} from "/src/components/modal/recipes/Modal_cont_ingredient_01";
import {Modal_cont_ingredient_02} from "/src/components/modal/recipes/Modal_cont_ingredient_02";
import {Modal_cont_ingredient_03} from "/src/components/modal/recipes/Modal_cont_ingredient_03";
import {Modal_cont_ingredient_04} from "/src/components/modal/recipes/Modal_cont_ingredient_04";
import {Modal_cont_ingredient_main_01} from "/src/components/modal/recipes/Modal_cont_ingredient_main_01";
import {Modal_cont_ingredient_main_02} from "/src/components/modal/recipes/Modal_cont_ingredient_main_02";
import {Modal_cont_ingredient_main_03} from "/src/components/modal/recipes/Modal_cont_ingredient_main_03";
import {Modal_cont_ingredient_main_04} from "/src/components/modal/recipes/Modal_cont_ingredient_main_04";
import {Modal_cont_ingredient_total_01} from "/src/components/modal/recipes/Modal_cont_ingredient_total_01";
import {Modal_cont_ingredient_total_02} from "/src/components/modal/recipes/Modal_cont_ingredient_total_02";
import {Modal_cont_ingredient_total_03} from "/src/components/modal/recipes/Modal_cont_ingredient_total_03";
import {Modal_cont_ingredient_total_04} from "/src/components/modal/recipes/Modal_cont_ingredient_total_04";
import Btn_01 from '/public/img/recipes/recipe_subscribe.svg';
import Btn_02 from '/public/img/recipes/recipe_subsctibe_coupon.svg';
import Content_01 from '/public/img/recipes/recipe_content_1.svg';
import Content_02 from '/public/img/recipes/recipe_content_2.svg';
import Content_03 from '/public/img/recipes/recipe_content_3.svg';
import Content_04 from '/public/img/recipes/recipe_content_4.svg';
import Content_05 from '/public/img/recipes/recipe_content_5.svg';
import Content_06 from '/public/img/recipes/recipe_content_6.svg';



const DATA = {
  title_ko: ["STARTER PREMIUM", "TURKEY&BEEF", "DUCK&LAMB", "LAMB&BEEF"],
  title_en: ["스타터프리미엄", "터키앤비프", "덕앤램", "램앤비프"],
  menu_bar: ['#ca1011', '#FF3232', '#FF4921', '#FF8C16'],
  imagelink: [
    // * require(): component 내부에서 data를 전달받을 경우 랜더링 오류 발생(Runtime Error)
    require("/public/img/recipes/starter.png"),
    require("/public/img/recipes/turkey_beef.png"),
    require("/public/img/recipes/duck_lamb.png"),
    require("/public/img/recipes/lamb_beef.png"),
  ],
  component: {
    tab1: [
      <Modal_cont_point_01 key={'point-01'}/>,
      <Modal_cont_point_02 key={'point-02'}/>,
      <Modal_cont_point_03 key={'point-03'}/>,
      <Modal_cont_point_04 key={'point-04'}/>,
    ],
    tab2: [
      <Modal_cont_ingredient_01 key={'ingredient-01'}/>,
      <Modal_cont_ingredient_02 key={'ingredient-02'}/>,
      <Modal_cont_ingredient_03 key={'ingredient-03'}/>,
      <Modal_cont_ingredient_04 key={'ingredient-04'}/>,
    ],
    tab3: [
      <Modal_cont_ingredient_main_01 key={'ingredient-main-01'}/>,
      <Modal_cont_ingredient_main_02 key={'ingredient-main-02'}/>,
      <Modal_cont_ingredient_main_03 key={'ingredient-main-03'}/>,
      <Modal_cont_ingredient_main_04 key={'ingredient-main-04'}/>,
    ],
    tab4: [
      <Modal_cont_ingredient_total_01 key={'ingredient-total-01'}/>,
      <Modal_cont_ingredient_total_02 key={'ingredient-total-02'}/>,
      <Modal_cont_ingredient_total_03 key={'ingredient-total-03'}/>,
      <Modal_cont_ingredient_total_04 key={'ingredient-total-04'}/>,
    ],
  },
};



export default function RecipePage() {

  //GIF 재생
  const [isShown, setIsShown] = useState(false);
  const [isShown1, setIsShown1] = useState(false);
  const [isShown2, setIsShown2] = useState(false);
  const [isShown3, setIsShown3] = useState(false);

  
  const mcx = useModalContext();
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState();

  const onShowModal = (e) => {
    const idx = Number(e.currentTarget.dataset.selectedIdx);
    setSelectedIndex(idx);
    setIsActiveModal(true);
  };

  const onHideModal = () => {
    setIsActiveModal(false);
  };


  const onShowSurvey = () => {
    mcx.subscribe.onShow();
    mcx.event.setScrollY();
  };

  return (
    <>
      <MetaTitle title="레시피" />
      <Layout>
        <Wrapper>

          <section className={s.top}>
            <div className={s.top_title}>
              REAL BARF!
            </div>
            <div className={s.top_text}>
              진짜 생식, 바프독만의 차별화된
            </div>
            <div className={s.top_text2}>
              <span>더블 미트 레시피</span>를 소개합니다
            </div>

            {/* <div className={s.btn}>
              브랜드 소개
            </div> */}
            {/* <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipes_top.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div> */}
            <Swiper_card />
          </section>

          <section className={s.recipe_introduce}>
            <div className={s.recipe_title}>
              BARFDOG’s <br />
              Premium Recipes
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              두 가지 고기를 사용한 바프독의 프리미엄 생식을 만나보세요
            </div>


            <div className={s.recipe_grid_box}>
              <div className={s.left_top}>

              {/* hover gif실행 */}
                <div className={s.image_box}
                  onMouseEnter={() => setIsShown(true)}
                  onMouseLeave={() => setIsShown(false)}
                  onClick={onShowModal} data-selected-idx={0}>
                  <div className={`${s.image} img-wrap`}>
                    {/* 기본 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_top.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  {isShown && (
                  <div className={`${s.gif} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  )}
                </div>

                <p>
                  STARTER <br />PREMIUM
                </p>

                <div className={s.recipe_text}>
                  스타터 프리미엄
                </div>

                <button className={s['showModal_btn']} type={'button'} onClick={onShowModal} data-selected-idx={0}>
                  스타터 프리미엄 더보기
                </button>
              </div>


              <div className={s.right_top}>

              <div className={s.image_box}
                  onMouseEnter={() => setIsShown1(true)}
                  onMouseLeave={() => setIsShown1(false)}
                  onClick={onShowModal} data-selected-idx={1}>
                  <div className={`${s.image} img-wrap`}>
                    {/* 기본 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_top.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  {isShown1 && (
                  <div className={`${s.gif} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  )}
                </div>

                <p>
                  TURKEY &amp; <br />BEEF
                </p>

                <div className={s.recipe_text}>
                  터키앤비프
                </div>
  
                <button className={s['showModal_btn']} type={'button'} onClick={onShowModal} data-selected-idx={1}>
                  터키앤비프 더보기
                </button>
              </div>

              <div className={s.left_bot}>

              <div className={s.image_box}
                  onMouseEnter={() => setIsShown2(true)}
                  onMouseLeave={() => setIsShown2(false)}
                  onClick={onShowModal} data-selected-idx={2}>
                  <div className={`${s.image} img-wrap`}>
                    {/* 기본 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_bot.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  {isShown2 && (
                  <div className={`${s.gif} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  )}
                </div>

                <p>
                  DUCK &amp; <br />LAMB
                </p>

                <div className={s.recipe_text}>
                  덕앤램
                </div>

                <button className={s['showModal_btn']} type={'button'} onClick={onShowModal} data-selected-idx={2}>
                  덕앤램 더보기
                </button>
              </div>

              <div className={s.right_bot}>

                <div className={s.image_box}
                  onMouseEnter={() => setIsShown3(true)}
                  onMouseLeave={() => setIsShown3(false)}
                  onClick={onShowModal} data-selected-idx={3}>
                  <div className={`${s.image} img-wrap`}>
                    {/* 기본 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_bot.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  {isShown3 && (
                  <div className={`${s.gif} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                  )}
                </div>

                <p>
                  LAMB &amp; <br />BEEF
                </p>

                <div className={s.recipe_text}>
                  램앤비프
                </div>

                <button className={s['showModal_btn']} type={'button'} onClick={onShowModal} data-selected-idx={3}>
                  램앤비프 더보기
                </button>
              </div>
            </div>

          </section>

          <section className={s.note}>
            <div className={s.recipe_title}>
              BARFDOG’s Note
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              사료가 아닌 음식을 만든다는 바프독의 철학대로, 올바른 가치를 그대로 담았습니다
            </div>


            <div className={s.note_content_box}>
              <div className={s.box_title}>
                반려견의 건강과 영양을 생각해 <br />좋은 식재료를 고집합니다
              </div>
              <div className={s.pic_box}>
               
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_note_left.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_note_right.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className={s.note_content_box2}>
              <div className={s.box_title2}>
                100% 고품질의 식재료만 <br />사용한 프리미엄 생식
              </div>
              
              <div className={s.pic_box2}>
                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_01 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  100%<br />휴먼그레이드
                </div>
               
                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_2.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_02 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  무항생제<br />고기
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_3.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_03 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  유기농<br />채소·과일
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_4.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_04 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  글루텐<br />무첨가
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_5.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_05 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  곡물류<br />무첨가
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        priority
                        src={require("public/img/recipes/recipe_content_6.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      /> */}
                      <Content_06 width='100%' height='100%' viewBox="0 0 120 120" />
                    </div>
                  </div>
                  합성첨가물<br />무첨가
                </div>
              </div>
            </div>


            <div className={s.btn_box}>
              <div className={s.image_box}>
                <Link href="/surveyGuide" passHref>
                  <a className="flex-wrap">
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        src={require("public/img/recipes/recipe_subscribe.png")}
                        objectFit="cover"
                        width={246}
                        height={49}
                        alt="아이콘 정기구독 시작하기"
                      /> */}
                      <Btn_01 width='100%' height='100%' viewBox="0 0 238 40" />
                    </div>
                  </a>
                </Link>
              </div>
            </div>
          </section>


          <section className={s.ingredients}>
            <div className={s.recipe_title}>
              Our Ingredients
            </div>

            <div className={s.line}>
            <hr />
            </div>

            <div className={s.recipe_title2}>
              바프독은 사료가 아닌 음식을 만든다는 생각으로 제조합니다<br />
              반려견들의 식사 시간은 그저 배만 채우는 시간이 아닌, 즐거운 경험을 축적하는 시간이어야 한다고 생각합니다<br />
              그래서, 반려견에게 줄 수 있는 영양을 우선으로 생각해 사람이 먹을 수 있는 건강한 식재료들을 엄격히 선별하고 있습니다<br />
            </div>

            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipes/recipe_ingredients.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div>
          </section>

          <section className={s.health_care}>
            <div className={s.health_grid_box}>
              <div className={s.left_side}>
                <div className={s.health_row_1}>
                  반려견들의 행복한 삶을 위해 <br />
                  신선하고 건강한 음식 외에도
                </div>

                <div className={s.health_row_2}>
                  다양한 헬스케어 정보를<br />
                  제공합니다
                </div>

                <div className={s.health_btn_box}>
                  <a href='https://blog.naver.com/barfdog'rel="noreferrer" target="_blank" className={s.health_btn}>
                    자세히 보기
                  </a>
                </div>

              </div>

              <div className={s.right_side}>
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_health.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className={s.subscribe_discount}>
            <div className={s.sub_row_1}>
            BARFDOG 구독을 처음 이용하시나요?
            </div>
            <div className={s.sub_row_2}>
            구독 시 특별한 혜택을 드립니다!
              {/* 첫 구매 시 50% 할인 혜택을 <br />받을 수 있습니다! */}
            </div>
            <div className={s.image_box}>
              {/* <Link href="/surveyGuide" passHref>
                <a className="flex-wrap">
                  <div className={`${s.image} img-wrap`}>
                    <Btn_02  width='100%' height='100%' viewBox="0 0 300 71" />
                  </div> 
                </a>
              </Link> */}
              
              <Link href="/surveyGuide" passHref>
                  <a className="flex-wrap">
                    <div className={`${s.image} img-wrap`}>
                      {/* <Image
                        src={require("public/img/recipes/recipe_subscribe.png")}
                        objectFit="cover"
                        width={246}
                        height={49}
                        alt="아이콘 정기구독 시작하기"
                      /> */}
                      <Btn_01 width='100%' height='100%' viewBox="0 0 238 40" />
                    </div>
                  </a>
                </Link>
            </div>
          </section>
        </Wrapper>
      </Layout>
      {isActiveModal && (
        <Modal_recipes
          onHideModal={onHideModal}
          isActiveModal={isActiveModal}
          data={DATA}
          selectedIndex={selectedIndex}
        />
      )}
    </>
  );
}


export function Swiper_card() {
  const [isMobile, setIsMobile] = useState(false);

  const swiperSettings_card = {
    className: `${s.swiper_card}`,
    loop: true,
    spaceBetween: 0,
    centeredSlides: true,
    loopAdditionalSlides: 5,
    slidesPerView: 'auto',
    initialSlide: 1,
    cardsEffect: {
      slideShadows: false,
      perSlideOffset: 3,
      perSlideRotate: 3,

      // perSlideOffset: 10,
      // rotate: false,
      // perSlideRotate: 0
    },
    autoplay: {delay: 2000, disableOnInteraction: false},
    modules: [EffectCards, Autoplay],
  };

  useEffect(() => {
    window.innerWidth <= 600 ? setIsMobile(true) : setIsMobile(false);
  }, [isMobile]);

  return (
    <div className={s.swiper_card_outerWrap}>
      <Swiper grabCursor={true}
      effect={"cards"}
      {...swiperSettings_card}
      onInit={(swiper) => {
      
      }}
      modules={[EffectCards, Autoplay]}
      >
        <SwiperSlide className={s.swiper_card_box}>
            <i className={s.swiper_sns_img}>
              <Image
                //src={require('/public/img/testBanner3.png')}
                src={require('/public/img/recipes/recipes_top2.png')}
                objectFit="cover"
                width={488}
                height={359}
                alt="카드 이미지"
                priority
              />
            </i>
        </SwiperSlide>
        <SwiperSlide className={s.swiper_card_box}>
            <i className={s.swiper_sns_img}>
              <Image
                src={require('/public/img/recipes/recipes_top1.png')}
                objectFit="cover"
                width={488}
                height={359}
                alt="카드 이미지"
                priority
              />
            </i>
        </SwiperSlide>
        <SwiperSlide className={s.swiper_card_box}>
            <i className={s.swiper_sns_img}>
              <Image
                //src={require('/public/img/recipe_ingredients.png')}
                src={require('/public/img/recipes/recipes_top3.png')}
                objectFit="cover"
                width={488}
                height={359}
                alt="카드 이미지"
                priority
              />
            </i>
        </SwiperSlide>
      </Swiper>
    </div>
  );
}
