import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_01 = () => {
  return (
    <div data-modal-type="starterPremium">
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
          <p>첫 생식에 완벽한 레시피</p>
        </div>
        <div className={s.modal_content_text}>
          생식이 처음인 아이들이 편하게 적응 할 수 있도록 도와줍니다
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
          <p>생식의 시작</p>
        </div>
        <div className={s.modal_content_text}>
          전 세계 생식 레시피에서 첫 생식으로 권장하는 흰살코기 닭고기와 칠면조를 담았습니다
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
          <p>높은 흡수율과 소화</p>
        </div>
        <div className={s.modal_content_text}>
          부드러운 생고기와 우수한 흡수력을 집중하여 설계된 레시피 입니다
        </div>
      </div>
    </div>
  );
};