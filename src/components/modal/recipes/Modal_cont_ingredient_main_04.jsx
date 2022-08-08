import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_ingredient_main_04 = () => {
  return (
    <div data-modal-type="lambAndBeef">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/sheep.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>양</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/cow.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>소</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/blueberries.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>블루베리</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/kale.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>케일</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/hempseed.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>햄프씨드</p>
        </div>
      </div>
    </div>
  );
};