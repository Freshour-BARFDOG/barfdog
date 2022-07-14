import React, {useEffect, useRef, useState} from 'react';
import s from './survey.module.scss';
import StyleSwiper from '/src/components/survey/surveySwiper.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {Swiper, SwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import siblings from '/util/func/siblings';
import {SurveyPagination} from './surveyPagination';
import {FullScreenLoading} from '/src/components/atoms/fullScreenLoading';
import {Navigation, Pagination} from 'swiper';
import SurveyStep1 from "/src/components/survey/SurveyStep1";
import SurveyStep2 from "/src/components/survey/SurveyStep2";
import SurveyStep3 from "/src/components/survey/SurveyStep3";
import getAbsoluteOffsetTop from "/util/func/getAbsoluteOffsetTop";


/* - 1. formErrrors => globa Modal alert사용해서, Modal에다가 에러에 해당하는 내용을 뿌려준다
* */

const initialFormValues = {
  name: '', // 강아지이름 str
  gender: '', // 강아지 성별 str
  birth: '', // 강아지 생월 str // [YYYYMM]
  oldDog: false, // 노견 여부 boolean
  dogType: '', // 강아지 종 str
  dogSize: '', // 강아지 체급 str
  weight: '', // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
  neutralization: true, // 중성화여부 str
  activityLevel: '', // 활동량 레벨 str
  walkingCountPerWeek: '10', // 주당 산책 횟수 str
  walkingTimePerOneTime: '1.1', // 한 번 산책할 때 산책 시간 str
  dogStatus: 'HEALTHY', // 강아지 건강/임신 등의 상태 str
  snackCountLevel: 'NORMAL', //  간식먹는 정도 str
  inedibleFood: 'NONE', // 못 먹는 음식 str => get API 리스트
  inedibleFoodEtc: 'NONE', // 못 먹는 음식 > '기타' 일경우
  recommendRecipeId: 13, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
  caution: 'NONE', // 기타 특이사항
};



export default function Survey() {
  const [formValues, setFormValues] = useState(initialFormValues);
  
  const [curStep, setCurStep] = useState('1'); // string
  const [isLoading, setIsLoading] = useState(false); // boolean
  
  console.log(formValues)
  const prevBtn = useRef(null);
  const nextBtn = useRef(null);
  const surveyPageRef = useRef( null );
  
  useEffect( () => {
    // Loading Effect
    setIsLoading(true);
    setTimeout(()=>setIsLoading(false),1000)
  }, [prevBtn.current, nextBtn.current, curStep] );
  
  
  useEffect(() => {
    // reset scroll Position
    if(!surveyPageRef.current) return;
    const surveyPageElem = surveyPageRef.current
    const scrollYPos = getAbsoluteOffsetTop(surveyPageElem);
    window?.scrollTo(0, scrollYPos);
  }, [curStep]);
  
  const surveySwiperSettings = {
    className: StyleSwiper.swiperSurvey,
    spaceBetween: 0,
    loop: false,
    centeredSlides: true,
    autoplay: false,
    autoHeight: true, // - * 높이 자동조절: Set to true and slider wrapper will adapt its height to the height of the currently active slide
    allowTouchMove: false, // - * 드레그 및 터치 슬라이딩 기능 If false, then the only way to switch the slide is use of external API functions like slidePrev or slideNext
    watchOverflow: false,
    slidesPerView: 1,
    pagination: {
      clickable: false,
    },
    navigation: {
      prevEl: prevBtn.current,
      nextEl: nextBtn.current,
    },
    modules: [Navigation, Pagination],
  };
  
 
  
  const onSwiperInitHandler = (el, idx) => {
    el.classList.add(`${StyleSwiper['swiper-pagination']}`);
    const curSurveyStep = `${idx + 1}`;
    el.dataset.step = curSurveyStep;
    const bullets = Array.from(el.children);
    bullets[0].classList.add(StyleSwiper['swiper-pagination-bullet-active']);
    bullets.forEach((v, idx) => {
      v.classList.add(`${StyleSwiper['swiper-pagination-bullet']}`);
      const desc = document.createElement('span');
      desc.classList.add(StyleSwiper['desc']);
      v.append(desc);
      if (idx === 0) desc.innerText = '기본정보 입력';
      if (idx === 1) desc.innerText = '활동량 입력';
      if (idx === 2) desc.innerText = '추가정보 입력';
    });
  };
  
  const onSwiperChangeIndexHandler = (el, idx) => {
    const curSurveyStep = `${idx + 1}`;
    el.dataset.step = curSurveyStep;
    const bullets = Array.from(el.children);
    bullets[idx].classList.add(StyleSwiper['swiper-pagination-bullet-active']);
    siblings(bullets[idx]).forEach((sib) =>
      sib.classList.remove(StyleSwiper['swiper-pagination-bullet-active']),
    );
    setCurStep(curSurveyStep);
  };
  
  const onSubmit = ()=>{
    const lastStep = '3';
    if(curStep !== lastStep ) return;
    console.log('submit!');
  }

  const onResolveDisabledOption = (swiper)=>{
    const submitButton = swiper.navigation.nextEl;
   
    setTimeout(()=>{
      // ! this code must be inside of 'setTimeout' Because of code exucution order
      submitButton.disabled = false; // ! important // for turn off Swiepr default disabled Option when reaching slide End index
    },0);
    
  }
  
  
  
  return (
    <>
      <MetaTitle title="설문조사" />
      <Layout>
        <Wrapper>
          {isLoading && <FullScreenLoading opacity={1}/> }
          <div className={s['survey-page']} ref={surveyPageRef}>
            <Swiper
              {...surveySwiperSettings}
              watchOverflow={false}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevBtn.current;
                swiper.params.navigation.nextEl = nextBtn.current;
                swiper.navigation.destroy();
                swiper.navigation.init();
                swiper.navigation.update();
                swiper.pagination.destroy();
                swiper.pagination.init();
                swiper.pagination.update();
                onSwiperInitHandler(swiper.pagination.el, 0);
              }}
              onRealIndexChange={(swiper) => {
                onSwiperChangeIndexHandler(swiper.pagination.el, swiper.activeIndex);
              }}
              onReachEnd={onResolveDisabledOption}
            >
              <SwiperSlide>
                <SurveyStep1 formValues={formValues} setFormValues={setFormValues}/>
              </SwiperSlide>
              <SwiperSlide>
                <SurveyStep2 formValues={formValues} setFormValues={setFormValues} />
              </SwiperSlide>
              <SwiperSlide>
                <SurveyStep3 formValues={formValues} setFormValues={setFormValues} />
              </SwiperSlide>
            </Swiper>
            <SurveyPagination referrer={{ prevBtn, nextBtn }} step={curStep} onSubmit={onSubmit}/>
          </div>
        </Wrapper>
      </Layout>
    </>
  );
}
