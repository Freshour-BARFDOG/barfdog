import React, { useEffect, useState } from 'react';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import CloseButton from './CloseButton';
import s from './topLineBAnner.module.scss';
import { getCookie, setCookie } from '/util/func/cookie';





const DATA = {
  text: '지금 바프독 가입하고 첫 정기구독 50% 할인 받기 > ',
  backgroundColor: 'var(--color-main)',
};



const TopLineBanner = () => {

  const [isVisible, setIsVisible] = useState();

  useEffect(() => {
    const visibility = getCookie('bf-topbanner') !== 'false';
    setIsVisible(visibility);
  }, []);

  const onHideHandler = () => {
    setCookie('bf-topbanner', 'false', 'date', 1);
    setIsVisible(false);

  };

  return (
    <div
      id="TOP_LINE_BANNER"
      className={`${s.topLineBanner} ${!isVisible ? s.invisible : ''}`}
      style={{ backgroundColor: DATA.backgroundColor, height: `${!isVisible ? '0px' : ''}` }}
    >
      <Wrapper>
        <Link href="/account/signup" passHref>
          <a className={s.text}>{DATA.text}</a>
        </Link>
        <CloseButton onClick={onHideHandler} className={s['close-button']} lineColor={'#fff'} />
      </Wrapper>
    </div>
  );
};

export default TopLineBanner;
