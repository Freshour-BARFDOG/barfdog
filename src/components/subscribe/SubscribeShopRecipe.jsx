import React, { useEffect, useRef, useState } from 'react';
import s from '/src/pages/order/subscribeShop/index.module.scss';
import {
  ItemRecommendlabel,
  ItemSoldOutLabel,
} from '/src/components/atoms/ItemLabel';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper';
import popupWindow from '/util/func/popupWindow';
import { SubscribeCustomInput } from './SubscribeCustomInput';
import checkStringUnderConsonant from '/util/func/checkStringUnderConsonant';
import Link from 'next/link';
import ArrowLeft_s from '@public/img/icon/swiper-arrow-small-l.svg';
import ArrowRight_s from '@public/img/icon/swiper-arrow-small-r.svg';
import { SubscribeCustomButton } from './SubscribeCustomButton';

const swiperSettings = {
  className: s.swiper_recipes,
  slidesPerView: 'auto',
  spaceBetween: 20,
  loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
  autoplay: false,
  modules: [Navigation],
  breakpoints: {
    300: {
      slidesPerView: 1,
      spaceBetween: 0,
    },
    651: {
      //601 이상일 경우
      slidesPerView: 2, //레이아웃 2열
      spaceBetween: 20,
    },
    901: {
      slidesPerView: 3,
      spaceBetween: 20,
    },
    1201: {
      slidesPerView: 4,
      spaceBetween: 20,
    },
  },
};

