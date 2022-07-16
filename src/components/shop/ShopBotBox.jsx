import React, {useEffect, useRef, useState} from 'react';
import {slideDown, slideUp} from '../../../util/func/slideToggle';
import Styles from '../../pages/shop/single.module.scss';
import Image from 'next/image';

export function ShopBotBox ({title, children}) {
  const [visible, setVisible] = useState( false );
  const boxRef = useRef( null );
  
  const onClickHandler = (e) => {
    visible ? setVisible( false ) : setVisible( true );
  };
  
  useEffect( () => {
    console.log( visible );
    const selectedElem = boxRef.current;
    if ( !selectedElem ) return;
    visible ? slideDown( selectedElem ) : slideUp( selectedElem );
  }, [visible] );
  return (
    <li className={`${Styles.box_wrap} ${visible && Styles.active}`}>
      <div className={`${Styles.guide} clearfix`} onClick={onClickHandler}>
        <h2 className={Styles.box_text}>{title}</h2>
        <span className={`${Styles.image} img-wrap`}>
          <Image
            src={require( '/public/img/shop/single/shop_main_guide_1.png' )}
            objectFit="cover"
            layout="fill"
            alt="카드 이미지"
          />
        </span>
      </div>
      <div className={Styles.box_cont} ref={boxRef}>
        <div className={Styles.text}>{children}</div>
      </div>
    </li>
  );
}