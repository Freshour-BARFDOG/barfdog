import React, { useEffect, useRef, useState } from 'react';
import s from './survey.module.scss';
import StyleSwiper from '/src/components/survey/surveySwiper.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {Swiper, SwiperSlide, useSwiper, useSwiperSlide} from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import siblings from '/util/func/siblings';
import { SurveyPagination } from './SurveyPagination';
import { FullScreenLoading } from '/src/components/atoms/fullScreenLoading';
import {EffectFade, Navigation, Pagination} from 'swiper';
import SurveyStep1 from '/src/components/survey/SurveyStep1';
import SurveyStep2 from '/src/components/survey/SurveyStep2';
import SurveyStep3 from '/src/components/survey/SurveyStep3';
import getAbsoluteOffsetTop from '/util/func/getAbsoluteOffsetTop';
import filter_emptyValue from "/util/func/filter_emptyValue";
import filter_onlyNumber from "/util/func/filter_onlyNumber";
import filter_extraIntegerNumberZeo from "/util/func/filter_extraIntegerNumberZeo";
import filter_ints from "/util/func/filter_ints";
import filter_demicals from "/util/func/filter_demicals";
import {dogCautionType} from "/store/TYPE/dogCautionType";
import rem from "/util/func/rem";
import {dogActivityLevelType} from "/store/TYPE/dogActivityLevelType";
import {dogInedibleFoodType} from "/store/TYPE/dogInedibleFoodType";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";
import {validate} from "/util/func/validation/validation_survey";
import {valid_hasFormErrors} from "/util/func/validation/validationPackage";
import {postObjData} from "../api/reqData";
import {useRouter} from "next/router";

/* - 1. formErrrors => globa Modal alert사용해서, Modal에다가 에러에 해당하는 내용을 뿌려준다
    2. birth 기본값이......... formValue에 들어가도록 설정한다.
 * */


const initialFormValues = {
  name: '1', // 강아지이름 str
  gender: 'MALE', // 강아지 성별 str
  birth: '202201', // 강아지 생월 str // [YYYYMM]
  oldDog: false, // 노견 여부 boolean (checkbox type)
  dogSize: 'MIDDLE', // 강아지 체급 str
  dogType: '삽살개', // 강아지 종 str
  weight: '12.2', // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
  neutralization: false, // 중성화여부 Boolean
  activityLevel: dogActivityLevelType.NORMAL, // 활동량 레벨 str
  walkingCountPerWeek: 1, // 주당 산책 횟수 num
  walkingTimePerOneTime: 2, // 한 번 산책할 때 산책 시간 num
  dogStatus: 'PREGNANT', // 강아지 건강/임신 등의 상태 str
  snackCountLevel: 'LITTLE', //  간식먹는 정도 str
  inedibleFood: dogInedibleFoodType.NONE, // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
  inedibleFoodEtc: 'NONE', // 못 먹는 음식 > '기타' 일경우
  recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
  caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
};

// const initialFormValues = {
//   name: '', // 강아지이름 str
//   gender: '', // 강아지 성별 str
//   birth: '', // 강아지 생월 str // [YYYYMM]
//   oldDog: false, // 노견 여부 boolean (checkbox type)
//   dogSize: '', // 강아지 체급 str
//   dogType: '', // 강아지 종 str
//   weight: '', // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
//   neutralization: null, // 중성화여부 Boolean
//   activityLevel: dogActivityLevelType.NORMAL, // 활동량 레벨 str
//   walkingCountPerWeek: null, // 주당 산책 횟수 num
//   walkingTimePerOneTime: null, // 한 번 산책할 때 산책 시간 num
//   dogStatus: '', // 강아지 건강/임신 등의 상태 str
//   snackCountLevel: '', //  간식먹는 정도 str
//   inedibleFood: dogInedibleFoodType.NONE, // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
//   inedibleFoodEtc: '', // 못 먹는 음식 > '기타' 일경우
//   recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
//   caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
// };

