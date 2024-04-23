import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import PureCheckbox from '../SurveyPureCheckbox';
import yearOptionList from '/util/func/yearOptionList';
import SurveyBirthday from '../SurveyBirthday';
import SurveyYearMonth from '../SurveyYearMonth';

export default function SurveyStep4({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const [activeIndexList, setActiveIndexList] = useState([]);
  const yearOptions = yearOptionList(50, true).year;
  const monthOptions = yearOptionList(null, true).month;

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef.current;
    const slideWithDependencyElem = swiperWrap.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem.offsetHeight;
    const targetSwiperElem = swiperWrap.querySelector('.swiper-wrapper');
    targetSwiperElem.style.height = rem(activeSlideHeight);
  }, [formValues]);

  const showBirthOptionsHandler = (index) => {
    setActiveIndexList((prevIndexList) => {
      if (prevIndexList.includes(index)) {
        return prevIndexList.filter((i) => i !== index);
      } else {
        return [...prevIndexList, index];
      }
    });
  };

  return (
    <section id="surveyPage" className={s.step4Page}>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.dogBirth_container}>
          <p className={s.input_title}>{dog.name} (이)의 생일은 언제인가요 ?</p>
          <div className={s.input_dogBirth_box}>
            <SurveyBirthday
              className={s['birthday']}
              type={'date'}
              id={'birth'}
              filteredType={'date'}
              dogInfoIndex={index}
              dogInfo={dog}
              setFormValues={setFormValues}
              value={dog.birth || ''}
            />
            <button
              className={s.year_month_btn}
              onClick={() => showBirthOptionsHandler(index)}
            >
              정확히는 모르겠어요
            </button>

            {activeIndexList.includes(index) && (
              <ul className={s.dogBirth}>
                <li>
                  <SurveyYearMonth
                    id={'yyyy'}
                    options={yearOptions}
                    value={dog.birth?.length >= 4 ? dog.birth.slice(0, 4) : ''}
                    setFormValues={setFormValues}
                    unit={'년'}
                    width={120}
                    placeholder={'yyyy'}
                    dogInfoIndex={index}
                  />
                </li>
                <li>
                  <SurveyYearMonth
                    id={'mm'}
                    options={monthOptions}
                    value={
                      dog.birth?.slice(0, -4) !== '0000'
                        ? dog.birth?.slice(4, 6)
                        : ''
                    }
                    setFormValues={setFormValues}
                    unit={'월'}
                    width={120}
                    placeholder={'mm'}
                    dogInfoIndex={index}
                  />
                </li>
              </ul>
            )}

            <div className={s.oldDog}>
              <PureCheckbox
                id={'oldDog'}
                theme={'circle'}
                value={dog.oldDog || ''}
                setValue={setFormValues}
                dogInfoIndex={index}
              >
                노령견입니다.
              </PureCheckbox>
            </div>
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}
      <div className={s.birth_text_wrapper}>
        <div className={s.birth_text}>
          바프독 생식은 생후 90일 이상의 강아지들에게 권장하고 있습니다. 보다 더
          자세한 상담을 원하시면{' '}
          <a
            href="https://36o2x.channel.io/home"
            rel="noreferrer"
            target="_blank"
          >
            문의하기
          </a>
          를 통해 상담 받아보세요.
        </div>
      </div>
    </section>
  );
}
