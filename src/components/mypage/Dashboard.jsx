import React, { useState } from 'react';
import s from './dashboard.module.scss';
import modal_s from '/src/components/modal/modal.module.scss';
import { Swiper_dogs } from './Swiper_dogs';
import Link from 'next/link';
import Dashboard_countViewer from './Dashboard_countViewer';
import Image from 'next/image';
import { IoMdLink, IoMdMail } from 'react-icons/io';
import Modal_sendPhoneMessage from '/src/components/modal/Modal_sendPhoneMessage';
import transformLocalCurrency from '/util/func/transformLocalCurrency';
import { useSelector } from 'react-redux';
import { useModalContext } from '/store/modal-context';
import useDeviceState from '/util/hook/useDeviceState';
import Modal_alert from '/src/components/modal/Modal_alert';
import { openGradePopupHandler } from '/src/pages/popup/gradePolicy';
import { useRouter } from 'next/router';
import Modal_confirm from '/src/components/modal/Modal_confirm';

export default function Dashboard({
  className,
  itemList,
  onUploadImageModalHandler,
  onShowModalHandler,
  onActiveConfirmModal,
  setIsLoading,
  isLoading,
  ...props
}) {
  const router = useRouter();
  const mct = useModalContext();
  const isMobile = useDeviceState().isMobile;
  const auth = useSelector((s) => s.auth);
  const data = auth.userInfo;

  const [modalMessage, setModalMessage] = useState({});
  const [activeModal, setActiveModal] = useState({
    alert: false,
    message: false,
  });

  // ! [삭제 예정]
  // const onCopyToClipboard = (value) => {
  //   let hostname;
  //   if (typeof window !== 'undefined') {
  //     hostname = window.location.hostname;
  //   }
  //   const copiedValue = value || hostname;
  //   const tempElem = document.createElement('textarea');
  //   tempElem.value = copiedValue;
  //   tempElem.setAttribute('readonly', '');
  //   tempElem.style.position = 'absolute';
  //   tempElem.style.left = '-9999px';
  //   document.body.append(tempElem);
  //   tempElem.select();
  //   const returnValue = document.execCommand('copy');
  //   if (!returnValue) {
  //     throw new Error('copied nothing');
  //   }
  //   document.body.removeChild(tempElem);
  //   setActiveModal((prev) => ({
  //     ...prev,
  //     alert: true,
  //   }));
  //   setModalMessage((prevState) => ({
  //     ...prevState,
  //     alert: `클립보드에 추천코드가 복사되었습니다. \n추천코드: ${copiedValue}`,
  //   }));
  // };

  // const onCopyUserRecommendCode = () => {
  //   const userRecommendCode = data.recommendCode;
  //   onCopyToClipboard(userRecommendCode);
  // };

  // const onShowSendMessageModal = () => {
  //   setActiveModal((prev) => ({
  //     ...prev,
  //     message: true,
  //   }));
  // };

  const onHideGlobalAlert = () => {
    setActiveModal((prev) => ({
      ...prev,
      alert: false,
    }));
    setModalMessage((prev) => ({
      ...prev,
      message: '',
    }));
  };

  if (!data) {
    return;
  }

  // console.log('data____', data);

  const onEditProfileHandler = () => {
    router.push(`/mypage/user`);
  };

  return (
    <>
      <section className={`${className} ${s.dashboard}`} {...props}>
        <div className={s.user_info}>
          <div className={s.info_row}>
            <div className={s.info_col}>
              <div className={s.info_col}>
                {/* <Link passHref href={'/mypage'}> */}
                {/* <a> */}
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
                {/* </a> */}
                {/* </Link> */}
              </div>

              <div className={s.dog_name_wrapper}>
                <Link passHref href={'/mypage/dogs'}>
                  <a>
                    <figcaption className={s.user_names}>
                      <em className={s.dog_name}>
                        <span>
                          {data.dog.dogName
                            ? data.dog.dogName
                            : '대표반려견 없음'}
                        </span>
                        {data.dog.dogName && ' 보호자'}
                      </em>
                    </figcaption>
                  </a>
                </Link>

                <div className={s.user_names_grade}>
                  {/* <Link passHref href={'/mypage/dogs'}> */}
                  {/* <a> */}
                  <figcaption className={s.user_names}>
                    <em className={s.user_name}>
                      <span>{data.name}</span>&nbsp;님
                    </em>
                  </figcaption>
                  {/* </a> */}
                  {/* </Link> */}

                  <div className={s.user_class}>
                    <button
                      type={'button'}
                      onClick={() => openGradePopupHandler(isMobile)}
                    >
                      <span className={s.grade}>{data.grade} </span>
                    </button>
                  </div>
                </div>

                <div className={s.divider}></div>

                <figcaption className={s.user_names}>
                  <em>{data.email}</em>
                </figcaption>
              </div>
            </div>
          </div>

          <div className={s.edit_btn_wrapper}>
            <Image
              src={'/img/order/edit_btn.svg'}
              alt="edit_btn"
              width={20}
              height={20}
              onClick={onEditProfileHandler}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* ! [삭제예정] */}
        {/* <div className={`${s.info_row} ${s.user_recommand}`}>
            <div className={`${s.recommand_code} ${s.info_col} flex-wrap`}>
              <span>추천코드</span>
              <span className={s.code}>{data.recommendCode}</span>
            </div>
            <div className={`${s.sendMessage} ${s.info_col} flex-wrap`}>
              <button type="button" onClick={onShowSendMessageModal}>
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
          </div> */}

        {/* ! [삭제예정] */}
        {/* <div className={s.user_counter}>
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
        </div> */}
      </section>

      <section className={s.dog_list}>
        <Swiper_dogs
          itemList={itemList}
          onUploadImageModalHandler={onUploadImageModalHandler}
          onShowModalHandler={onShowModalHandler}
          onActiveConfirmModal={onActiveConfirmModal}
          setIsLoading={setIsLoading}
          isLoading={isLoading}
        />
      </section>

      {activeModal.message && (
        <Modal_sendPhoneMessage
          id={'message'}
          setModalState={setActiveModal}
          data={data}
        />
      )}
      {activeModal.alert && (
        <Modal_alert
          onClick={onHideGlobalAlert}
          text={modalMessage.alert}
          className={modal_s['on-dashboard']}
        />
      )}
    </>
  );
}
