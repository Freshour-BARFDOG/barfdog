import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_ingredient_main_02 = () => {
  return (
    <div data-modal-type="turkeyAndBeef">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/turkey.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>칠면조</p>
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
              src={require( 'public/img/recipes/apple.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>사과</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/chiaseed.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>치아씨드</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/pumpkin.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>호박씨</p>
        </div>
      </div>
    </div>
  );
};