import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
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
          <p>피로회복 영양식</p>
        </div>
        <div className={s.modal_content_text}>
          단백질과 필수 아미노산이 풍부하여 피로회복에 좋은 기력 회복 레시피
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
          <p>관절 강화에 필수인 강황가루</p>
        </div>
        <div className={s.modal_content_text}>높은 흡수율로 관절 강화를 돕습니다</div>
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
          <p>면역체계에 필수인 아연과 셀레늄</p>
        </div>
        <div className={s.modal_content_text}>
          강력한 항산화력으로 신체 조직의 노화 방지를 도와줍니다
          <br/>
          항산화 작용은 해독 작용과 면역 기능을 증진시키고 염증 등을 예방시켜줍니다
        </div>
      </div>
    </div>
  );
};