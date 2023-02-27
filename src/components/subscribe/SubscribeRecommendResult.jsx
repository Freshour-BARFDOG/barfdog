import s from '../../pages/order/subscribeShop/index.module.scss';
import Image from 'next/image';
import React from 'react';
import checkStringUnderConsonant from "/util/func/checkStringUnderConsonant";

export const SubscribeRecommendResult = ({info}) => {
  
  
  const recommendDescriptionForSurvey = info.recipeInfoList.length > 0 && info.recipeInfoList?.filter(recipe=>recipe.id === info.recommendRecipeId)[0].descriptionForSurvey;
  const hasRecipeNameUnderConsonant = checkStringUnderConsonant(recommendDescriptionForSurvey);
  
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

          <div className={s.result_title}>
            <p>{info.dogName}에게는</p>
            <p>
              <em className={s.accent}>{recommendDescriptionForSurvey}</em>
              {/* <span>{hasRecipeNameUnderConsonant ? '이' : '가'} </span>필요한
              </p>
              <p> */}
              <b>{info.recommendRecipeName}</b> 레시피를 추천합니다.
            </p>
          </div>
          
          <div className={s.grid_right}>
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