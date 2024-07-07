import React, { useEffect, useRef, useState } from 'react';
import s from './survey.module.scss';
import StyleSwiper from '/src/components/survey/surveySwiper.module.scss';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import siblings from '/util/func/siblings';
import { FullScreenRunningDog } from '/src/components/atoms/FullScreenLoading';
import { EffectFade, Navigation, Pagination } from 'swiper';
import getAbsoluteOffsetTop from '/util/func/getAbsoluteOffsetTop';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';
import filter_ints from '/util/func/filter_ints';
import filter_demicals from '/util/func/filter_demicals';
import rem from '/util/func/rem';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogInedibleFoodType } from '/store/TYPE/dogInedibleFoodType';
import { dogCautionType } from '/store/TYPE/dogCautionType';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_survey';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { postObjData } from '../api/reqData';
import { useRouter } from 'next/router';
import { SurveyDataClass } from '../../class/surveyDataClass';
import SurveyLayout from '../../components/common/SurveyLayout';
import { SurveyActiveStep } from '../../components/survey/SurveyActiveStep';

import SurveyStep1 from '/src/components/survey/step/SurveyStep1';
import SurveyStep2 from '/src/components/survey/step/SurveyStep2';
import SurveyStep3 from '/src/components/survey/step/SurveyStep3';
import SurveyStep4 from '/src/components/survey/step/SurveyStep4';
import SurveyStep5 from '../../components/survey/step/SurveyStep5';
import SurveyStep6 from '../../components/survey/step/SurveyStep6';
import SurveyStep7 from '../../components/survey/step/SurveyStep7';
import SurveyStep8 from '../../components/survey/step/SurveyStep8';
import SurveyStep9 from '../../components/survey/step/SurveyStep9';
import SurveyStep10 from '../../components/survey/step/SurveyStep10';
import SurveyStep11 from '../../components/survey/step/SurveyStep11';
import SurveyStep12 from '../../components/survey/step/SurveyStep12';
import SurveyStep13 from '../../components/survey/step/SurveyStep13';
import SurveyStep14 from '../../components/survey/step/SurveyStep14';
import SurveyStep15 from '../../components/survey/step/SurveyStep15';
import SurveyStep16 from '../../components/survey/step/SurveyStep16';
import SurveyStep17 from '../../components/survey/step/SurveyStep17';
// ! [수정] 로그인 안해도 설문조사 가능하게
// import useUserData from '../../../util/hook/useUserData';

// ! TEST 용
// const initialFormValues = {
//   name: 'dog-', // 강아지이름 str
//   gender: 'MALE', // 강아지 성별 str
//   birth: '202201', // 강아지 생월 str // [YYYYMM]
//   oldDog: false, // 노견 여부 boolean (checkbox type)
//   dogSize: 'MIDDLE', // 강아지 체급 str
//   dogType: '닥스훈트', // 강아지 종 str
//   weight: '2.7', // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
//   neutralization: false, // 중성화여부 Boolean
//   activityLevel: dogActivityLevelType.NORMAL, // 활동량 레벨 str
//   walkingCountPerWeek: 1, // 주당 산책 횟수 num
//   walkingTimePerOneTime: 2, // 한 번 산책할 때 산책 시간 num
//   dogStatus: 'PREGNANT', // 강아지 건강/임신 등의 상태 str
//   snackCountLevel: 'LITTLE', //  간식먹는 정도 str
//   inedibleFood: dogInedibleFoodType.NONE, // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
//   inedibleFoodEtc: 'NONE', // 못 먹는 음식 > '기타' 일경우
//   recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
//   caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
// };

// const svyData = new SurveyDataClass();

// ! [기존] 단일견
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
//   walkingCountPerWeek: '', // 주당 산책 횟수 string
//   walkingTimePerOneTime: '', // 한 번 산책할 때 산책 시간 string
//   dogStatus: '', // 강아지 건강/임신 등의 상태 str
//   snackCountLevel: '', //  간식먹는 정도 str
//   inedibleFood: dogInedibleFoodType.NONE, // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
//   inedibleFoodEtc: '', // 못 먹는 음식 > '기타' 일경우
//   recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
//   caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
// };

