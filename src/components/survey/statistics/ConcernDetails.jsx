import React from 'react';
import s from './surveyStatistics.module.scss';

export default function ConcernDetails({ chartData }) {
  return (
    <div className={s.dog_info_wrapper}>
      <div className={s.dog_info_name}>
        그 외 고민 사항들에 대한 도움도 함께 드릴게요!
      </div>
    </div>
  );
}
