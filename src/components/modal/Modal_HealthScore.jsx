import s from './modal_healthScore.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import Image from 'next/image';
import CloseButton from '/src/components/atoms/CloseButton';

export const Modal_HealthScore = ({ onModalActive }) => {
  const onHideModal = () => {
    onModalActive(false);
  };

  return (
    <>
      <ModalWrapper
        background
        onBackgroundClick={onHideModal}
        className={s['modal-container']}
        positionCenter
      >
        <main className={s.main}>
          {/* <CloseButton className={'preview-delete-button'} /> */}
          <div className={s.close_wrapper}>
            <Image
              src={'/img/survey/statistics/close.svg'}
              alt="info"
              width={18}
              height={18}
              style={{ cursor: 'pointer' }}
              onClick={onHideModal}
            />
          </div>
          <div className={s.container}>
            <header>건강 점수를 올리는 방법 🔼</header>

            <div className={s.content}>
              반려견의 건강 점수를 올리는 방법은 무엇일까요? 방법은 매우
              간단합니다. 건강한 음식을 먹이고 건강한 생활을 함께하며 건강한
              변을 보면 되죠. 아쉽게도 사람과 마찬가지로 건강 점수를 한 번에
              끌어올리는 마법같은건 없어요. 하지만, 모든 방법에는 전략이
              중요하듯 건강 점수 관리에도 전략이 중요해요. 건강 점수 올리는
              전략을 알려드릴게요.
            </div>
          </div>
        </main>
        {/* <div className={s.save_btn_wrapper}>
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
        </div> */}
      </ModalWrapper>
    </>
  );
};
