import React, { useState } from 'react';
import s from './dashboard.module.scss';
import User_counter_viewer from './User_counter_viewer';
import Image from 'next/image';
import { IoMdLink, IoMdMail } from 'react-icons/io';
import Modal_sendPhoneMessage from '@src/components/modal/Modal_sendPhoneMessage';




function Dashboard({ className, ...props }) {
  const dogName = '바둑이';
  const userName = '김바프';
  const userClass = '웰컴';
  const userRecommandCode = '6SE7855FA';
  const numberOfdeliveries = 7;
  const earnPoint = 3200;
  const numberOfCoupons = 1;

  const [isModalActive, setIsModalActive] = useState(true);

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


  return (
    <>
      <section className={`${className} ${s.dashboard}`} {...props}>
        <div className={s.user_info}>
          <div className={s.info_row}>
            <div className={s.info_col}>
              <figure className={`${s.user_photo} img-wrap`}>
                <Image
                  alt="반려견 대표 이미지"
                  src="https://images.unsplash.com/photo-1561037404-61cd46aa615b?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"
                  objectFit="cover"
                  layout="fill"
                />
              </figure>
              <figcaption className={s.user_names}>
                <em className={s.user_name}>
                  <span>{dogName}</span> 견주
                </em>
                <em className={s.dog_name}>
                  <span>{userName}</span>님
                </em>
              </figcaption>
            </div>
            {/* info_col */}
            <div className={`${s.info_col}`}>
              <div className={s.user_class}>
                <p>회원님은</p>
                <p>
                  <span>{userClass}</span>등급 입니다.
                </p>
              </div>
            </div>
          </div>
          <div className={`${s.info_row} ${s.user_recommand}`}>
            <div className={`${s.recommand_code} ${s.info_col} flex-wrap`}>
              <span>추천코드</span>
              <span className={s.code}>{userRecommandCode}</span>
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
            <User_counter_viewer title="배송예정" counter={numberOfdeliveries} unit="건" />
            <User_counter_viewer title="적립금" counter={earnPoint} unit="원" />
            <User_counter_viewer title="보유쿠폰" counter={numberOfCoupons} unit="개" />
          </ul>
        </div>
        {/* user_counter */}
      </section>
      {isModalActive && <Modal_sendPhoneMessage setModalState={setIsModalActive} />}
    </>
  );
}

export default Dashboard;
