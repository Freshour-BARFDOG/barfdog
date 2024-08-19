import React from 'react';
import s from './surveyStatistics.module.scss';

export default function HealthScoreAnalysis({ surveyInfo }) {
  return (
    <section className={s.health_score_analysis}>
      <div>건강점수</div>
      <div>전체 반려견 중</div>
      <div>다른 견종 중엔?</div>
    </section>
  );
}
