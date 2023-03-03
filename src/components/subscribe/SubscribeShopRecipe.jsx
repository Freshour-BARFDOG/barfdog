import React, { useEffect, useState } from 'react';
import s from '/src/pages/order/subscribeShop/index.module.scss';
import swiperStyle from './subscribeRecipe.module.scss';
import { ItemRecommendlabel, ItemSoldOutLabel } from '/src/components/atoms/ItemLabel';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import popupWindow from '/util/func/popupWindow';
import { SubscribeCustomInput } from './SubscribeCustomInput';
import checkStringUnderConsonant from '/util/func/checkStringUnderConsonant';
import Link from 'next/link';

const swiperSettings = {
  className: s.swiper_recipes,
  slidesPerView: 'auto',
  spaceBetween: 20,
  loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
  autoplay: false,
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
  const selectedRecipe = info.recipeInfoList?.filter((rc) => form.recipeIdList.indexOf(rc.id) >= 0);
  const selectedRecipeNames = selectedRecipe?.map((rc) => rc.name).join(',');
  const selectedIngredientList = selectedRecipe
    ?.map((rc) => rc.ingredientList)
    .join(',')
    .split(',');
  const curIngredient = selectedIngredientList
    ?.filter((ingr, i) => selectedIngredientList.indexOf(ingr) === i)
    .join(', ');

  
  const [initialize, setInitialize] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState({}); // * 풀플랜: 최대 2가지 레시피 선택 가능 (Checkbox Input) // ex.{터키비프: true}
  const [selectedRadio, setSelectedRadio] = useState(null); // * 그 외 플랜: 1가지 레시피 선택 가능 (Radio Input)
  const [inputType, setInputType] = useState(null);

  
  useEffect(() => {
    // Recipe Input 타입 변환
    const type = form.plan === subscribePlanType.FULL.NAME ? 'checkbox' : 'radio';
    setInputType(type);
    setInitialize(true);
  }, [form.plan]);

  useEffect(() => {
    if (inputType !== 'radio') return; // ! 유효성체크 안할 경우, selectedCheckbox값에 영향끼침
    const selectedId = info.recipeInfoList.filter(
      (rc) => rc.name === `${selectedRadio && selectedRadio.split('-')[0]}`,
    )[0]?.id;

    // console.log(selectedId)
    setForm((prevState) => ({
      ...prevState,
      [name]: [selectedId],
    }));
    setSelectedRadio(`${selectedRadio}`);
  }, [selectedRadio]);

  useEffect(() => {
    if (!selectedCheckbox) return;
    if (inputType !== 'checkbox') return; // ! 유효성체크 안할 경우, selectedRadio값에 영향끼침
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    const selectedIdList = [];
    keys.forEach((key) => {
      const selectedId = info.recipeInfoList.filter(
        (rc, index) => rc.name === `${selectedCheckbox && key.split('-')[0]}`,
      )[0]?.id;
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
      val ? selectedIdList.push(selectedId) : selectedIdList?.filter((id) => id !== selectedId);
    });
    const maxSelectedCheckboxCount = 2;
    const isOverSelected = selectedCheckboxCount > maxSelectedCheckboxCount;
    if (isOverSelected) {
      alert('풀플랜은 최대 2개 레시피까지 선택가능합니다.');
    }

    setInitialize(isOverSelected);
    setForm((prevState) => ({
      ...prevState,
      [name]: isOverSelected ? [] : selectedIdList,
    }));
  }, [selectedCheckbox]);

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
                  <em>{info.inedibleFood}</em>에 못먹는 음식으로 체크해 주셨네요!&nbsp;
                  <br />
                </>
              )}
            
              <em>{selectedRecipeNames}</em> 레시피에는 <em>&lsquo;{curIngredient}&rsquo;</em>
              {checkStringUnderConsonant(curIngredient) ? '이' : '가'} 들어가 있습니다.
              <br />
              반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
            </div>
          </div>
        </div>
      )}
      {/*<h6 className={'pointColor'}>******SOLD OUT: 1번째 레시피 강제 적용. (테스트 이후 삭제)</h6>*/}
      <Swiper {...swiperSettings} watchOverflow={false}>
        {info.recipeInfoList.length > 0 &&
          info.recipeInfoList.map((rc, index) => (
            <SwiperSlide key={`recipe-${rc.id}-${index}`} className={s.slide}>
              <SubscribeCustomInput
                id={`${rc.name}-${rc.id}`}
                selectedRadio={selectedRadio}
                type={inputType}
                name={name}
                initialize={initialize}
                disabled={!rc.inStock}
                selectedCheckbox={selectedCheckbox}
                setSelectedCheckbox={setSelectedCheckbox}
                setSelectedRadio={setSelectedRadio}
                option={{ label: '레시피 선택' }}
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
                    className={'init-next-image'}
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
                    <a target={'_blank'} rel={'noreferrer'} onClick={onPopupHandler}>
                      더 알아보기
                    </a>
                  </Link>
                </p>
              </SubscribeCustomInput>
            </SwiperSlide>
          ))}
      </Swiper>
    </section>
  );
};
