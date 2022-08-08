import React, {useEffect, useRef, useState} from 'react';
import {slideDown, slideUp} from '../../../util/func/slideToggle';
import s from '../../pages/mypage/subscribe/[subscribeId].module.scss';
import {IoIosArrowForward} from 'react-icons/io';

export function ToggleBox ({title, className, children,  ...props}) {
  const [visible, setVisible] = useState( false ); // ! 또는 useState(false) --> 토글박스 초기상태 설정
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
    <div className={`${s.toggleBox} ${visible && s.active} ${className ? className : ''}`} {...props}>
      <div className={`${s.clickTrigger} clearfix`} onClick={onClickHandler}>
        <h2 className={s.title}>
          {title}
          <i>
            <IoIosArrowForward/>
          </i>
        </h2>
      </div>
      <div className={s.cont} ref={boxRef}>
        {children}
      </div>
    </div>
  );
}