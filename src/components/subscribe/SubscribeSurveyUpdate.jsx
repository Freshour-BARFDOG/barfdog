import s from '/src/pages/mypage/subscribe/[subscribeId].module.scss';
import React, { useContext, useEffect, useState } from 'react';

export const SubscribeSurveyUpdate = () => {
  return (
    <>
      <div className={`${s.survey_update_text}`}>
        <div className={s.text}>
          반려견의 현재 건강 상태가 변경되었나요?
          <br />
          변경된 내용을 건강 문진에서 재등록 해주세요.
          <br />
          <span>예) 중성화 여부 변경, 몸무게 변화 등</span>
        </div>
        <button>건강 문진 재등록 바로 가기</button>
      </div>
    </>
  );
};
