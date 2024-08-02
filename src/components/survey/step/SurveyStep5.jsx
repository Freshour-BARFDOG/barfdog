import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import SurveyPureCheck from '../SurveyPureCheck';
// import SurveyCustomSelectWithCustomOptions from '/src/components/survey/SurveyCustomSelectWithCustomOptions';
// import SurveyBirthYear from './SurveyBirthYear';
import surveyYearOptionList from '/util/func/surveyYearOptionList';
import SurveyBirthdayInput from '../SurveyBirthdayInput';
import SurveyYearMonth from '../SurveyYearMonthInput';

// const getSurveyBirthObject = (yyyymmObj) => {
//   const result = {
//     yyyy: '',
//     mm: '',
//     yyyymm: '',
//   };
//   for (const key in yyyymmObj) {
//     const val = yyyymmObj[key];
//     switch (key) {
//       case 'yyyy':
//         result.yyyy = val;
//         result.yyyymm += val;

//         break;
//       case 'mm':
//         result.mm = val;
//         result.yyyymm += val;
//         break;
//     }
//   }
//   return result;
// };

export default function SurveyStep5({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
  errorInfo,
  setIsActiveNextBtn,
  mode,
}) {
  const [showBirthOptionsIndex, setShowBirthOptionsIndex] = useState([]);
  const yearOptions = surveyYearOptionList(50, true).year;
  const monthOptions = surveyYearOptionList(null, true).month;

  // UI '짤림 현상'해결
  useEffect(() => {
    const swiperWrap = surveyPageRef?.current;
    const slideWithDependencyElem = swiperWrap?.querySelector(
      '.swiper-slide-active',
    );
    const activeSlideHeight = slideWithDependencyElem?.offsetHeight;
    const targetSwiperElem = swiperWrap?.querySelector('.swiper-wrapper');
    if (targetSwiperElem) {
      targetSwiperElem.style.height = rem(activeSlideHeight);
    }
  }, [formValues]);

  const showBirthOptionsHandler = (e, index) => {
    setShowBirthOptionsIndex((prevIndexes) => {
      if (prevIndexes.includes(index)) {
        const newFormValues = formValues.map((item, idx) => {
          if (idx === index) {
            return {
              ...item,
              birth: '',
            };
          }
          return item;
        });
        setFormValues(newFormValues);

        // 이미 배열에 있는 경우 제거
        return prevIndexes.filter((i) => i !== index);
      } else {
        // 배열에 없는 경우 추가
        return [...prevIndexes, index];
      }
    });
  };

  console.log(formValues);

  return (
    <section id="surveyPage" className={s.step4Page}>
      {errorInfo.errorMessage && (
        <p className={s.error_message_text}>{errorInfo.errorMessage}</p>
      )}
      {formValues?.map((dog, index) => (
        <div
          key={index}
          className={s.dogBirth_container}
          style={{ height: mode === 'update' && '280px' }}
        >
          <p className={s.input_title}>{dog.name} (이)의 생일은 언제인가요 ?</p>
          <div className={s.input_dogBirth_box}>
            <SurveyBirthdayInput
              className={s['birthday']}
              type={'date'}
              id={'birth'}
              filteredType={'date'}
              dogInfoIndex={index}
              dogInfo={dog}
              setFormValues={setFormValues}
              formValue={dog.birth || ''}
              setIsActiveNextBtn={setIsActiveNextBtn}
            />
            <button
              className={s.year_month_btn}
              onClick={(e) => showBirthOptionsHandler(e, index)}
            >
              정확히는 모르겠어요
            </button>

            {showBirthOptionsIndex.includes(index) && (
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
                    setIsActiveNextBtn={setIsActiveNextBtn}
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
                    setIsActiveNextBtn={setIsActiveNextBtn}
                  />
                </li>
              </ul>
            )}

            <div className={s.oldDog}>
              <SurveyPureCheck
                id={'oldDog'}
                theme={'circle'}
                value={dog.oldDog || ''}
                setValue={setFormValues}
                // onClick={(e) => onInputChangeHandler(e, index)}
                dogInfoIndex={index}
              >
                노령견입니다.
              </SurveyPureCheck>
            </div>
          </div>
          {formValues.length >= 2 && index !== formValues.length - 1 && (
            <div className={s.input_line}></div>
          )}
        </div>
      ))}

      {mode !== 'update' && (
        <div className={s.birth_text_wrapper}>
          <div className={s.birth_text}>
            바프독 생식은 생후 90일 이상의 강아지들에게 권장하고 있습니다. 보다
            더 자세한 상담을 원하시면{' '}
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
      )}
    </section>
  );
}
