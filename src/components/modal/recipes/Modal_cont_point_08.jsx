import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_08 = () => {
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
          <p>풍부한 육즙과 높은 기호성</p>
        </div>
        <div className={s.modal_content_text}>
          방목으로 자란 소의 높은 영양가를 담은 풍부한 육즙
          <br />
          까다로운 식성을 가진 반려견도 좋아할 탁월한 기호성
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
          <p>면역 체계 강화와 빈혈 예방</p>
        </div>
        <div className={s.modal_content_text}>
          풍부한 비타민 B12와 철분으로 반려견의 에너지와 혈액 건강을 최상의
          상태로 유지하는데 도움을 줍니다
        </div>
      </div>
    </div>
  );
};
