import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import SurveyInputRadio from '/src/components/survey/SurveyInputRadio';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZeo from '/util/func/filter_extraIntegerNumberZeo';
import { CustomSelectWithCustomOptions } from './CustomSelectWithCustomOptions';
import { DogTypeCustomSelectWithCustomOptions } from './DogTypeCustomSelectWithCustomOptions';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import CustomRadioTrueOrFalse from '/src/components/admin/form/CustomRadioTrueOrFalse';
import { dogBreedType } from '/store/TYPE/dogBreedType.js';
import { genderType } from '/store/TYPE/genderType';
import { dogSizeType } from '/store/TYPE/dogSizeType';

export default function SurveyStep1({ formValues, setFormValues }) {
  const [birth, setBirth] = useState('');

  useEffect(() => {
    const yyyymm = [];
    for (const key in birth) {
      const val = birth[key];
      switch (key) {
        case 'yyyy':
          yyyymm[0] = val;
          break;
        case 'mm':
          yyyymm[1] = val;
          break;
      }
    }
    console.log(yyyymm);

    setFormValues((prevState) => ({
      ...prevState,
      birth: yyyymm.join(''),
    }));
  }, [birth]);

  const yearOptions = createYearOptionList(50).year;
  const monthOptions = createYearOptionList().month;

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

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  return (
    <section className={s.step1Page}>
      <div className={s['input-row']}>
        <label htmlFor={'name'}>
          <p className={s.input_title}>반려견 이름</p>
          <input
            id={'name'}
            className={`${s.input_box_1} ${s['focus-underline']}`}
            type="text"
            placeholder="이름을 입력해주세요"
            data-input-type={'string'}
            value={formValues.name || ''}
            onChange={onInputChangeHandler}
          />
        </label>
      </div>
      <div className={s['input-row']}>
        <div className={s.input_title}>반려견 성별</div>
        <SurveyInputRadio
          formValueKey={'gender'}
          surveyValues={formValues.gender}
          setSurveyValues={setFormValues}
          title="반려견 성별"
          className={s.radio_gender}
          idList={[genderType.MALE, genderType.FEMALE]}
          labelList={['수컷', '암컷']}
        />
      </div>
      <div className={s['input-row']}>
        <div className={s.input_title}>반려견 출생년월</div>
        <ul className={s.dogBirth}>
          <li>
            <CustomSelectWithCustomOptions
              id={'yyyy'}
              options={yearOptions}
              setValues={setBirth}
              unit={'년'}
              width={120}
            />
          </li>
          <li>
            <CustomSelectWithCustomOptions
              id={'mm'}
              options={monthOptions}
              setValues={setBirth}
              unit={'월'}
              width={120}
            />
          </li>
        </ul>
        <div className={s.radio_check}>
          <label htmlFor={'oldDog'}>
            <PureCheckbox
              id={'oldDog'}
              theme={'circle'}
              value={formValues.oldDog || ''}
              setValue={setFormValues}
            />
            노령견입니다.
          </label>
        </div>
      </div>

      <div className={s['input-row']}>
        <SurveyInputRadio
          surveyValues={formValues.size}
          setSurveyValues={setFormValues}
          title="강아지 체급"
          className={s.dog_choice}
          name="dogSize"
          idList={[dogSizeType.SMALL, dogSizeType.MIDDLE, dogSizeType.LARGE]}
          labelList={['소형견', '중형견', '대형견']}
          formValueKey={'dogSize'}
        />
      </div>

      <div className={s['input-row']}>
        <div className={s.input_title}>견종선택</div>

        <DogTypeCustomSelectWithCustomOptions
          id={'dogType'}
          options={dogBreedType.map((dogType) => ({ value: dogType }))}
          setFormValues={setFormValues}
          width={360}
        />
      </div>
      <div className={s['input-row']}>
        <label htmlFor={'weight'}>
          <div className={s.input_title}>반려견 몸무게</div>
          <div className={s.flex_box}>
            <div className={s.inner_kg}>
              <input
                id={'weight'}
                type="text"
                name="survey"
                data-input-type={'number, demicals-1, ints-2'}
                placeholder="00.0"
                className={`${s['focus-underline']}`}
                value={formValues.weight}
                onChange={onInputChangeHandler}
              />
              <em className={s.unit}>kg</em>
            </div>
          </div>
        </label>
      </div>

      <div className={s['input-row']}>
        <div className={s.input_title}>중성화 여부</div>
        <CustomRadioTrueOrFalse
          name="neutralization"
          value={formValues.neutralization}
          setValue={setFormValues}
          theme={'letter-in-shape'}
          labelList={['했습니다', '안했습니다']}
        />
      </div>
    </section>
  );
}

function createYearOptionList(listCount = 1) {
  // YEAR
  const yearOptions = [];
  const curYear = new Date().getFullYear();
  const endYear = curYear;
  const startYear = endYear - listCount;
  for (let i = 0; i < endYear - startYear; i++) {
    const year = (endYear - i).toString();
    const label = `${year}년`;
    yearOptions.push({ label: label, value: year });
  }

  // MONTH
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const month = ('0' + (i + 1).toString()).slice(-2);
    const label = `${month}월`;
    monthOptions.push({ label: label, value: month });
  }
  // '선택' label
  // const initialValue = { label: '선택', value: '' };
  // yearOptions.unshift(initialValue);
  // monthOptions.unshift(initialValue);

  return { year: yearOptions, month: monthOptions };
}

const filter_ints = (numString, intCount) => {
  const val = numString;
  let digits = typeof intCount !== 'number' ? Number(intCount) : intCount;
  const int = val.split('.')[0];
  if (!int) {
    return numString;
  }
  const demical = val.split('.')[1];
  if (!demical) {
    return numString;
  }
  const convertedInt = int.substring(0, digits);
  // console.log(`${convertedInt}.${demical}`);
  return `${convertedInt}.${demical}`;
};

const filter_demicals = (numString, demicalCount) => {
  const val = numString;
  let digits = typeof demicalCount !== 'number' ? Number(demicalCount) : demicalCount;
  const int = val.split('.')[0];
  const demicalPart = val.split('.')[1];
  if (!demicalPart) {
    return numString;
  }

  const demical = val.split('.')[1].substring(0, digits);
  // console.log(`${int}.${demical}`);
  return `${int}.${demical}`;
};
