import React, { useState } from 'react';
import LayoutWithoutFooter from '/src/components/common/LayoutWithoutFooter';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { ToggleBox } from '/src/components/atoms/ToggleBox';
import { SubscribeDashboard } from '/src/components/subscribe/SubscribeDashboard';
import { SubscribeGram } from '/src/components/subscribe/SubscribeGram';
import { SubscribeSkipPayment } from '/src/components/subscribe/SubscribeSkipPayment';
import { SubscribeCancle } from '/src/components/subscribe/SubscribeCancle';
import { SubscribePlan } from '/src/components/subscribe/SubscribePlan';
import { SubscribeRecipe } from '/src/components/subscribe/SubscribeRecipe';
import { useSubscribeInfo } from '/util/hook/useSubscribeInfo';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import Modal_global_alert from '../../../components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { postData } from '../../api/reqData';
import { useRouter } from 'next/router';
import Spinner from '../../../components/atoms/Spinner';
import Image from 'next/image';
import s from './subscribe.module.scss';
import { SubscribeUpdateInfo } from '../../../components/subscribe/SubscribeUpdateInfo';
import { SubscribeSurveyUpdate } from '../../../components/subscribe/SubscribeSurveyUpdate';
import { Modal_mypageSubscribeCancel } from '/src/components/modal/Modal_mypageSubscribeCancel';

export default function SubscribeInfoPage({ data }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const { subscribeId } = data;
  const subscribeInfo = useSubscribeInfo(subscribeId);
  const [isLoading, setIsLoading] = useState({ reactive: false });
  const [activeModal, setActiveModal] = useState(false);

  // console.log(subscribeInfo);
  // console.log(subscribeInfo.info.subscribeStatus);

  if (!subscribeInfo) {
    return <FullScreenLoading />;
  }

  const onClickModalButton = () => {
    mct.alertHide();
  };

  //* 주문서 페이지로 이동
  const moveToOrdersheetHandler = () => {
    router.push(`/order/ordersheet/subscribe/${subscribeId}`);
  };

  //* 구독 중단 취소 (재활성화)
  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onReactiveHandler = async () => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: true,
      }));
      const apiUrl = `/api/subscribes/${subscribeId}/reactive`;
      const res = await postData(apiUrl);
      // console.log(res);
      if (res.data) {
        mct.alertShow(`재구독이 정상적으로 완료되었습니다.`, onSuccessCallback);
      } else {
        mct.alertShow('재구독에 실패하였습니다.');
      }
    } catch (err) {
      mct.alertShow('서버 통신 장애 발생');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        reactive: false,
      }));
    }
  };

  const onApplyHandler = () => {};

  const onSubscirbeCancelModalHandler = () => {};

  const initializeModalState = () => {
    setActiveModal(null);
  };

  const onStartCancel = () => {
    setActiveModal(true);
  };

  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <LayoutWithoutFooter>
        <Wrapper>
          <MypageWrapper>
            {/* <SubscribeDashboard subscribeInfo={subscribeInfo} /> */}
            <SubscribeUpdateInfo subscribeInfo={subscribeInfo} />

            {subscribeInfo?.info.subscribeStatus === 'SUBSCRIBING' ? (
              <div className={s.toggle_container}>
                <ToggleBox title="구독 급여량(g) 변경">
                  <SubscribeGram subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox title="구독 플랜 변경">
                  <SubscribePlan subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox
                  title="구독 레시피 변경"
                  style={{ overflow: 'hidden' }}
                >
                  <SubscribeRecipe subscribeInfo={subscribeInfo} />
                </ToggleBox>

                {/* <ToggleBox title="구독 건너뛰기">
                  <SubscribeSkipPayment subscribeInfo={subscribeInfo} />
                </ToggleBox> */}

                <ToggleBox title="반려견 건강 문진 재등록">
                  <SubscribeSurveyUpdate />
                </ToggleBox>

                {/* <ToggleBox title="구독 취소">
                  <SubscribeCancle subscribeInfo={subscribeInfo} />
                </ToggleBox> */}

                <button className={s.sub_cancel_btn} onClick={onStartCancel}>
                  해지하기
                </button>
              </div>
            ) : (
              <div
                className="btn-box"
                style={{
                  width: '100%',
                  display: 'flex',
                  backgroundColor: '#ca1011',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '50px',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  marginTop: '2.6rem',
                  boxShadow: '0 0 1.25rem rgba(0, 0, 0, 0.1)',
                }}
                onClick={
                  subscribeInfo?.info.subscribeStatus ===
                  'SUBSCRIBE_WILL_CANCEL'
                    ? onReactiveHandler
                    : moveToOrdersheetHandler
                }
              >
                <button
                  style={{
                    color: 'white',
                  }}
                >
                  {isLoading.reactive ? (
                    <Spinner style={{ color: '#fff' }} />
                  ) : (
                    '재구독'
                  )}
                </button>
              </div>
            )}

            <button
              // className={`${
              // form.plan && form.recipeIdList.length > 0 ? s.activated : ''
              // } ${s.payment_btn}`}
              className={s.apply_btn}
              onClick={onApplyHandler}
              // disabled={!(form.plan && form.recipeIdList.length > 0)}
            >
              적용하기
            </button>
          </MypageWrapper>
        </Wrapper>
      </LayoutWithoutFooter>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
      {activeModal && (
        <Modal_mypageSubscribeCancel
          onHideModal={initializeModalState}
          subscribeId={subscribeId}
        />
      )}
    </>
  );
}

export async function getServerSideProps({ query }) {
  const { subscribeId } = query;

  const data = {
    subscribeId,
  };

  return { props: { data } };
}
