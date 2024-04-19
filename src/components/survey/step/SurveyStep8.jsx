import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import { SurveyCustomSelectWithCustomOptions } from '../SurveyCustomSelectWithCustomOptions';
import { SurveyDogTypeCustomSelectWithCustomOptions } from '../SurveyDogTypeCustomSelectWithCustomOptions';

export default function SurveyStep8({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const [activeIndexList, setActiveIndexList] = useState([]);

  const defaultLabel = { label: '선택', value: '' };
  let walkingCountPerWeekOptions = new Array(21);
  for (let i = 0; i < walkingCountPerWeekOptions.length; i++) {
    if (i === 20) {
      // 배열의 마지막 항목인 경우
      walkingCountPerWeekOptions[i] = {
        label: `${i} 회 이상`,
        value: i.toString(),
      };
    } else {
      walkingCountPerWeekOptions[i] = {
        label: `${i} 회`,
        value: i.toString(),
      };
    }
  }

  let walkingTimePerOneTimeOptions = [
    { label: '30분', value: '0.5' },
    { label: '1시간 30분', value: '1.5' },
    { label: '2시간', value: '2' },
    { label: '2시간 30분', value: '2.5' },
    { label: '3시간 이상', value: '3' },
  ];

  // ! [이전] 시간 단위 (0.5 ~ 12)
  // let walkingTimePerOneTimeOptions = new Array(24);
  // for (let i = 0; i < walkingTimePerOneTimeOptions.length; i++) {
  //   walkingTimePerOneTimeOptions[i] = {
  //     label: `${(i + 1) * 0.5}`,
  //     value: `${((i + 1) * 0.5).toString()}`,
  //   };
  // }

  walkingCountPerWeekOptions.unshift(defaultLabel);
  walkingTimePerOneTimeOptions.unshift(defaultLabel);

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
    // targetSwiperElem.style.minHeight = rem(400);
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step8Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.walk_container}>
          <p className={s.input_title}>{dog.name} (이)의 산책량은 어떤가요 ?</p>
          <div className={s.walk_box}>
            <div className={s.input_walk}>
              주 평균
              <SurveyCustomSelectWithCustomOptions
                id={'walkingCountPerWeek'}
                options={walkingCountPerWeekOptions}
                value={dog.walkingCountPerWeek}
                setFormValues={setFormValues}
                // unit={'회'}
                width={120}
                placeholder={'횟수'}
                dogInfo={dog}
                dogInfoIndex={index}
                activeIndexList={activeIndexList}
                setActiveIndexList={setActiveIndexList}
              />
            </div>
            <div className={s.input_walk}>
              1회 당
              <SurveyCustomSelectWithCustomOptions
                id={'walkingTimePerOneTime'}
                options={walkingTimePerOneTimeOptions}
                value={dog.walkingTimePerOneTime}
                setFormValues={setFormValues}
                // unit={'시간'}
                width={120}
                placeholder={'횟수'}
                dogInfo={dog}
                dogInfoIndex={index}
                activeIndexList={activeIndexList}
                setActiveIndexList={setActiveIndexList}
              />
            </div>
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
