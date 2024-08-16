import React, { useEffect, useState } from 'react';
import s from './surveyStatistics.module.scss';
import { Swiper_dogInfo } from './Swiper_dogInfo';
import { postObjData } from '../../../pages/api/reqData';

export default function SurveyDogInfo({ surveyInfo }) {
  const [data, setData] = useState({});
  const [dogTypeInfo, setDogTypeInfo] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/dogs/commonDogInfo`;
        const body = { dogType: surveyInfo.dogType };
        const res = await postObjData(url, body);
        // console.log(res);
        if (res?.status === 200) {
          const data = res.data.data;

          setData(data);

          const keywords = data.keyword.split('/').map((kw) => kw.trim());

          // 평균값 계산
          // const avgHeight = (data.minHeight + data.maxHeight) / 2;
          // const avgWeight = (data.minWeight + data.maxWeight) / 2;

          setDogTypeInfo({
            keywords,
            height: { min: data.minHeight, max: data.maxHeight },
            weight: { min: data.minWeight, max: data.maxWeight },
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, []);

  console.log(dogTypeInfo);

  return (
    <div className={s.dog_info_wrapper}>
      <div className={s.dog_info_name}>
        <span className={s.under_text}>{surveyInfo.myDogName}</span> (이)는{' '}
        <span className={s.under_text}>{surveyInfo.dogType}</span> (이)군요!
      </div>
      <div className={s.dog_info_text}>
        {surveyInfo.dogType} (과)와 어울리는 키워드는 <br />
        {dogTypeInfo.keywords?.map((keyword, index) => (
          <span key={index}>
            {' '}
            <b>#{keyword}</b>
          </span>
        ))}{' '}
        이에요! <br /> <br />
        {surveyInfo.dogType} 견종에 대한 정보를 알려드릴게요! <br />본 자료는
        참고용으로만 확인해주세요 :)
      </div>
      {/* 스와이퍼 추가 */}
      <Swiper_dogInfo data={dogTypeInfo} />
    </div>
  );
}