// ! [수정] 다견
// const initialFormValues = [];

// [참고] 변경될 경우, SurveyStep1의 initialFormValues도 변경되어야 함 !
const initialFormValues = [
  {
    name: '', // 강아지이름 str
    gender: '', // 강아지 성별 str
    neutralization: null, // 중성화여부 Boolean
    dogSize: '', // 강아지 체급 str
    dogType: '', // 강아지 종 str
    birth: '', //! [변경] 강아지 생월 str // [YYYYMMDD]
    oldDog: false, // 노견 여부 boolean (checkbox type)
    weight: '', // 강아지 몸무게 str // 몸무게 소수점 아래 1자리
    dogStatus: 'HEALTHY', //! [변경] 강아지 상태 [HEALTHY, NEED_DIET, OBESITY, THIN]
    targetWeight: '', //! [추가] 목표 체중 Number
    specificDogStatus: 'NONE', //! [추가]  특별한 상태
    specificDogStatusEtc: 'NONE', //! [추가]  특별한 상태
    // [PREGNANT_EARLY, PREGNANT_LATE,
    // LACTATING_ONE_TO_TWO, LACTATING_THREE_TO_FOUR, LACTATING_FIVE_TO_SIX, LACTATING_OVER_SEVEN,
    // NULL] 해당 사항이 없다면 NULL
    expectedPregnancyDay: '', //! [추가] 임신예상일 str // [YYYYMMDD]
    activityLevel: dogActivityLevelType.NORMAL, // 활동량 레벨 str [VERY_LITTLE, LITTLE, NORMAL, MUCH, VERY_MUCH]
    walkingCountPerWeek: '', // 주당 산책 횟수 string
    walkingTimePerOneTime: '', // 한 번 산책할 때 산책 시간 string
    snackCountLevel: 'NORMAL', //  간식먹는 정도 str
    waterCountLevel: 'NORMAL', //! [추가] 음수량 str [LITTLE, NORMAL, MUCH]
    supplement: 'NONE', //! [추가] 영양제:브랜드명 str
    currentMeal: '', //! [추가] 현재 먹고 있는 식사종류:브랜드명 str
    inedibleFood: 'NONE', // 못 먹는 음식 str => get API 리스트 // 빈값('')일 경우, '있어요'선택됨)
    inedibleFoodEtc: 'NONE', // 못 먹는 음식 > '기타' 일경우
    caution: 'NONE', // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
    // caution: dogCautionType.NONE, // 기타 특이사항 // 빈값('')일 경우, '있어요'선택됨)
    cautionEtc: 'NONE',
    isNewToRawDiet: true, //! [추가] 생식유무
    recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
  },
];

