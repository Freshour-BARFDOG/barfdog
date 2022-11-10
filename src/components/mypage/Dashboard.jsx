import React, { useState } from 'react';
import s from './dashboard.module.scss';
import Dashboard_countViewer from './Dashboard_countViewer';
import Image from 'next/image';
import { IoMdLink, IoMdMail } from 'react-icons/io';
import Modal_sendPhoneMessage from '/src/components/modal/Modal_sendPhoneMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { useSelector } from 'react-redux';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import popupWindow from '/util/func/popupWindow';
import useDeviceState from '/util/hook/useDeviceState';
import Link from "next/link";

 export default function Dashboard({ className, ...props }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const isMobile = useDeviceState().isMobile;
  const auth = useSelector((s) => s.auth);
  const data = auth.userInfo;
  const [isModalActive, setIsModalActive] = useState(false);
  
  const onCopyToClipboard = (value) => {
    let hostname;
    if (typeof window !== 'undefined') {
      hostname = window.location.hostname;
    }
    const copiedValue = value || hostname;
    const tempElem = document.createElement('textarea');
    tempElem.value = copiedValue;
    tempElem.setAttribute('readonly', '');
    tempElem.style.position = 'absolute';
    tempElem.style.left = '-9999px';
    document.body.append(tempElem);
    tempElem.select();
    const returnValue = document.execCommand('copy');
    if (!returnValue) {
      throw new Error('copied nothing');
    }
    document.body.removeChild(tempElem);
    mct.alertShow(`클립보드에 추천코드가 복사되었습니다. \n추천코드: ${copiedValue}`);
    // alert(`클립보드에 추천코드가 복사되었습니다. \n링크: ${copiedValue}`);
  };
  
  const onCopyUserRecommendCode = ()=>{
    const userRecommendCode = data.recommendCode;
    onCopyToClipboard(userRecommendCode);
  }
  const onModalShow = ()=>{
    setIsModalActive(true);
  }


  const openGradePopupHandler = () => {
    const href = '/popup/gradePolicy';
    const options = {
      width: isMobile ? 320 : 1120,
      height: isMobile ? 517 : 730,
      left: 200,
      top: 100
    };
    popupWindow(href, options);
  };

  if (!data) {
    return;
  }

  return (
    <>
      <section className={`${className} ${s.dashboard}`} {...props}>
        <div className={s.user_info}>
          <div className={s.info_row}>
            <div className={s.info_col}>
              <Link passHref href={'/mypage/dogs'}>
                <a>
                <figure className={`${s.user_photo} img-wrap`}>
                  {data?.dog.thumbnailUrl && (
                    <Image
                      alt="대표 반려견 이미지"
                      src={data?.dog.thumbnailUrl}
                      objectFit="cover"
                      layout="fill"
                    />
                  )}
                </figure>
                </a>
              </Link>
              <Link passHref href={'/mypage/dogs'}>
                <a>
                <figcaption className={s.user_names}>
                  <em className={s.dog_name}>
                    <span>{data.dog.dogName ? data.dog.dogName : '대표반려견 없음'}</span>
                    {data.dog.dogName && ' 견주'}
                  </em>
                  <em className={s.user_name}>
                    <span>{data.name}</span>&nbsp;님
                  </em>
                </figcaption>
              </a>
              </Link>
            </div>
            <div className={`${s.info_col}`}>
              <div className={s.user_class}>
                <p>회원님은</p>
                <button type={'button'} onClick={openGradePopupHandler}>
                  <span className={s.grade}>{data.grade} </span>등급 입니다.
                </button>
              </div>
            </div>
          </div>
          <div className={`${s.info_row} ${s.user_recommand}`}>
            <div className={`${s.recommand_code} ${s.info_col} flex-wrap`}>
              <span>추천코드</span>
              <span className={s.code}>{data.recommendCode}</span>
            </div>
            <div className={`${s.sendMessage} ${s.info_col} flex-wrap`}>
              <button type="button" onClick={onModalShow}>
                <IoMdMail />
                문자보내기
              </button>
            </div>
            <div className={`${s.copyLink} ${s.info_col} flex-wrap`}>
              <button type="button" onClick={onCopyUserRecommendCode}>
                <IoMdLink />
                코드복사
              </button>
            </div>
          </div>
        </div>
        {/* user_info */}

        <div className={s.user_counter}>
          <ul>
            <Dashboard_countViewer
              title="배송예정"
              counter={data.deliveryCount}
              unit="건"
              url="/mypage/delivery"
            />
            <Dashboard_countViewer
              title="적립금"
              counter={transformLocalCurrency(data.reward)}
              unit="원"
              url="/mypage/reward"
            />
            <Dashboard_countViewer
              title="보유쿠폰"
              counter={data.couponCount}
              unit="개"
              url="/mypage/coupon"
            />
          </ul>
        </div>
        {/* user_counter */}
      </section>
      {isModalActive && (
        <Modal_sendPhoneMessage
          setModalState={setIsModalActive}
          data={data}
        />
      )}
      {hasAlert && (
        <Modal_global_alert background/>
      )}
    </>
  );
}

