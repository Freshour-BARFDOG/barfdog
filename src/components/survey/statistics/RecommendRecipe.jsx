import React from 'react';
import s from './surveyStatistics.module.scss';

export default function RecommendRecipe({ surveyInfo }) {
  return (
    <div className={s.dog_info_wrapper}>
      <div className={s.dog_info_name}>
        <span className={s.under_text}>{surveyInfo.myDogName}</span>이 필요한
        <br />
        <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)에게
        추천하는 레시피
      </div>
    </div>
  );
}
