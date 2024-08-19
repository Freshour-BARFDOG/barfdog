import React from 'react';
import s from './surveyStatistics.module.scss';

export default function WalkingAnalysis({ surveyInfo }) {
  return (
    <section className={s.walking_analysis}>
      <div>
        {surveyInfo.myDogName}(이)의 산책 점검 <span>(일주일 기준)</span>
      </div>
      <div>
        산책 시간<span>(일주일 기준)</span>
      </div>
    </section>
  );
}
