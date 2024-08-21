import s from './modal_healthScore.module.scss';
import React, { useCallback, useEffect, useState } from 'react';
import ModalWrapper from './ModalWrapper';
import Image from 'next/image';

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
              반려견의 건강 점수를 올리는 방법은 무엇일까요? <br />
              방법은 매우 간단합니다. <br />
              건강한 음식을 먹이고 건강한 생활을 함께하며 건강한 변을 보면 되죠.
              아쉽게도 사람과 마찬가지로 건강 점수를 한 번에 끌어올리는
              마법같은건 없어요.
              <br />
              <br />
              하지만, 모든 것에는 다 방법이 있습니다. <br />한 순간에 고점에
              다달으진 못해도, 천천히 좋아질 수 있는 방법을 소개해드릴게요.
              <br />
              <br />
              <h5> ① 식사는 자연식을 먹는 것이 좋아요 🥩 </h5>
              <br />
              기네스북에 오른 장수견의 장수 비결이 바로 자연식이었다는 것, 알고
              계셨나요?
              <br />
              아무리 신선한 원재료를 사용한 고급 건사료라도 열로 가공 하는
              과정에서 파괴되는 영양소가 어마어마하답니다. <br />
              게다가 자연식에 포함된 수분은 자연스러운 음수량 증진에도
              도움이되니, 이제는 반려견의 건강한 삶을 위해 가공되지 않은
              건강하고 올바른 음식을 제공해주세요.
              <br />
              <br />
              <h5> ② 킁카킁카! 산책은 규칙적으로 나가는 것이 좋아요 🐕 </h5>
              <br />
              산책과 같이 규칙적인 운동을 하면 반려견의 근육 단련과 칼로리 소모,
              스트레스 해소 등에 도움을 줘 여러모로 이점이 아주 많답니다! <br />
              게다가 이러한 운동들은 반려견의 이상적인 몸매를 만들어 주는데
              도움을 준다는 사실!
              <br /> 신체적, 정신적 그리고 나아가 사회적 건강까지 모두 챙길 수
              있는 산책 활동! 반려 생활의 질을 향상 시킬 수 있으니 규칙적인
              산책, 꼭 챙겨주세요! <br />
              <br />
              <h5> ③ 아프지 않고 건강하면 당연히 건강 점수는 올라가요💪🏻 </h5>
              <br />말 못하는 우리 강아지, 아프면 아프다 말도 못해 안쓰러울 때가
              많으시죠? 건강의 시작은 먹는 것과 사전 예방으로부터 시작해요.
              올바른 식단과 미리 미리 건강 검진을 통해 큰 질병을 예방해주세요!{' '}
              <br />
              <br />
              <h5> ④ 꾸준한 식단 관리는 건강한 나날을 만들어줘요 🥗 </h5>
              <br />
              바프독에서는 영양적으로 식이 단백질 순환 급여를 권장 드리고
              있습니다. 바프독에서 준비한 레시피를 주기적으로 변경하여
              급여해보세요. 계속하여 한 식사만 제공하는 것보다 여러 식사를
              바꿔가며 제공하면, 반려견에게도 식사 시간은 즐거운 시간으로 기억될
              것입니다 :)
              <br />
              <br />이 외에도 사람과 마찬가지로 반려견의 건강을 증진시킬 수 있는
              방법은 사실 많아요. <br />
              다만, 오늘 바프독에서 제공하는 내용은 이 정도에서 마무리 할게요.
              그 외 더 궁금하신 사항은 언제든 바프독 실시간 상담을 통해
              문의해주세요.
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
