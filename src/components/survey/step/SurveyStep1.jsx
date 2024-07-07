import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import { BsPlus } from 'react-icons/bs';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { dogInedibleFoodType } from '/store/TYPE/dogInedibleFoodType';
import { dogCautionType } from '/store/TYPE/dogCautionType';

export default function SurveyStep1({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const initialFormValue = {
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
    specificDogStatus: 'NONE', //! [추가]  특별한 상태 [PREGNANT, LACTATING, NONE] 해당 사항이 없다면 NONE
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
    cautionEtc: 'NONE',
    isNewToRawDiet: true, //! [추가] 생식유무
    recommendRecipeId: null, // 특별히 챙겨주고 싶은 부분에 해당하는 Recipe => get API 리스트
  };

  const addDogInfoHandler = () => {
    setFormValues([...formValues, initialFormValue]);
  };

  const removeDogInfoHandler = (indexToRemove) => {
    setFormValues(formValues.filter((_, index) => index !== indexToRemove));
  };

  //*** UI '짤림 현상'해결
  // dogNames 변경 시마다, 높이 자동조절
  // ('반려견 추가' 클릭 시, 새로운 elem들이 나타남으로서, slide의 height값이 증가됨
  // => swiper library의 default function으로서,
  // => swiper-wrapper의 style에 height값이 강제로 할당되어있어서,
  // => 증가된 height부분은  UI가 짤림현상이 발생함)
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step1Page}>
      <div className={s.input_name_container}>
        <label htmlFor={'name'}>
          <p className={s.input_title}>반려견의 이름이 무엇인가요 ?</p>
          <div className={s.input_name_box}>
            {formValues?.map((dog, index) => (
              <div key={index} className={s.input_name_wrapper}>
                <input
                  id={`name`}
                  className={s.input_name}
                  type="text"
                  placeholder="이름을 입력해주세요"
                  data-input-type={'string'}
                  value={dog.name || ''}
                  onChange={(e) => onInputChangeHandler(e, index)}
                />
                {formValues.length > 1 && (
                  <button
                    className={s.input_remove_button}
                    onClick={() => removeDogInfoHandler(index)}
                  >
                    제거
                  </button>
                )}
              </div>
            ))}
            <button className={s.input_add_btn} onClick={addDogInfoHandler}>
              <BsPlus />
              <p>반려견 추가하기</p>
            </button>
            <div className={s.input_name_guide}>
              💡 몇 가지 설문을 통해 3분 안에 보호자님의
              <br />
              반려견만을 위한 맞춤형 식사를 만들어보세요!
            </div>
          </div>
        </label>
      </div>
    </section>
  );
}
