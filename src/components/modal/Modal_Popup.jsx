import ModalWrapper from '/src/components/modal/ModalWrapper';
import React, { useEffect, useState } from 'react';
import s from './modal_popup.module.scss';
import Image from 'next/image';
import useDeviceState from '/util/hook/useDeviceState';
import { getCookie, setCookie } from '/util/func/cookie';
import Link from 'next/link';
export const Modal_Popup = ({ popupData }) => {
  const isMobile = useDeviceState().isMobile;
  popupData.map((data) => ({ ...data, isActive: true }));
  // 메인페이지  popup의 zindex는 2000 ~ 2100 대역으로 제한하여 할당함
  const [DATA, setDATA] = useState(popupData);
  const [isLoading, setIsLoading] = useState(true);

  const alliance = getCookie('alliance');

  useEffect(() => {
    // const cookieDataList = popupData.map((data)=>({...data,isActive: true}));
    const addedCookiePopupData = popupData.map((data) => {
      let popupActiveStatus = getCookie(`bf-popup-${data.id}`);
      let isActive =
        popupActiveStatus === 'false' ? false : popupActiveStatus === 'true' ? true : null;
      if (isActive === null) {
        // 팝업 cookie 없을 경우, 초기화
        setCookie(`bf-popup-${data.id}`, 'true', 'date', 100);
        isActive = true;
      }
      return {
        ...data,
        isActive: isActive,
      };
    });
    setDATA(addedCookiePopupData);
    setIsLoading(false);
  }, []);

  const onClosePopup = (e) => {
    const targetId = Number(e.currentTarget.dataset.popupId);
    setDATA((prevState) =>
      prevState.map((data) =>
        data.id === targetId
          ? {
              ...data,
              isActive: false,
            }
          : data,
      ),
    );
  };
  const onCloseOneDay = (e) => {
    const targetId = Number(e.currentTarget.dataset.popupId);
    // // console.log(targetId);
    setCookie(`bf-popup-${targetId}`, 'false', 'date', 1);
    setDATA((prevState) =>
      prevState.map((data) =>
        data.id === targetId
          ? {
              ...data,
              isActive: false,
            }
          : data,
      ),
    );
  };

  // // console.log(DATA);
  const popupPosition = (position) => {
    let convertedPos;
    switch (position) {
      case 'LEFT':
        convertedPos = 'left';
        break;
      case 'MID':
        convertedPos = 'center';
        break;
      case 'RIGHT':
        convertedPos = 'right';
        break;
    }

    return convertedPos;
  };

  const PopupComponent = ({ data }) => (
    <div
      id={s.modal_popup}
      className={`${s[popupPosition(data.position)]} ${s[`leakedOrder-${data.leakedOrder}`]}`}
      data-desc={`popup-${isMobile ? 'mobile' : 'pc'}-${data.id}`}
    >
      {(data.mobileImageUrl || data.pcImageUrl) && (
        <Link href={isMobile ? data.mobileLinkUrl : data.pcLinkUrl} passHref>
          <a>
            <figure className={s.image}>
              <Image
                src={isMobile ? data.mobileImageUrl : data.pcImageUrl}
                objectFit="cover"
                layout="fill"
                alt={isMobile ? data.mobileFileName : data.pcFilename}
                priority={true}
              />
            </figure>
          </a>
        </Link>
      )}
      <div className={s['btn-section']}>
        <button
          type={'button'}
          data-popup-id={data.id}
          className={s.skip}
          onClick={onCloseOneDay}
        >
          하루 동안 보지 않기
        </button>
        <button
          type={'button'}
          data-popup-id={data.id}
          className={s.close}
          onClick={onClosePopup}
        >
          닫기
        </button>
      </div>
    </div>
  )

  return (
    <>
      {!isLoading &&
        DATA?.length > 0 && (
          <>
            {alliance !== null && DATA.filter((data) => data.isActive && data.name.includes('alliance')).map((data, i) => (
              <PopupComponent key={`popup-${i}-${data.id}-alliance`} data={data} />
            ))}
            {DATA.filter((data) => data.isActive && !data.name.includes('alliance')).map((data, i) => (
              <PopupComponent key={`popup-${i}-${data.id}`} data={data} />
            ))}
          </>
      )
      }
    </>
  );
};
