import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_06 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/recipes/recipe_check.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>풍부한 비타민과 미네랄</p>
        </div>
        <div className={s.modal_content_text}>
          칠면조 고기는 비타민 B6, B12, 리보플라빈, 니아신 등 다양한 비타민과
          철, 아연,셀레늄 등의 미네랄이 풍부해 에너지 대사, 면역 기능, 피부 및
          털 건강 유지에 도움을 줍니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/recipes/recipe_check.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>편안한 소화</p>
        </div>
        <div className={s.modal_content_text}>
          소화 문제를 겪는 반려견이라면 소화가 잘되는 칠면조 고기를 추천합니다
        </div>
      </div>

      <div className={s.modal_text_box}>
        <div className={s.modal_recipe_text}>
          <div className={s.image_box}>
            <div className={`${s.image} img-wrap`}>
              <Image
                priority
                src={require('public/img/recipes/recipe_check.png')}
                objectFit="cover"
                layout="fill"
                alt="브랜드 소개 이미지"
              />
            </div>
          </div>
          <p>고단백, 저지방의 고품질 단백질</p>
        </div>
        <div className={s.modal_content_text}>
          근육 유지와 체중 관리에 도움이 되며 전반적인 건강 증진에 도움
        </div>
      </div>
    </div>
  );
};
