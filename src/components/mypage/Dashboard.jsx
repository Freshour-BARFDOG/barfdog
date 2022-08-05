import React, { useState } from 'react';
import s from './dashboard.module.scss';
import User_counter_viewer from './User_counter_viewer';
import Image from 'next/image';
import { IoMdLink, IoMdMail } from 'react-icons/io';
import Modal_sendPhoneMessage from '@src/components/modal/Modal_sendPhoneMessage';
import transformLocalCurrency from "@util/func/transformLocalCurrency";
import {useSelector} from "react-redux";
import Modal_global_alert from "@src/components/modal/Modal_global_alert";
import {useModalContext} from "@store/modal-context";



function Dashboard({ className, ...props }) {
  const mct = useModalContext();
  const auth = useSelector(s=>s.auth);
  const data = auth.userInfo;
  const [modalMessage, setModalMessage] = useState('');
  const [isModalActive, setIsModalActive] = useState(false);
  const onCopyToClipboard = () => {
    let hostname;
    if (typeof window !== 'undefined') {
      hostname = window.location.hostname;
    }
    const copiedValue = hostname;
    const tempElem = document.createElement('textarea');
    tempElem.value = copiedValue;
    tempElem.setAttribute('readonly', '');
    tempElem.style.position = 'absolute';
    tempElem.style.left = '-9999px';
    // tempElem.style.opacity = '0';
    document.body.append(tempElem);
    tempElem.select();
    const returnValue = document.execCommand('copy');
    if (!returnValue) {
      throw new Error('copied nothing');
    }
    document.body.removeChild(tempElem);
    alert(`클립보드에 링크가 복사되었습니다. \n링크: ${copiedValue}`);
  };

  const onModalShow = ()=>{
    setIsModalActive(true);
  }
  const onHideAlertModal = ()=>{
    mct.alertHide();
  }

  if(!data){
    return;
  }

  return (
    <>
      <section className={`${className} ${s.dashboard}`} {...props}>
        <div className={s.user_info}>
          <div className={s.info_row}>
            <div className={s.info_col}>
              <figure className={`${s.user_photo} img-wrap`}>
                {data?.myDogthumbnailUrl && (
                  <Image
                    alt="대표 반려견 이미지"
                    src={data?.myDogthumbnailUrl}
                    objectFit="cover"
                    layout="fill"
                  />
                )}
              </figure>
              <figcaption className={s.user_names}>
                <em className={s.dog_name}>
                  {data.dog.dogName ? <><span>{data.dog.dogName}</span>&nbsp;견주</> : <span>대표반려견 없음</span>}
                </em>
                <em className={s.user_name}>
                  <span>{data.name}</span>&nbsp;님
                </em>
              </figcaption>
            </div>
            <div className={`${s.info_col}`}>
              <div className={s.user_class}>
                <p>회원님은</p>
                <p>
                  <span>{data.grade} </span>등급 입니다.
                </p>
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
              <button type="button" onClick={onCopyToClipboard}>
                <IoMdLink />
                링크복사
              </button>
            </div>
          </div>
        </div>
        {/* user_info */}

        <div className={s.user_counter}>
          <ul>
            <User_counter_viewer title="배송예정" counter={data.deliveryCount} unit="건" />
            <User_counter_viewer
              title="적립금"
              counter={transformLocalCurrency(data.reward)}
              unit="원"
            />
            <User_counter_viewer title="보유쿠폰" counter={data.couponCount} unit="개" />
          </ul>
        </div>
        {/* user_counter */}
      </section>
      {isModalActive && <Modal_sendPhoneMessage setModalState={setIsModalActive} data={data} setModalMessage={setModalMessage} />}
      {modalMessage && (
        <Modal_global_alert message={modalMessage} onClick={onHideAlertModal} background />
      )}
    </>
  );
}

export default Dashboard;
