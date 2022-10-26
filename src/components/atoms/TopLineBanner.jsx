import React, { useEffect, useState } from 'react';
import Wrapper from '/src/components/common/Wrapper';
import Link from 'next/link';
import CloseButton from './CloseButton';
import s from './topLineBAnner.module.scss';
import { getCookie, setCookie } from '/util/func/cookie';
import { getData } from '../../pages/api/reqData';
import PreviewInnerHTML from './PreviewInnerHTML';
import { exposeType } from '../../../store/TYPE/exposeType';

const TopLineBanner = () => {
  const initialInfo = {
    name: '지금 바프독 가입하고 첫 정기구독 50% 할인 받기 > ',
    backgroundColor: 'var(--color-main)',
  };

  const [isVisible, setIsVisible] = useState();
  const [info, setInfo] = useState(initialInfo);

  useEffect(() => {
    (async () => {
      try {
        const url = `/api/banners/top`;
        const res = await getData(url);
        console.log('TopLineBanner RES: ', res);
        if (res.data) {
          const data = res.data;
          const DATA = {
            id: data.id,
            name: data.name,
            status: data.status,
            backgroundColor: data.backgroundColor,
            fontColor: data.fontColor,
            pcLinkUrl: data.pcLinkUrl,
            mobileLinkUrl: data.mobileLinkUrl,
          };
          setInfo(DATA);
        }
      } catch (err) {
        console.error(err);
      }
    })();

    const visibility = getCookie('topbanner') !== 'false';
    setIsVisible(visibility);
  }, []);

  const onHideHandler = () => {
    setCookie('topbanner', 'false', 'date', 1);
    setIsVisible(false);
  };

  return (
    <>
      {info.status === exposeType.LEAKED && (
        <div
          id="TOP_LINE_BANNER"
          className={`${s.topLineBanner} ${isVisible ? '' : s.invisible}`}
          style={{
            backgroundColor: info.backgroundColor,
            color: info.fontColor,
            height: `${isVisible ? '' : '0px'}`,
          }}
        >
          <Wrapper>
            <Link href="/account/signup" passHref>
              <a className={s.text}>
                <PreviewInnerHTML
                  innerHTML={info.name}
                  style={{
                    backgroundColor: info.backgroundColor,
                    color: info.fontColor,
                  }}
                />
              </a>
            </Link>
            <CloseButton onClick={onHideHandler} className={s['close-button']} lineColor={'#fff'} />
          </Wrapper>
        </div>
      )}
    </>
  );
};

export default TopLineBanner;
