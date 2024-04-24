import s from '/src/pages/survey/survey.module.scss';
import SurveyInputRadio from './AdminSurveyInputRadio';
import React from 'react';
import { dogActivityLevelType } from '/store/TYPE/dogActivityLevelType';
import { CustomSelectWithCustomOptions } from './CustomSelectWithCustomOptions';
import { dogPhysicalStatusType } from '/store/TYPE/dogPhysicalStatusType';

export default function SurveyBundleStep2({ formValues, setFormValues }) {
  const defaultLabel = { label: '선택', value: '' };
  let walkingCountPerWeekOptions = new Array(7);
  for (let i = 0; i < walkingCountPerWeekOptions.length; i++) {
    walkingCountPerWeekOptions[i] = {
      label: `${i + 1}`,
      value: (i + 1).toString(),
    };
  }

  let walkingTimePerOneTimeOptions = new Array(24);
  for (let i = 0; i < walkingTimePerOneTimeOptions.length; i++) {
    walkingTimePerOneTimeOptions[i] = {
      label: `${(i + 1) * 0.5}`,
      value: `${((i + 1) * 0.5).toString()}`,
    };
  }

  walkingCountPerWeekOptions.unshift(defaultLabel);
  walkingTimePerOneTimeOptions.unshift(defaultLabel);

  // // console.log(formValues)

  return (
    <section id="surveyPage" className={s.step2page}>
      <div className={s.input_title}>반려견의 활동량은</div>
      <div className="input-row">
        <SurveyInputRadio
          formValueKey={'activityLevel'}
          formValues={formValues}
          setFormValues={setFormValues}
          className={s.activityLevel}
          idList={[
            dogActivityLevelType.VERY_LITTLE,
            dogActivityLevelType.LITTLE,
            dogActivityLevelType.NORMAL,
            dogActivityLevelType.MUCH,
            dogActivityLevelType.VERY_MUCH,
          ]}
          labelList={[
            dogActivityLevelType.KOR.VERY_LITTLE,
            '',
            dogActivityLevelType.KOR.NORMAL,
            '',
            dogActivityLevelType.KOR.VERY_MUCH,
          ]}
          defaultStyle
        />
      </div>

      <div className={s.input_title}>일주일 산책 횟수</div>
      <div className={s.flex_box2}>
        <div className={s.inner_flex_box}>
          평균
          <CustomSelectWithCustomOptions
            id={'walkingCountPerWeek'}
            options={walkingCountPerWeekOptions}
            value={formValues.walkingCountPerWeek}
            setValues={setFormValues}
            unit={'회'}
            width={120}
            placeholder={'n'}
          />
        </div>
        <div className={s.inner_flex_box}>
          1회 당
          <CustomSelectWithCustomOptions
            id={'walkingTimePerOneTime'}
            options={walkingTimePerOneTimeOptions}
            value={formValues.walkingTimePerOneTime}
            setValues={setFormValues}
            unit={'시간'}
            width={120}
            placeholder={'0.0'}
          />
        </div>
      </div>
      <div className={s.input_title}>현재 상태는</div>
      <div className="input-row">
        <SurveyInputRadio
          formValueKey={'dogStatus'}
          formValues={formValues}
          setFormValues={setFormValues}
          className={s.dogStatus}
          idList={[
            dogPhysicalStatusType.HEALTHY,
            dogPhysicalStatusType.NEED_DIET,
            dogPhysicalStatusType.OBESITY,
            dogPhysicalStatusType.PREGNANT,
            dogPhysicalStatusType.LACTATING,
          ]}
          labelList={[
            dogPhysicalStatusType.KOR.HEALTHY,
            dogPhysicalStatusType.KOR.NEED_DIET,
            dogPhysicalStatusType.KOR.OBESITY,
            dogPhysicalStatusType.KOR.PREGNANT,
            dogPhysicalStatusType.KOR.LACTATING,
          ]}
        />
      </div>
    </section>
  );
}