// ! 기존 반려견이 '구독 중 또는 건너뛰기 중'이고, 설문결과 -> 맞춤플랜확인하기로 해당 컴포넌트 접근했을 때, 기존 recipe을 초기값이 selected되도록 해달라고 요청할 경우 => '현재는 불가함'
// ! 이유: 초기 recipe input타입이 checkbox / radio 에서, 초기값설정이 제대로 안 먹힘 (완전 초기에 input부터 설정을 다시 건드려야함)
export const SubscribeShopRecipe = ({ name, info, form, setForm }) => {
  const navPrevRef = useRef(null);
  const navNextRef = useRef(null);

  // 재현 ==============================
  const [selectedRecipes, setSelectedRecipes] = useState(
    form.recipeIdList || [],
  );
  const planType = form.plan;
  const maxSelection = planType === 'FULL' ? 2 : 1;
  //  =================================

  // 경은 ------------------------------
  const recommendRecipe = info.recipeInfoList.find(recommend => recommend.id === info.recommendRecipeId)
  const newRecipeInfoList = [recommendRecipe, ...info.recipeInfoList.filter(recommend => recommend.id !== info.recommendRecipeId)];
  //  ---------------------------------

  const selectedRecipe = info.recipeInfoList?.filter(
    (rc) => form.recipeIdList.indexOf(rc.id) >= 0,
  );
  const selectedRecipeNames = selectedRecipe?.map((rc) => rc.name).join(',');

  const selectedIngredientList = selectedRecipe
    ?.map((rc) => rc.ingredientList)
    .join(',')
    .split(',');
  const curIngredient = selectedIngredientList
    ?.filter((ingr, i) => selectedIngredientList.indexOf(ingr) === i)
    .join(', ');

  const onPopupHandler = (e) => {
    e.preventDefault();
    if (typeof window === 'undefined') return;
    const href = e.currentTarget.href;
    popupWindow(href, { width: 1000, height: 716 });
  };

  return (
    <section className={s.notice}>
      <h2 className={s.notice_row_1}>구매하실 레시피 한가지를 선택해 주세요</h2>
      <p className={s.notice_row_2}>
        <em>풀플랜</em>만 두 개의 레시피를 동시 선택할 수 있습니다.
      </p>
      {curIngredient && (
        <div className={s.notice_row_3}>
          <div className={s.color_box}>
            <div className={s.color_box_row_1}>
              <div className={s.picture_box}>
                <div className={`${s.image} img-wrap`}>
                  <Image
                    priority
                    src={require('public/img/mypage/subscribe/alert_circle.png')}
                    objectFit="cover"
                    layout="fill"
                    alt="카드 이미지"
                  />
                </div>
              </div>
              <span>&nbsp;잠깐!</span>
            </div>
            <div className={s.color_box_row_2}>
              {info.inedibleFood !== 'NONE' && info.inedibleFood && (
                <>
                  <em>{info.inedibleFood}</em>에 못먹는 음식으로 체크해
                  주셨네요!&nbsp;
                  <br />
                </>
              )}
              <em>{selectedRecipeNames}</em> 레시피에는{' '}
              <em>&lsquo;{curIngredient}&rsquo;</em>
              {checkStringUnderConsonant(curIngredient) ? '이' : '가'} 들어가
              있습니다.
              <br />
              반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기
              바랍니다.
            </div>
          </div>
        </div>
      )}
      {/*<h6 className={'pointColor'}>******SOLD OUT: 1번째 레시피 강제 적용. (테스트 이후 삭제)</h6>*/}

      <div className={s.swiper_recipe_outerWrap}>
        <i className={s.swiper_button_prev_recipe} ref={navPrevRef}>
          <ArrowLeft_s width="100%" height="100%" viewBox="0 0 28 28" />
        </i>
        <i className={s.swiper_button_next_recipe} ref={navNextRef}>
          <ArrowRight_s width="100%" height="100%" viewBox="0 0 28 28" />
        </i>
        <Swiper
          {...swiperSettings}
          watchOverflow={false}
          navigation={{
            prevEl: navPrevRef.current,
            nextEl: navNextRef.current,
          }}
          onInit={(swiper) => {
            swiper.params.navigation.prevEl = navPrevRef.current;
            swiper.params.navigation.nextEl = navNextRef.current;
            swiper.navigation.destroy();
            swiper.navigation.init();
            swiper.navigation.update();
          }}
        >
          {info.recipeInfoList.length > 0 &&
            newRecipeInfoList.map((rc, index) => (
              <React.Fragment key={`fragment-${rc.id}-${index}`}>
                {rc.leaked === 'LEAKED' && (
                  <SwiperSlide
                    key={`recipe-${rc.id}-${index}`}
                    className={s.slide}
                  >

                    <SubscribeCustomButton
                      id={rc.id}
                      name={name}
                      info={info}
                      form={form}
                      setForm={setForm}
                      planType={planType}
                      selectedRecipes={selectedRecipes}
                      setSelectedRecipes={setSelectedRecipes}
                      maxSelection={maxSelection}
                      disabled={!rc.inStock}
                      isRecommend={info.recommendRecipeName === rc.name}
                      label='레시피 선택'
                    >
                      {info.recommendRecipeName === rc.name && (
                        <ItemRecommendlabel
                          label="추천!"
                          style={{
                            backgroundColor: '#000',
                          }}
                        />
                      )}
                      {!rc.inStock && <ItemSoldOutLabel />}
                      <figure className={`${s.image} img-wrap`}>
                        <Image
                          src={rc.thumbnailUri2}
                          objectFit="cover"
                          layout="fill"
                          alt="레시피 상세 이미지"
                        />
                      </figure>
                      <p className={s.row_1}>{rc.uiNameEnglish}</p>
                      <p className={s.row_2}>{rc.uiNameKorean}</p>
                      <p className={s.row_3}>{rc.description}</p>
                      <p className={s.row_4}>
                        <Link href="/recipes" passHref>
                          <a
                            target={'_blank'}
                            rel={'noreferrer'}
                            onClick={onPopupHandler}
                          >
                            더 알아보기
                          </a>
                        </Link>
                      </p>
                    </SubscribeCustomButton>

                  </SwiperSlide>
                )}
              </React.Fragment>
            ))}
        </Swiper>
      </div>
    </section>
  );
};
