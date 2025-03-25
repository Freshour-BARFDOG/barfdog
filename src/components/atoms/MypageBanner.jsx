import Link from 'next/link';
import s from '/src/pages/banner/mypage-banner/mypageBanner.module.scss'
import React, { useEffect, useState } from 'react';
import { getData } from '/src/pages/api/reqData';
import Spinner from './Spinner';
import Image from 'next/image';
import useDeviceState from '/util/hook/useDeviceState';
import { exposeType } from '/store/TYPE/exposeType';


export default function MypageBanner() {
  const isMobile = useDeviceState().isMobile;
  const [isLoading, setIsLoading] = useState(false);
  const [DATA, setDATA] = useState({});

  useEffect(() => {
    (async () => {
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: true,
      }));
      try {
        const url = `/api/banners/myPage`;
        const res = await getData(url);
        // // console.log('MypageBanner RES: ', res);
        if (res.status === 200) {
          const data = res.data;
          const initData = {
            id: data.id,
            name: data.name,
            status: data.status,
            filenamePc: data.filenamePc,
            filenameMobile: data.filenameMobile,
            pcLinkUrl: data.pcLinkUrl,
            mobileLinkUrl: data.mobileLinkUrl,
            imageUrl: {
              pc: data._links.thumbnail_pc?.href,
              mobile: data._links.thumbnail_mobile?.href,
            },
          };
          setDATA(initData);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading((prevState) => ({
        ...prevState,
        fetching: false,
      }));
    })();
  },      []);


  return (
    <>
      {isLoading.fetching ? (
        <Spinner />
      ) : (
        <>
          {DATA?.status === exposeType.LEAKED &&
            ((!isMobile && DATA.imageUrl.pc) || (isMobile && DATA.imageUrl.mobile)) && (
              <div id={s['banner']}>
                <Link href={(isMobile ? DATA.mobileLinkUrl : DATA.pcLinkUrl) || 'javascript:void(0)'} passHref>
                  <a data-device={isMobile ? 'mobile' : 'pc'}>
                    <Image
                      priority
                      src={isMobile ? DATA.imageUrl.mobile : DATA.imageUrl.pc}
                      objectFit="cover"
                      layout="fill"
                      alt={isMobile ? DATA.filenameMobile : DATA.filenamePc}
                    />
                  </a>
                </Link>
              </div>
            )}
        </>
      )}
    </>
  );
}
