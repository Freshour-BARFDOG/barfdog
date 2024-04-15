import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import rem from '/util/func/rem';
import PureCheckbox from '../SurveyPureCheckbox';
// import SurveyCustomSelectWithCustomOptions from '/src/components/survey/SurveyCustomSelectWithCustomOptions';
// import SurveyBirthYear from './SurveyBirthYear';
import yearOptionList from '/util/func/yearOptionList';
import SurveyBirthday from '../SurveyBirthday';
import SurveyYearMonth from '../SurveyYearMonth';

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

export default function SurveyStep4({
  formValues,
  setFormValues,
  onInputChangeHandler,
  surveyPageRef,
}) {
  const [showBirthOptions, setShowBirthOptions] = useState(false);
  // const [activeIndexList, setActiveIndexList] = useState([]);

  // const birthObj = {
  //   yyyy: formValues.birth?.slice(0, 4),
  //   mm: formValues.birth?.slice(4, 6),
  // };

  // const [birth, setBirth] = useState(birthObj);

  // useEffect(() => {
  //   const birthObj = getSurveyBirthObject(birth);
  //   const hasValue = birthObj.yyyymm.length;
  //   if (hasValue) {
  //     const birthString = birthObj.yyyymm;

  //     // 내용 업데이트
  //     setFormValues((prevFormValues) => {
  //       const newFormValues = prevFormValues.map((item, idx) => {
  //         if (idx === dogInfoIndex) {
  //           return {
  //             ...item,
  //             birth: birthString,
  //           };
  //         }
  //         return item;
  //       });

  //       return newFormValues;
  //     });

  //     // console.log(birthObj);
  //     // setFormValues((prevState) => ({
  //     //   ...prevState,
  //     //   birth: birthString,
  //     // }));
  //   }
  // }, [birth]);

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
    targetSwiperElem.style.minHeight = rem(800);
  }, [formValues]);

  const showBirthOptionsHandler = () => {
    setShowBirthOptions(true);
  };

  return (
    <section id="surveyPage" className={s.step4Page}>
      <div className={s.birth_text}>
        바프독 생식은 생후 3개월 이상의 강아지들에게 권장하고 있습니다. 보다 더
        자세한 상담을 원하시면 <span>문의하기</span>를 통해 상담 받아보세요.
      </div>
      {formValues?.map((dog, index) => (
        <div key={index} className={s.dogBirth_container}>
          <p className={s.input_title}>{dog.name} (이)의 생일은 언제인가요 ?</p>
          <div className={s.input_dogBirth_box}>
            <SurveyBirthday
              className={s['birthday']}
              type={'date'}
              // required={true}
              id={'birth'}
              filteredType={'date'}
              // title={'반려견 생년월일'}
              dogInfoIndex={index}
              dogInfo={dog}
              // formValue={formValues.birth}
              setFormValues={setFormValues}
              value={dog.birth || ''}
              // onChange={(e) => onInputChangeHandler(e, index)}
            />
            {/* 정확히는 모르겠어요 버튼 누르면 -> 아래 뜨게 */}
            <button
              className={s.year_month_btn}
              onClick={showBirthOptionsHandler}
            >
              정확히는 모르겠어요
            </button>

            {/* {showBirthOptions && ( */}
            <ul className={s.dogBirth}>
              <li>
                <SurveyYearMonth
                  id={'yyyy'}
                  options={yearOptions}
                  value={dog.birth?.length >= 4 ? dog.birth.slice(0, 4) : ''}
                  // setValues={setBirth}
                  setFormValues={setFormValues}
                  unit={'년'}
                  width={120}
                  // placeholder={'년도'}
                  placeholder={'yyyy'}
                  dogInfoIndex={index}
                />
              </li>
              <li>
                <SurveyYearMonth
                  id={'mm'}
                  options={monthOptions}
                  // value={dog.birth?.length >= 6 ? dog.birth?.slice(4, 6) : ''}
                  value={
                    dog.birth?.slice(0, -4) !== '0000'
                      ? dog.birth?.slice(4, 6)
                      : ''
                  }
                  // setValues={setBirth}
                  setFormValues={setFormValues}
                  unit={'월'}
                  width={120}
                  // placeholder={'월'}
                  placeholder={'mm'}
                  dogInfoIndex={index}
                />
              </li>
              {/* <li>
                <SurveyCustomSelectWithCustomOptions
                id={'yyyy'}
                options={yearOptions}
                value={dog.birth?.length >= 4 && dog.birth.slice(0, 4)}
                // setValues={setBirth}
                setFormValues={setFormValues}
                unit={'년'}
                width={120}
                placeholder={'yyyy'}
                dogInfoIndex={index}
                />
              </li> */}
            </ul>
            {/* )} */}

            <div className={s.oldDog}>
              <PureCheckbox
                id={'oldDog'}
                theme={'circle'}
                value={dog.oldDog || ''}
                setValue={setFormValues}
                // onClick={(e) => onInputChangeHandler(e, index)}
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
    </section>
  );
}
