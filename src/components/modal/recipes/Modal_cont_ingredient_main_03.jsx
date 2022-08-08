import s from '../../../pages/recipes/recipes.module.scss';
import Image from 'next/image';
import React from 'react';

export const Modal_cont_ingredient_main_03 = () => {
  return (
    <div data-modal-type="duckAndLamb">
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
              src={require( 'public/img/recipes/duck.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>오리</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/kelp.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>켈프</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/coconutoil.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>코코넛오일</p>
        </div>
        
        <div className={s.image_box}>
          <div className={`${s.image2} img-wrap`}>
            <Image
              priority
              src={require( 'public/img/recipes/curcuma.png' )}
              objectFit="cover"
              layout="fill"
              alt="브랜드 소개 이미지"
            />
          </div>
          <p>강황</p>
        </div>
      </div>
    </div>
  );
};