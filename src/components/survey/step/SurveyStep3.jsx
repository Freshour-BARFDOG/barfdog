import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import { SurveyDogTypeCustomSelectWithCustomOptions } from '../SurveyDogTypeCustomSelectWithCustomOptions';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import { dogBreedType } from '/store/TYPE/dogBreedType.js';

export default function SurveyStep3({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const [activeIndexList, setActiveIndexList] = useState([]);

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
    // targetSwiperElem.style.minHeight = rem(750);
  }, [formValues]);

  return (
    <section id="surveyPage" className={s.step3Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.dogSize_dogType_container}>
          <p className={s.input_title}>{dog.name} (이)의 견종은 무엇인가요 ?</p>
          <div className={s.input_dogSize_dogType_box}>
            <SurveyInputRadio
              formValueKey={'dogSize'}
              formValues={formValues}
              setFormValues={setFormValues}
              className={s.dog_choice}
              idList={[
                dogSizeType.SMALL,
                dogSizeType.MIDDLE,
                dogSizeType.LARGE,
              ]}
              labelList={['소형견', '중형견', '대형견']}
              dogInfo={dog}
              dogInfoIndex={index}
              onInputChangeHandler={onInputChangeHandler}
            />
            <SurveyDogTypeCustomSelectWithCustomOptions
              id={'dogType'}
              options={dogBreedType.map((dogType) => ({
                label: dogType.label,
                value: dogType.value,
              }))}
              value={formValues}
              setFormValues={setFormValues}
              width={360}
              // formValues={formValues}
              dogInfoIndex={index}
              // dogInfo={dog}
              activeIndexList={activeIndexList}
              setActiveIndexList={setActiveIndexList}
            />
            <div className={s.dogType_list}></div>
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
    </section>
  );
}
