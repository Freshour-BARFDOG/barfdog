import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_ingredient_main_01 = () => {
  return (
    <div data-modal-type="starterPremium">
      <div className={s.modal_image_box3}>
        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/chicken.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>닭</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/turkey.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>칠면조</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/cauliflower.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>콜리플라워</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/mushroom.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>표고버섯</p>
        </div>

        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/blueberries.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>블루베리</p>
        </div>
      </div>
    </div>
  );
};
