import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_07 = () => {
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
          <p>오메가-3 및 오메가-6 지방산</p>
        </div>
        <div className={s.modal_content_text}>
          양고기의 오메가-3와 오메가-6 지방산은 반려견의 털을 부드럽게 만들어
          주며 염증을 완화시키는데 도움을 줍니다
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
          <p>입맛을 자극하는 풍미</p>
        </div>
        <div className={s.modal_content_text}>
          까다로운 식성을 가진 친구라도 양고기 본연의 풍미는 식욕을 증진시키는데
          도움을 줄 수 있습니다
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
          <p>체중 관리에 도움</p>
        </div>
        <div className={s.modal_content_text}>
          L-카르니틴 성분은 반려견 심장 건강을 지원하고 지방 대사를 촉진하여
          체중 관리에 도움을 줄 수 있답니다
        </div>
      </div>
    </div>
  );
};
