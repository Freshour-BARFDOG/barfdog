import React, { useState } from 'react';
import s from './surveyStatistics.module.scss';
import Image from 'next/image';
import { recommendRecipeDescriptionList } from './recommendRecipeDescription';

export default function ConcernDetails({ etcConcernsData }) {
  console.log('etcConcernsData___', etcConcernsData);

  const [isActiveIdx, setIsActiveIdx] = useState(null);

  const activeIdxHandler = (index) => {
    setIsActiveIdx((prevIdx) => (prevIdx === index ? null : index));
  };

  return (
    <section className={s.concern_details}>
      <h1>그 외 고민 사항들에 대한 도움도 함께 드릴게요!</h1>
      <ul>
        {etcConcernsData.map((data, index) => (
          <li key={index}>
            <div className={s.concern_details_title}>
              <Image
                src={'/img/survey/statistics/toggle.svg'}
                alt="toggle"
                width={18}
                height={18}
                onClick={() => activeIdxHandler(index)}
                className={isActiveIdx === index ? s.rotated : ''}
              />
              <h5>{data}</h5>
            </div>

            {isActiveIdx === index && (
              <div className={s.concern_details_description}>
                {recommendRecipeDescriptionList[data]}
              </div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
