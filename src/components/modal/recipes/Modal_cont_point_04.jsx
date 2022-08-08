import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_point_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
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
          <p>독성해소에 좋은 양고기</p>
        </div>
        <div className={s.modal_content_text}>
          양고기를 기반으로 설계되어 독성해소, 살균, 이뇨, 피부미용에 효과적으로 반려견의 피부와
          모질을 개선하는데 도움을 줍니다
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
          <p>비타민, 칼슘, 인, 철 풍부</p>
        </div>
        <div className={s.modal_content_text}>
          광물질이 풍부하면서 수분함량과 소화력이 높아 양질의 단백질을 올바르게 흡수할 수 있습니다
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
          <p>저칼로리, 고단백, 고칼슘</p>
        </div>
        <div className={s.modal_content_text}>
          풍부하고 질 좋은 단백질과 칼슘은 높이고 지방과 열량은 낮춰 적절한 체중관리를 위한 프리미엄
          식이요법 레시피
        </div>
      </div>
    </div>
  );
};