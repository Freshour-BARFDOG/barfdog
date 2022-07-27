import React, { useEffect, useState } from 'react';
import s from '/src/pages/order/subscribe/index.module.scss';
import { ItemRecommendlabel } from '/src/components/atoms/ItemLabel';
import Image from 'next/image';
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import 'swiper/css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { getData } from '/src/pages/api/reqData';
import {FullScreenLoading} from '/src/components/atoms/FullScreenLoading';
import popupWindow from '/util/func/popupWindow';
import {SubscribeCustomInput} from "./SubscribeCustomInput";
import checkStringUnderConsonant from "../../../util/func/checkStringUnderConsonant";



const swiperSettings = {
  className: s.swiper_recipes,
  slidesPerView: 4,
  spaceBetween: 20,
  loop: false, // ! Important : loop사용 시, checkbox복수 선택 불가함 (loop에 사용되는 dummy slider로 인함)
  autoplay: false,
  breakpoints: {
    300: {
      slidesPerView: 1,
    },
    600: {
      //601 이상일 경우
      slidesPerView: 4, //레이아웃 2열
    },
  },
};




export const SubscribeRecipe = ({ name, info, setInfo, form, setForm }) => {
  // * 풀플랜: 최대 2가지 레시피 선택 가능
  // * 그 외 플랜: 1가지 레시피 선택 가능
  const [isLoading, setIsLoading] = useState({}); // boolean
  const [recipes, setRecipes] = useState([]);
  const [initialize, setInitialize] = useState(false);
  const [selectedCheckbox, setSelectedCheckbox] = useState([]);
  const [selectedRadio, setSelectedRadio] = useState(null);
  const [inputType, setInputType] = useState( 'radio' );
  
  
  const selectedRecipe = info.recipeInfoList?.filter(rc=>form.recipeIdList.indexOf(rc.id) >= 0);
  const selectedPlan = selectedRecipe?.map(rc=>rc.name).join(',')
  const selectedIngredientList = selectedRecipe?.map(rc=>rc.ingredientList).join(',').split(',');
  const curIngredient = selectedIngredientList?.filter((ingr, i)=>selectedIngredientList.indexOf(ingr) === i).join(', ');

  useEffect(() => {
    // 레시피 모든 정보 조회
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        const url = `/api/recipes`;
        const res = await getData(url);
        const recipeIdList = res.data?._embedded?.recipeListResponseDtoList?.map((l) => l.id);
        const recipeInfoList = [];
        for (const recipeId of recipeIdList) {
          const apiUrl = `/api/recipes/${recipeId}`;
          const res = await getData(apiUrl);
          recipeInfoList.push(res.data);
        }
        setRecipes(recipeInfoList);
        setInfo(prevState => ({
          ...prevState,
          recipeInfoList
        }))
      } catch (err) {
        console.error(err.response);
      }

      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  }, []);
  
  
  useEffect( () => {
    // Recipe Input 타입 변환
    const type = form.plan === subscribePlanType.FULL.NAME ? 'checkbox' : 'radio';
    setInputType(type)
  }, [form.plan] );
  
  
  
  useEffect(() => {
    
    const selectedId = recipes.filter((rc,index)=>rc.name === `${selectedRadio && selectedRadio.split('-')[0]}`)[0]?.id
    setForm((prevState) => ({
      ...prevState,
      [name]: [selectedId]
    }));
    setSelectedRadio(`${selectedRadio}`);
  }, [selectedRadio]);
  
  
  

  
  useEffect(() => {
    // console.log(selectedCheckbox)
    let selectedCheckboxCount = 0;
    const keys = Object.keys(selectedCheckbox);
    const seletedIdList = []
    keys.forEach((key) => {
      const selectedId = recipes.filter((rc,index)=>rc.name === `${selectedCheckbox && key.split('-')[0]}`)[0]?.id
      const val = selectedCheckbox[key];
      val && selectedCheckboxCount++;
      val ?  seletedIdList.push(selectedId) : seletedIdList?.filter(id=> id !== selectedId);
    });
    const maxSelectedCheckboxCount = 2;
    if (selectedCheckboxCount > maxSelectedCheckboxCount) {
      alert('풀플랜은 최대 2개 레시피까지 선택가능합니다.');
      // setSelectedCheckbox([])
      setInitialize(true);
    } else {
      setInitialize(false);
    }
    
    setForm((prevState) => ({
      ...prevState,
      [name]: seletedIdList,
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
      {curIngredient && <div className={s.notice_row_3}>
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
            {info.inedibleFood && <><em>{info.inedibleFood}</em>에 못먹는 음식으로 체크해 주셨네요!</>}
            <em>{selectedPlan}</em> 레시피에는 <em>&lsquo;{curIngredient}&rsquo;</em>{checkStringUnderConsonant(curIngredient) ? '이' : '가'} 들어가 있습니다.
            <br />
            반려견에게 알레르기를 유발할 수 있으니 레시피 선택에 유의해 주시기 바랍니다.
          </div>
        </div>
      </div>}
      
      {isLoading?.fetching ? (
        <FullScreenLoading/>
      ) : (
        <Swiper {...swiperSettings} watchOverflow={false}>
          {recipes.length > 0 &&
            recipes.map((rc, index) => (
              <SwiperSlide key={`recipe-${rc.id}-${index}`} className={s.slide}>
                <SubscribeCustomInput
                  id={`${rc.name}-${index}`}
                  selectedRadio={selectedRadio}
                  type={inputType}
                  name={name}
                  initialize={initialize}
                  // disabled={disabled}
                  selectedCheckbox={selectedCheckbox}
                  setSelectedCheckbox={setSelectedCheckbox}
                  setSelectedRadio={setSelectedRadio}
                >
                  {info.recommendRecipeName === rc.name && <ItemRecommendlabel
                    label="추천!"
                    style={{
                      backgroundColor: '#000',
                    }}
                  />}
                  <figure className={`${s.image} img-wrap`}>
                    <Image
                      className={'init-next-image'}
                      src={rc.thumbnailUri2}
                      objectFit="cover"
                      layout="fill"
                      alt="레시피 상세 이미지"
                    />
                  </figure>
                    <div className={s.row_1}>{rc.uiNameEnglish}</div>
                    <div className={s.row_2}>{rc.uiNameKorean}</div>
                    <div className={s.row_3}>{rc.description}</div>
                    <div className={s.row_4}>
                      <a href="/recipes" onClick={onPopupHandler}>
                        더 알아보기
                      </a>
                    </div>
                </SubscribeCustomInput>
              </SwiperSlide>
            ))}
        </Swiper>
      )}
    </section>
  );
};