export default function Survey() {
  
  const lastStep = 3;
  const router = useRouter();
  const mct = useModalContext();
  const [formValues, setFormValues] = useState(initialFormValues);
  const [curStep, setCurStep] = useState(1); // num
  const [isLoading, setIsLoading] = useState({}); // obj
  const [modalMessage, setModalMessage] = useState('');
  const [submitState, setSubmitState] = useState(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const submitBtnRef = useRef(null);
  const surveyPageRef = useRef(null);
  console.log(formValues)
  
  
  // -------------------------------------------------------------------------------- //
  const changeSwiperHeightDependencies = [formValues.inedibleFood, formValues.caution]
  useEffect ( () => {
    // 코드의 역할: UI '짤림 현상'해결
    // (ex. 반려견 못먹는 음식 '있어요' / 기타 특이사항: '있어요')
    // => '있어요'항목 클릭 시, 새로운 elem들이 나타남으로서, slide의 height값이 증가됨
    // => swiper library의 default function으로서,
    // => swiper-wrapper의 style에 height값이 강제로 할당되어있어서,
    // => 증가된 height부분은  UI가 짤림현상이 발생함
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector('.swiper-slide-active');
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
    
  }, changeSwiperHeightDependencies );
  // -------------------------------------------------------------------------------- //


  
  
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType.indexOf('ints') >= 0) {
        filteredValue = filter_extraIntegerNumberZeo(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('ints') >= 0)[0];
        const intNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = intNum ? filter_ints(filteredValue, intNum) : filteredValue;
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZeo(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('demicals') >= 0)[0];
        const demicalNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = demicalNum ? filter_demicals(filteredValue, demicalNum) : filteredValue;
      }
    }
    
    setFormValues ((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

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
      prevEl: prevBtnRef.current,
      nextEl: nextBtnRef.current,
    },
    effects:'fade',
    modules: [Navigation, Pagination, EffectFade],
  };
  
  
  
  const onSwiperInit = (swiper) => {
    swiper.params.navigation.prevEl = prevBtnRef.current;
    swiper.params.navigation.nextEl = nextBtnRef.current;
    swiper.navigation.destroy();
    swiper.navigation.init();
    swiper.navigation.update();
    swiper.pagination.destroy();
    swiper.pagination.init();
    swiper.pagination.update();
    const pagination = swiper.pagination.el;
    const initIndex = swiper.activeIndex;
    pagination.classList.add(`${StyleSwiper['swiper-pagination']}`);
    const curerntStep = initIndex + 1;
    pagination.dataset.step = curerntStep;
    const bullets = Array.from(pagination.children);
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
    setModalMessage(''); // initializse modal message
  };
  
  
  
  const onSwiperChangeIndex = (swiper) => {
    const el = swiper.pagination.el;
    const idx = swiper.activeIndex;
    const curSurveyStep = idx + 1;
    setCurStep(curSurveyStep);
    el.dataset.step = curSurveyStep;
    const bullets = Array.from(el.children);
    bullets[idx].classList.add(StyleSwiper['swiper-pagination-bullet-active']);
    siblings(bullets[idx]).forEach((sib) =>
      sib.classList.remove(StyleSwiper['swiper-pagination-bullet-active']),
    );
    setIsLoading(prevState => ({nextPage: true}))
    setTimeout(() => setIsLoading(prevState => ({nextPage: false})), 400);
    resetWindowPos();
  };
  
  
  
  const resetWindowPos = () => {
    if (!surveyPageRef.current) return;
    const surveyPageEl = surveyPageRef.current;
    const scrollYPos = getAbsoluteOffsetTop(surveyPageEl);
    window?.scrollTo(0, scrollYPos);
  };
  
  

  
  useEffect( () => {
    // navigation Button > Hide & Show
    const nextBtn = nextBtnRef.current;
    const submitBtn = submitBtnRef.current;
    nextBtn.style.display = curStep < lastStep ? 'flex' : 'none';
    submitBtn.style.display = curStep === lastStep ? 'flex' : 'none';
  }, [curStep] );
  
  
  const onNavButtonClick = (e)=>{
    const curBtn = e.currentTarget;
    const submitBtn = submitBtnRef.current;
    const isSubmitButton = curBtn === submitBtn;
    const realCurStep = curStep - 1 ; // ! important : onSwiperChangeIndex => curStep +1 을 고려하여 -1 계산
    const errObj = validate(formValues, isSubmitButton ? lastStep : realCurStep);
    const isPassed = valid_hasFormErrors(errObj);
    const swiper = document.querySelector('.swiper').swiper;
    if(!isPassed){
      let errorMessages = ['- 오류 안내 -\n',];
      let count = 0;
      for (const key in errObj) {
        const errorMessage = errObj[key];
        errorMessage && errorMessages.push(`${++count}. ${errorMessage}\n`);
      }
      onShowModalHandler(errorMessages);
      // - prevent to the Next step when validation failed
      curBtn !== submitBtn && swiper.slidePrev();
    } else {
      isSubmitButton && onShowModalHandler('설문조사를 제출하시겠습니까?');
      setSubmitState('READY');
    }
  }
  
  
  
  const onSubmit = async () => {
    if(submitState === true) return;
    const postFormValuesApiUrl = '/api/dogs';
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      const res = await postObjData(postFormValuesApiUrl, formValues);
      console.log(res);
      if (res.isDone) {
        modalMessage = '설문조사가 성공적으로 등록되었습니다.'
        onShowModalHandler(modalMessage);
        setSubmitState(true);
      } else {
        modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.'
        onShowModalHandler(modalMessage);
        setSubmitState(false);
      }
    } catch (err) {
      await onShowModalHandler('API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.', moveToPrevPage);
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  
  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };
  

  const moveToNextPage = () => {
    submitState && router.push('/survey/loading');
  };
  
  const moveToPrevPage = () => {
    router.back();
  };
  
  console.log(submitState)
  
  return (
    <>
      <MetaTitle title="설문조사" />
      <Layout>
        <Wrapper>
          {(isLoading.submit || isLoading.nextPage) && <FullScreenLoading opacity={1}/> }
          <div className={s['survey-page']} ref={surveyPageRef}>
            <Swiper
              {...surveySwiperSettings}
              watchOverflow={false}
              onInit={onSwiperInit}
              onRealIndexChange={onSwiperChangeIndex}
            >
              <SwiperSlide>
                <SurveyStep1 formValues={formValues} setFormValues={setFormValues} onInputChangeHandler={onInputChangeHandler}/>
              </SwiperSlide>
              <SwiperSlide>
                <SurveyStep2 formValues={formValues} setFormValues={setFormValues} onInputChangeHandler={onInputChangeHandler}/>
              </SwiperSlide>
              <SwiperSlide>
                <SurveyStep3 formValues={formValues} setFormValues={setFormValues} onInputChangeHandler={onInputChangeHandler}/>
              </SwiperSlide>
            </Swiper>
            <SurveyPagination
              referrer={{ prevBtn: prevBtnRef, nextBtn: nextBtnRef, submitBtn: submitBtnRef }}
              onChangeStep={onNavButtonClick}
            />
          </div>
        </Wrapper>
      </Layout>
      {submitState === null && <Modal_global_alert message={modalMessage} background />}
      {submitState === 'READY' && <Modal_global_alert message={modalMessage} onClick={onSubmit} background />}
      {submitState === false && <Modal_global_alert message={modalMessage} onClick={moveToPrevPage} background />}
      {submitState === true && <Modal_global_alert message={modalMessage} onClick={moveToNextPage} background />}
      
    </>
  );
}
