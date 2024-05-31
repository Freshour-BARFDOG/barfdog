import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_ingredient_main_05 = () => {
  return (
    <div data-modal-type="lambAndBeef">
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
          <div className={`${s.image2} img-wrap `}>
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
          <div className={`${s.image2} img-wrap img-icon`}>
            <Image
              priority
              src={require('public/img/recipes/banana.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>녹색바나나</p>
        </div>
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require('public/img/recipes/strawberry.png')}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>딸기</p>
        </div>
      </div>
    </div>
  );
};
