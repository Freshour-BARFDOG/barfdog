import React, {useEffect, useRef, useState} from 'react';
import {slideDown, slideUp} from '../../../util/func/slideToggle';
import s from '../../pages/review/review.module.scss';
import Image from 'next/image';
import RatingStars from '../atoms/RatingStars';
import {filter_blindingUserName} from '../../../util/func/filter_blindingUserName';

export const ReviewItem = ({item}) => {
  console.log(item)
  const [visible, setVisible] = useState( false );
  const boxRef = useRef( null );
  const onClickHandler = (e) => {
    visible ? setVisible( false ) : setVisible( true );
  };
  
  useEffect( () => {
    const selectedElem = boxRef.current;
    if ( !selectedElem ) return;
    visible ? slideDown( selectedElem ) : slideUp( selectedElem );
  }, [visible] );
  
  return (
    <li>
      <figure className={s.grid_box} onClick={onClickHandler}>
        <span className={s.grid_num}>{item.id}</span>
        <div className={s.mid_box}>
          <i className={`${s.image_product} img-wrap`}>
            {item.thumbnailUrl && (
              <Image src={item.thumbnailUrl} objectFit="contain" layout="fill" alt="리뷰 썸네일"/>
            )}
          </i>
        </div>
        <i className={s.star_box}>
          <RatingStars count={item.star} margin={0} disabled/>
        </i>
        <p className={s.content}>
          <i className={`${s.image} img-wrap`}>
            <Image
              src={require( '/public/img/shop/single/shop_main_slide_picture.png' )}
              objectFit="contain"
              layout="fill"
              alt="카드 이미지"
            />
          </i>
          {item.contents}
        </p>
        <span className={s.grid_name}>{filter_blindingUserName( item?.username )}</span>
        <span className={s.grid_date}>{item.writtenDate}</span>
      </figure>
      <div className={s.text_box} ref={boxRef}>
        <p className={s.text}>{item.contents}</p>
        <div className={s.images}>
          {item.imgList?.map( (d, i) => {
            return <figure
              className={`${s['img-wrap']} img-wrap init-next-image`}
              key={`review-detail-images-${i}`}
            >
              {/*<Image src={d.url} objectFit="cover" layout="fill" alt={d.filename} />*/}
            </figure>
          })}
        </div>
      </div>
    </li>
  );
};