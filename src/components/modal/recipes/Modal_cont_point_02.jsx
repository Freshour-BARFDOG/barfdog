import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require( 'public/img/recipes/recipe_check.png' )}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>양질의 단백질, 풍부한 아미노산</p>
        </div>
        <div className={s.modal_content_text}>
          성장 단계의 자견의 발육과 성견의 영양 보충에 도움을 줍니다
        </div>
      </div>
      
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require( 'public/img/recipes/recipe_check.png' )}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>면역체계에 좋은 셀레늄</p>
        </div>
        <div className={s.modal_content_text}>
          노화 방지, 혈액순환 촉진, 항암력을 증진 시켜 면역 체계에 도움을 줍니다
        </div>
      </div>
      
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require( 'public/img/recipes/recipe_check.png' )}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>무가공된 육즙과 자연의 맛</p>
        </div>
        <div className={s.modal_content_text}>
          가공을 거치지 않은 자연 그대로의 풍부한 육즙과 맛은 입맛이 까다로운 친구들에게도 즐거운
          식사로 기억될 것입니다
        </div>
      </div>
    </div>
  );
};