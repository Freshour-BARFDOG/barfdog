import s from '../../pages/order/subscribeShop/index.module.scss';
import Image from 'next/image';
import React from 'react';

export const SubscribeRecommendResult = ({info}) => {
  return (
    <section className={s.order_title}>
      <h1 className={s.text}>결과지를 종합해본 결과</h1>
      <div className={s.title_content_box}>
        <div className={s.title_grid_box}>
          <div className={s.grid_left}>
            <figure className={`${s.image} img-wrap`}>
              <Image
                priority
                src={info.recommendRecipeImgUrl}
                objectFit="cover"
                layout="fill"
                alt={info.recommendRecipeName}
              />
            </figure>
            <figcaption className={s.recipe_title}>
              <p className={s.title_ko}>{info.uiNameKorean}</p>
              <p className={s.title_en}>{info.uiNameEnglish}</p>
            </figcaption>
          </div>
          
          <div className={s.grid_right}>
            <p className={s.result_title}>
              {info.dogName}에게는
              <br/>
              {info.recommendRecipeDescription}이 필요한
              <br/>
              <b>{info.recommendRecipeName}</b> 레시피를 추천합니다. <br/>
            </p>
            <div className={s.recommend_data_wrap}>
              <span className={s.title}>{info.dogName}의 하루 권장 칼로리</span>
              <span className={s.data}>
                {info.foodAnalysis.oneDayRecommendKcal?.toFixed( 0 )}kcal
              </span>
              <span className={s.title}>하루 권장 식사량</span>
              <span className={s.data}>{info.foodAnalysis.oneDayRecommendGram?.toFixed( 0 )}g</span>
              <span className={s.title}>
                한끼 권장 식사량
                <br/>
                <span>&#40;하루 두 끼 기준&#41;</span>
              </span>
              <span className={s.data}>{info.foodAnalysis.oneMealRecommendGram?.toFixed( 0 )}g</span>
            </div>
            <div className={s.desc}>바프독 생식기준 결과</div>
          </div>
        </div>
      </div>
    </section>
  );
};