export default function Survey() {
  const loadingDuration = 1200; // ms
  const lastStep = 18; // 마지막 설문조사 페이지
  const router = useRouter();
  // const userData = useUserData();
  // const userId = userData?.memberId;
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [curStep, setCurStep] = useState(1); // num
  const [isLoading, setIsLoading] = useState({}); // obj
  const [modalMessage, setModalMessage] = useState('');
  const [submitState, setSubmitState] = useState(null);
  const prevBtnRef = useRef(null);
  const nextBtnRef = useRef(null);
  const submitBtnRef = useRef(null);
  const surveyPageRef = useRef(null);
  const progressbarRef = useRef(null);

  // const handleSetFooterRef = (ref) => {
  //   setFooterRef(ref);
  // };

  // let footerDiv = footerRef.current;

  // // console.log(formValues);

  // ! [수정] 로그인 안해도 설문조사 가능하게
  // useEffect(() => {
  //   // if (!userId) return;
  //   const storedData = svyData.getStoredSurveyData(userId);
  //   storedData && setFormValues(JSON.parse(storedData));
  // }, [userId]);

  // ! [수정] 로그인 안해도 설문조사 가능하게
  // useEffect(() => {
  //   // // console.log(formValues);
  //   // Storing information in cookies

  //   if (userId) {
  //     svyData.setStoredSurveyData(userId, formValues);
  //   }
  // }, [formValues]);

  // -------------------------------------------------------------------------------- //
  const changeSwiperHeightDependencies = [
    formValues.inedibleFood,
    formValues.caution,
  ];

  useEffect(() => {
    // 코드의 역할: UI '짤림 현상'해결
    // (ex. 반려견 못먹는 음식 '있어요' / 기타 특이사항: '있어요')
    // => '있어요'항목 클릭 시, 새로운 elem들이 나타남으로서, slide의 height값이 증가됨
    // => swiper library의 default function으로서,
    // => swiper-wrapper의 style에 height값이 강제로 할당되어있어서,
    // => 증가된 height부분은  UI가 짤림현상이 발생함
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, changeSwiperHeightDependencies);
  // -------------------------------------------------------------------------------- //

  const onInputChangeHandler = (e, index, formValueKey) => {
    const input = e.currentTarget;
    const { id, value } = input;
    // console.log('input', input);
    // console.log('id', id);
    // console.log('value', value);

    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    // string -> boolean
    if (filteredValue === 'true') {
      filteredValue = true;
    } else if (filteredValue === 'false') {
      filteredValue = false;
    }

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
      if (filteredType.indexOf('number') >= 0) {
        filteredValue = filter_onlyNumber(filteredValue);
      }
      if (filteredType.indexOf('ints') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('ints') >= 0)[0];
        const intNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = intNum
          ? filter_ints(filteredValue, intNum)
          : filteredValue;
      }
      if (filteredType.indexOf('demicals') >= 0) {
        filteredValue = filter_extraIntegerNumberZero(filteredValue);
        const thisFilteredType = filteredType
          .split(',')
          .filter((type) => type.indexOf('demicals') >= 0)[0];
        const demicalNum = Number(thisFilteredType.split('-')[1]);
        filteredValue = demicalNum
          ? filter_demicals(filteredValue, demicalNum)
          : filteredValue;
      }
    }

    if (Array.isArray(formValues)) {
      const newFormValues = formValues.map((item, idx) => {
        if (idx === index) {
          return {
            ...item,
            [id]:
              formValueKey === 'recommendRecipeId'
                ? Number(filteredValue)
                : filteredValue,
          };
        }
        return item;
      });
      setFormValues(newFormValues);
    }

    //////////////////////////////

    // const input = e.currentTarget;
    // const { id, value } = input;
    // const filteredType = input.dataset.inputType;
    // let filteredValue = value;
    // if (filteredType) {
    //   filteredValue = filter_emptyValue(value);
    //   if (filteredType.indexOf('number') >= 0) {
    //     filteredValue = filter_onlyNumber(filteredValue);
    //   }
    //   if (filteredType.indexOf('ints') >= 0) {
    //     filteredValue = filter_extraIntegerNumberZero(filteredValue);
    //     const thisFilteredType = filteredType
    //       .split(',')
    //       .filter((type) => type.indexOf('ints') >= 0)[0];
    //     const intNum = Number(thisFilteredType.split('-')[1]);
    //     filteredValue = intNum
    //       ? filter_ints(filteredValue, intNum)
    //       : filteredValue;
    //   }
    //   if (filteredType.indexOf('demicals') >= 0) {
    //     filteredValue = filter_extraIntegerNumberZero(filteredValue);
    //     const thisFilteredType = filteredType
    //       .split(',')
    //       .filter((type) => type.indexOf('demicals') >= 0)[0];
    //     const demicalNum = Number(thisFilteredType.split('-')[1]);
    //     filteredValue = demicalNum
    //       ? filter_demicals(filteredValue, demicalNum)
    //       : filteredValue;
    //   }
    // }
    // setFormValues((prevState) => ({
    //   ...prevState,
    //   [id]: filteredValue,
    // }));
  };

  // const handleSwiperInit = (swiper) => {
  //   const progressBar = progressBarRef.current; // Progressbar의 Ref를 가져옴
  //   if (progressBar) {
  //     const progressBarElement = progressBar.swiper.el.querySelector(
  //       '.swiper-pagination-progressbar',
  //     ); // Progressbar의 DOM 요소를 찾음
  //     if (progressBarElement) {
  //       // 원하는 위치에 삽입
  //       // 예시: body 요소의 첫 번째 자식으로 삽입
  //       document.body.insertBefore(
  //         progressBarElement,
  //         document.body.firstChild,
  //       );
  //     }
  //   }
  // };

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
      type: 'progressbar',
    },
    navigation: {
      prevEl: prevBtnRef.current,
      nextEl: nextBtnRef.current,
    },
    effects: 'fade',
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
    // pagination.classList.add(`${StyleSwiper['swiper-pagination']}`);

    // footer 안으로 progressbar 넣기
    progressbarRef.current = pagination;
    const progressBar = pagination;
    const footer = document.querySelector('footer');
    footer.appendChild(progressBar);
    // progressbar 스타일링
    progressBar.style.height = '0.6rem';
    progressBar.style.backgroundColor = 'transparent';
    const spanTag = progressBar.querySelector('span');
    const filledBar = progressBar.querySelector(
      '.swiper-pagination-progressbar-fill',
    );
    spanTag.style.backgroundColor = '#CA1010';
    filledBar.style.backgroundColor = '#CA1010';

    // const initIndex = swiper.activeIndex;
    // const curerntStep = initIndex + 1;
    // pagination.dataset.step = curerntStep;
    // const bullets = Array.from(pagination.children);
    // 초기 인덱스
    // bullets[0].classList.add(StyleSwiper['swiper-pagination-bullet-active']);

    // bullets.forEach((bullet, idx) => {
    //   // 단계 표시 (1, 2, 3)
    //   // const bulletContent = document.createElement('span');
    //   // bulletContent.classList.add(StyleSwiper['bullet-content']);
    //   // bulletContent.innerText = idx + 1;
    //   // bullet.appendChild(bulletContent);
    //   bullet.classList.add(`${StyleSwiper['swiper-pagination-bullet']}`);
    //   const bulletContent = document.createElement('span');
    //   bulletContent.classList.add(StyleSwiper['bullet-content']);
    //   bulletContent.innerText = idx + 1;
    //   bulletContent.style.color = 'white';
    //   bulletContent.style.display = 'flex';
    //   bulletContent.style.justifyContent = 'center';
    //   bulletContent.style.alignContent = 'center';
    //   bulletContent.style.textAlign = 'center';
    //   bulletContent.style.fontSize = '0.8rem';
    //   bulletContent.style.width = '1rem';
    //   bulletContent.style.height = '1rem';
    //   bulletContent.style.margin = '0.16rem 0.26rem';
    //   bullet.append(bulletContent);

    //   // 단계별 설명
    //   bullet.classList.add(`${StyleSwiper['swiper-pagination-bullet']}`);
    //   const desc = document.createElement('span');
    //   desc.classList.add(StyleSwiper['desc']);
    //   desc.style.color = '#BE1A21';
    //   bullet.append(desc);
    //   if (idx === 0) desc.innerText = '반려견 정보';
    //   if (idx === 1) desc.innerText = '반려견 건강';
    //   if (idx === 2) desc.innerText = '추가 사항';
    // });
    mct.alertHide('');
  };

  // console.log(progressBarRef);

  const onSwiperChangeIndex = (swiper) => {
    const el = swiper.pagination.el;
    const idx = swiper.activeIndex;
    const curSurveyStep = idx + 1;

    setCurStep(curSurveyStep);
    el.dataset.step = curSurveyStep;

    // const bullets = Array.from(el.children);

    // siblings(bullets[idx]).forEach((sib, index) => {
    //   if (index === idx) {
    //     //-- 작동안됨 --
    //     // bullets[idx].classList.add(
    //     //   StyleSwiper['swiper-pagination-bullet-active'],
    //     // );
    //     // bullets[idx].style.backgroundColor = 'red';
    //     sib.classList.add(StyleSwiper['swiper-pagination-bullet-active']);
    //     sib.style.backgroundColor = '#BE1A21';
    //     // sib.style.color = 'white';
    //     // sib.style.display = 'flex';
    //     // sib.style.justifyContent = 'center';
    //     // sib.style.alignContent = 'center';
    //     // sib.style.textAlign = 'center';
    //     // sib.style.fontSize = '0.8rem';
    //     // sib.style.width = '1rem';
    //     // sib.style.height = '1rem';
    //     // sib.style.margin = '0.16rem 0.26rem';
    //   } else {
    //     sib.classList.remove(StyleSwiper['swiper-pagination-bullet-active']);
    //     sib.style.backgroundColor = 'white';
    //     sib.style.color = '#BE1A21';
    //   }
    // });
    // bullets.forEach((bullet, index) => {
    //   if (index !== idx) {
    //     bullet.classList.remove(StyleSwiper['swiper-pagination-bullet-active']);
    //     bullet.style.backgroundColor = 'red'; // 현재 스텝이 아닌 경우 빨간색으로 변경
    //   } else {
    //     bullet.classList.add(StyleSwiper['swiper-pagination-bullet-active']);
    //     bullet.style.backgroundColor = 'white'; // 현재 스텝인 경우 하얀색으로 변경
    //   }
    // });

    setIsLoading(() => ({ nextPage: true }));
    setTimeout(
      () => setIsLoading(() => ({ nextPage: false })),
      loadingDuration,
    );
    // resetWindowPos();
  };

  // const resetWindowPos = () => {
  //   if (!surveyPageRef.current) return;
  //   const surveyPageEl = surveyPageRef.current;
  //   const scrollYPos = getAbsoluteOffsetTop(surveyPageEl);
  //   window?.scrollTo(0, scrollYPos);
  // };

  useEffect(() => {
    // navigation Button > Hide & Show
    const nextBtn = nextBtnRef.current;
    const submitBtn = submitBtnRef.current;
    nextBtn.style.display = curStep < lastStep ? 'flex' : 'none';
    submitBtn.style.display = curStep === lastStep ? 'flex' : 'none';
  }, [curStep]);

  const onNavButtonClick = (e) => {
    const curBtn = e.currentTarget;
    const submitBtn = submitBtnRef.current;
    const isSubmitButton = curBtn === submitBtn;
    const realCurStep = curStep - 1; // ! important : onSwiperChangeIndex => curStep +1 을 고려하여 -1 계산
    // const errObj = validate(
    //   formValues,
    //   isSubmitButton ? lastStep : realCurStep,
    // );
    // const isPassed = valid_hasFormErrors(errObj);
    const swiper = document.querySelector('.swiper').swiper;

    // console.log('curBtn', curBtn);
    // console.log('submitBtn', submitBtn);
    // console.log('realCurStep', realCurStep);
    // console.log('errObj', errObj);

    //   if (!isPassed) {
    //     let errorMessages = ['- 오류 안내 -\n'];
    //     let count = 0;
    //     for (const key in errObj) {
    //       const errorMessage = errObj[key];
    //       errorMessage && errorMessages.push(`${++count}. ${errorMessage}\n`);
    //     }
    //     // console.log(errorMessages);

    // mct.alertShow(errorMessages);
    // setSubmitState(null);
    // - prevent to the Next step when validation failed
    // curBtn !== submitBtn && swiper.slidePrev();
    // } else {
    isSubmitButton && mct.alertShow('설문조사를 제출하시겠습니까?');
    setSubmitState('READY');
    isSubmitButton && onSubmit();
    // }
  };

  const onSubmit = async () => {
    if (submitState === true) return;

    // const errObj = validate(formValues, 3);
    // const isPassed = valid_hasFormErrors(errObj);
    // if (!isPassed) return;
    const postFormValuesApiUrl = '/api/dogs';
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      let modalMessage;
      console.log(formValues); // 최종 제출
      const postData = { dogSaveRequestDtos: formValues };

      const res = await postObjData(postFormValuesApiUrl, postData);
      console.log(res);
      if (res.isDone) {
        // const slicedReportApiLink =
        //   res.data.data._links.query_surveyReport.href.split('/');
        // const linkLength = slicedReportApiLink.length;
        // const surveyReportsId = slicedReportApiLink[linkLength - 1];
        // svyData.deleteStoredSurveyData(userId);
        // await router.push(`/survey/statistics/${surveyReportsId}`);
        // setSubmitState(true);
        // } else {
        //   modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.';
        //   mct.alertShow(modalMessage);
        //   setSubmitState(false);
      }
    } catch (err) {
      // await mct.alertShow(
      //   'API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.',
      // );
      // setTimeout(() => {
      //   // window.location.href = '/surveyGuide';
      //   window.location.href = '/survey';
      // }, [1000]);
      console.error('API통신 오류 : ', err);
    }
    // setIsLoading((prevState) => ({
    //   ...prevState,
    //   submit: false,
    // }));
  };

  const moveToPrevPage = () => {
    router.back();
  };

  return (
    <>
      {/* {(isLoading.submit || isLoading.nextPage) && submitState !== true && (
        <FullScreenRunningDog opacity={1} />
      )} */}
      <MetaTitle title="설문조사" />
      <SurveyLayout
        progressbarRef={progressbarRef}
        prevBtnRef={prevBtnRef}
        nextBtnRef={nextBtnRef}
        submitBtnRef={submitBtnRef}
        onNavButtonClick={onNavButtonClick}
      >
        <Wrapper
          fullWidth={true}
          bgColor="#fffafa"
          minHeight="90vh"
          alignItems="flex-start"
        >
          <div className={s['survey-page']} ref={surveyPageRef}>
            <SurveyActiveStep curStep={curStep} />
            <Swiper
              {...surveySwiperSettings}
              watchOverflow={false}
              onInit={onSwiperInit}
              onRealIndexChange={onSwiperChangeIndex}
            >
              {/* 1. 견명 */}
              <SwiperSlide>
                <SurveyStep1
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 2. 성별 */}
              <SwiperSlide>
                <SurveyStep2
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 3. 중성화여부 */}
              <SwiperSlide>
                <SurveyStep3
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 4. 사이즈, 견종  */}
              <SwiperSlide>
                <SurveyStep4
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 5. 생일 */}
              <SwiperSlide>
                <SurveyStep5
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 6. 몸무게 */}
              <SwiperSlide>
                <SurveyStep6
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 7. 상태 */}
              <SwiperSlide>
                <SurveyStep7
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 8. 활동량  */}
              <SwiperSlide>
                <SurveyStep8
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 9. 산책량  */}
              <SwiperSlide>
                <SurveyStep9
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 10. 간식량 */}
              <SwiperSlide>
                <SurveyStep10
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 11. 음수량   */}
              <SwiperSlide>
                <SurveyStep11
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 12. 영양제  */}
              <SwiperSlide>
                <SurveyStep12
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 13. 현재 식사  */}
              <SwiperSlide>
                <SurveyStep13
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 14. 못먹는 재료 */}
              <SwiperSlide>
                <SurveyStep14
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 15. 건강적 특이사항, 질병   */}
              <SwiperSlide>
                <SurveyStep15
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 16. 특별히 챙겨주고 싶은 것 */}
              <SwiperSlide>
                <SurveyStep16
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 17. 생식 처음 */}
              <SwiperSlide>
                <SurveyStep17
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>

              {/* 18. [최종] 결과확인 */}
              <SwiperSlide>
                <SurveyStep6
                  surveyPageRef={surveyPageRef}
                  formValues={formValues}
                  setFormValues={setFormValues}
                  onInputChangeHandler={onInputChangeHandler}
                />
              </SwiperSlide>
            </Swiper>
          </div>
        </Wrapper>
      </SurveyLayout>
      {hasAlert && (
        <Modal_global_alert
          message={modalMessage}
          onClick={
            submitState === 'READY'
              ? onSubmit
              : submitState === false
              ? moveToPrevPage
              : null
          }
          background
        />
      )}
    </>
  );
}
