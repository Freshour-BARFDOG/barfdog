import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_09 = () => {
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
          <p>식이 단백질에 예민한 반려견에게 추천</p>
        </div>
        <div className={s.modal_content_text}>
          - 저알레르기성 캥거루 단백질로 평소 알러지가 많았던 반려견에게 추천
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
          <p>근육 강화와 체중 관리에 탁월</p>
        </div>
        <div className={s.modal_content_text}>
          - 고단백 저지방의 캥거루 고기
          <br />- 근육 유지와 성장에 도움을 주며 면역 체계 강화에 도움을 줍니다
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
          <p>자연 그대로의 무항생제 캥거루</p>
        </div>
        <div className={s.modal_content_text}>
          - 야생에서 자라난 캥거루 (NO 항생제&성장 촉진제)
          <br />- 보다 더 자연스럽고 건강한 단백질원
        </div>
      </div>
    </div>
  );
};
