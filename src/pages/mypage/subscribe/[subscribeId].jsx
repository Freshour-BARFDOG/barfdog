import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import {ToggleBox} from '/src/components/atoms/ToggleBox';
import {SubscribeDashboard} from '/src/components/subscribe/SubscribeDashboard';
import {SubscribeGram} from '/src/components/subscribe/SubscribeGram';
import {SubscribeSkipPayment} from '/src/components/subscribe/SubscribeSkipPayment';
import {SubscribeCancle} from '/src/components/subscribe/SubscribeCancle';
import {SubscribePlan} from '/src/components/subscribe/SubscribePlan';
import {SubscribeRecipe} from '/src/components/subscribe/SubscribeRecipe';
import {useSubscribeInfo} from '/util/hook/useSubscribeInfo';
import {FullScreenLoading} from '/src/components/atoms/FullScreenLoading';
import Modal_global_alert from "../../../components/modal/Modal_global_alert";
import {useModalContext} from "/store/modal-context";


export default function SubscribeInfoPage({ data }) {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const { subscribeId } = data;
  const subscribeInfo = useSubscribeInfo(subscribeId);

  
  if (!subscribeInfo) {
    return <FullScreenLoading />;
  }

  const onClickModalButton = () => {
    mct.alertHide();
  };
  return (
    <>
      <MetaTitle title="마이페이지 구독관리" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <SubscribeDashboard subscribeInfo={subscribeInfo} />
            
            <ToggleBox title="구독 무게(g) 변경">
              <SubscribeGram subscribeInfo={subscribeInfo} />
            </ToggleBox>

            <ToggleBox title="구독 플랜 변경">
              <SubscribePlan subscribeInfo={subscribeInfo} />
            </ToggleBox>

            <ToggleBox title="구독 레시피  변경" style={{ overflow: 'hidden'}}>
              <SubscribeRecipe subscribeInfo={subscribeInfo}/>
            </ToggleBox>

            <ToggleBox title="구독 건너뛰기">
              <SubscribeSkipPayment subscribeInfo={subscribeInfo} />
            </ToggleBox>

            <ToggleBox title="구독 취소">
              <SubscribeCancle subscribeInfo={subscribeInfo} />
            </ToggleBox>
            
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} background />}
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
