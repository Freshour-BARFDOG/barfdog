import s from '/src/pages/survey/survey.module.scss';
import SurveyInputRadio from './SurveyInputRadio';
import React from 'react';

export default function SurveyStep2 ({formValues, setFormValues}) {
  return (
    <section className={s.step2page}>
      <div className={s.input_title}>반려견의 활동량은</div>

      <div className="input-row">
        <SurveyInputRadio
          surveyValues={formValues.healthStatus}
          setSurveyValues={setFormValues}
          title="종류"
          className={s.activity}
          name="activity"
          idList={[
            'healthStatus-TOO LITTLE',
            'healthStatus-LTTIEL',
            'healthStatus-USUALLY',
            'healthStatus-MUCH',
            'healthStatus-TOO MUCH',
          ]}
          labelList={['매우 적어요', '', '보통', '', '매우 많아요']}
          defaultStyle
        />
      </div>

      <div className={s.input_title}>일주일 산책 횟수</div>

      <div className={s.flex_box2}>
        <div className={s.inner_flex_box}>
          평균
          <div className={`${s.inner}  ${s['input-wrap']}`}>
            <input className={`${s.input_1} ${s['focus-underline']}`} type="text" name="survey" />
            <em className={`${s.unit}`}>회</em>
          </div>
        </div>
        <div className={s.inner_flex_box}>
          1회 당
          <div className={`${s.inner}  ${s['input-wrap']}`}>
            <input type="text" className={`${s.input_1} ${s['focus-underline']}`} name="survey" />
            <em className={s.unit}>시간</em>
          </div>
        </div>
      </div>

      <div className={s.input_title}>현재 상태는</div>
      <div className="input-row">
        <SurveyInputRadio
          surveyValues={formValues.healthStatus}
          setSurveyValues={setFormValues}
          title="종류"
          className={s.healthStatus}
          name="healthStatus"
          idList={[
            'healthStatus-HEALTH',
            'healthStatus-NEED DIET',
            'healthStatus-SERIOUS FAT',
            'healthStatus-PRAGNENT',
            'healthStatus-LACATATING',
          ]}
          labelList={['건강해요', '다이어트 필요', '심각한 비만', '임신한 상태', '수유 중']}
        />
      </div>
    </section>
  );
};