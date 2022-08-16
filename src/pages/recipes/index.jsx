import React, { useState } from "react";
import s from './recipes.module.scss';
import Layout from "/src/components/common/Layout";
import Wrapper from "/src/components/common/Wrapper";
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




const DATA = {
  title_ko: ["STARTER PREMIUM", "TURKEY&BEEF", "DUCK&LAMB", "LAMB&BEEF"],
  title_en: ["스타터프리미엄", "터키앤비프", "덕앤램", "램앤비프"],
  imagelink: [
    // * require(): component 내부에서 data를 전달받을 경우 랜더링 오류 발생(Runtime Error)
    require("/public/img/recipes/starter.png"),
    require("/public/img/recipes/turkey_beef.png"),
    require("/public/img/recipes/duck_lamb.png"),
    require("/public/img/recipes/turkey_beef.png"),
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

            <div className={s.btn}>
              브랜드 소개
            </div>
            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipes_top.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
            </div>
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

              {/* hover gif실행, scss: 182 opacity: 0; */}
                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    {/* gif 이미지 */}
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      {/* 기본 이미지 */}
                      <Image
                        priority
                        src={require("public/img/recipe_left_top.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
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

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_top.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_right_top.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                </div>

                <p>
                  TURKEY &amp; <br />BEEF
                </p>

                <div className={s.recipe_text}>
                  터키앤비프  
                </div>
  
                <button className={s['showModal_btn']} type={'button'} onClick={onShowModal} data-selected-idx={1}>
                  터키앤 비프 더보기
                </button>
              </div>

              <div className={s.left_bot}>

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_left_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_left_bot.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
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

                <div className={s.image_box}>
                  <div className={`${s.image} img-wrap`}>
                    <Image
                      priority
                      src={require("public/img/recipes/recipe_right_bot.gif")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_right_bot.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
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
              진짜 펫푸드에 대한 바프독의 생각. 바프독이 생각하는 본질을 그대로 담았습니다.
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
                      src={require("public/img/recipe_note_left.png")}
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
                      src={require("public/img/recipe_note_right.png")}
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
                      <Image
                        priority
                        src={require("public/img/recipe_content_1.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  100% HUMAN <br />GRADE
                </div>
               
                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_2.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  무항생제<br />고기
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_3.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  ORGANIC<br />VEGETABLE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_4.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  GLUTEN<br />FREE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_5.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  GRAIN<br />FREE
                </div>

                <div className={s.text_box}>
                  <div className={s.image_box}>
                    <div className={`${s.image} img-wrap`}>
                      <Image
                        priority
                        src={require("public/img/recipe_content_6.png")}
                        objectFit="cover"
                        layout="fill"
                        alt="브랜드 소개 이미지"
                      />
                    </div>
                  </div>
                  NO<br />합성첨가물
                </div>
              </div>
            </div>


            <div className={s.btn_box}>
              <div className={s.image_box}>
                <div className={`${s.image} img-wrap`}>
                  <Link href={'/surveyGuide'} passHref>
                    <Image
                      src={require("public/img/recipe_subscribe.png")}
                      objectFit="cover"
                      layout="fill"
                      alt="브랜드 소개 이미지"
                    />
                  </Link>
                </div>
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
                  src={require("public/img/recipe_ingredients.png")}
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
                      src={require("public/img/recipe_health.png")}
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
              BARFDOG 구독이 처음이신가요?
            </div>
            <div className={s.sub_row_2}>
              첫 구매 시 50% 할인 혜택을 <br />받을 수 있습니다!
            </div>
            <div className={s.image_box}>
              <div className={`${s.image} img-wrap`}>
                <Image
                  priority
                  src={require("public/img/recipe_subsctibe_coupon.png")}
                  objectFit="cover"
                  layout="fill"
                  alt="브랜드 소개 이미지"
                />
              </div>
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
