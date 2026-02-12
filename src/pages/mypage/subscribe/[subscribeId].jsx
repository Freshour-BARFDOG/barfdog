import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
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
import { subscribePlanType } from '/store/TYPE/subscribePlanType';
import { FullScreenLoading } from '/src/components/atoms/FullScreenLoading';
import Modal_global_alert from '../../../components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { postData } from '../../api/reqData';
import { useRouter } from 'next/router';
import Spinner from '../../../components/atoms/Spinner';

export default function SubscribeInfoPage({ data }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const { subscribeId } = data;
  const subscribeInfo = useSubscribeInfo(subscribeId);
  const [isLoading, setIsLoading] = useState({ reactive: false });

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
    if (subscribeInfo?.info.planName === subscribePlanType.TOPPING.NAME) {
      return mct.alertShow(
        '토핑 플랜은 서비스가 종료되어 재결제가 불가능합니다. 반려견을 새로 등록하신뒤 이용해 주세요.',
      );
    }
    if (subscribeInfo?.recipe.soldOut) {
      return mct.alertShow('품절된 레시피가 존재합니다.');
    }
    router.push(`/order/ordersheet/subscribe/${subscribeId}`);
  };

  //* 구독 중단 취소 (재활성화)
  const onSuccessCallback = () => {
    window.location.reload();
  };

  const onReactiveHandler = async () => {
    if (subscribeInfo?.info.planName === subscribePlanType.TOPPING.NAME) {
      return mct.alertShow(
        '토핑 플랜은 서비스가 종료되어 재결제가 불가능합니다. 반려견을 새로 등록하신뒤 이용해 주세요.',
      );
    }
    if (subscribeInfo?.recipe.soldOut) {
      return mct.alertShow('품절된 레시피가 존재합니다.');
    }
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

  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <SubscribeDashboard subscribeInfo={subscribeInfo} />

            {subscribeInfo?.info.subscribeStatus === 'SUBSCRIBING' ? (
              <>
                <ToggleBox title="구독 무게(g) 변경">
                  <SubscribeGram subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox title="구독 플랜 변경">
                  <SubscribePlan subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox
                  title="구독 레시피  변경"
                  style={{ overflow: 'hidden' }}
                >
                  <SubscribeRecipe subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox title="구독 건너뛰기">
                  <SubscribeSkipPayment subscribeInfo={subscribeInfo} />
                </ToggleBox>

                <ToggleBox title="구독 취소">
                  <SubscribeCancle subscribeInfo={subscribeInfo} />
                </ToggleBox>
              </>
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
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && (
        <Modal_global_alert onClick={onClickModalButton} background />
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
