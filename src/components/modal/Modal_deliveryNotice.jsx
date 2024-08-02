import s from './modal_deliveryNotice.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import Image from 'next/image';
import { formattedProductionAndReceivingDate } from '/util/func/formattedProductionAndReceivingDate';

export const Modal_deliveryNotice = ({ onModalActive, onPayHandler }) => {
  const onHideModal = () => {
    onModalActive(false);
  };

  function formatDateToKorean(dateString) {
    const dateParts = dateString.split('.');
    const year = dateParts[0];
    const month = dateParts[1].padStart(2, '0');
    const day = dateParts[2].padStart(2, '0');

    return `${year}년 ${month}월 ${day}일`;
  }

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        className={s['modal-container']}
        positionCenter
      >
        <main className={s.main}>
          <div className={s.delivery_container}>
            <header>
              {/* <div className={s.img_wrapper}>
              
              </div> */}
              배송 일정 안내
            </header>
            <div className={s.delivery_info}>
              [ 바프독은 <strong>선 주문 후 생산</strong> 시스템! ]
              <br />
              <p>매주 목요일 주문 마감 -&gt; 생산 -&gt; 화요일 일괄 출고</p>
              <p className={s.gray}>여유있게 주문해주시면 감사하겠습니다 :)</p>
            </div>
            <Image
              src={'/img/order/schedule.png'}
              alt="left_arrow"
              width={229 * 2}
              height={76 * 2}
              onClick={onHideModal}
            />
            <div className={s.order_date_text}>
              지금 주문 시{' '}
              <span>
                {formatDateToKorean(
                  formattedProductionAndReceivingDate().formattedShipmentDate,
                )}
              </span>{' '}
              출고!
            </div>
          </div>
        </main>
        <div className={s.save_btn_wrapper}>
          <button className={s.back_btn} onClick={onHideModal}>
            <Image
              src={'/img/order/left_arrow.svg'}
              alt="left_arrow"
              width={16}
              height={16}
            />
            뒤로가기
          </button>
          <button className={s.save_btn} onClick={onPayHandler}>
            네, 확인하였습니다.
          </button>
        </div>
      </ModalWrapper>
    </>
  );
};
