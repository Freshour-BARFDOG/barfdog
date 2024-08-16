import React from 'react';
import s from './surveyStatistics.module.scss';
import { Swiper_dogInfo } from './Swiper_dogInfo';

export default function SurveyScore({ surveyInfo }) {
  return (
    <div className={s.dog_info_wrapper}>
      <div className={s.dog_info_name}>
        <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)의 건강
        종합 점수
      </div>
      <div className={s.dog_score_text}>
        ※ 해당 결과지는 바프독 고객을 대상으로한 참고용 결과이니, <br />
        자세한 반려견 건강 상태는 담당 수의사와 상담해 주세요.
      </div>
    </div>
  );
}
