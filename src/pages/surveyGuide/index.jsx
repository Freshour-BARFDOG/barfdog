import React from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './surveyGuide.module.scss';
import Image from 'next/image';
import { useDispatch, useSelector } from 'react-redux';
import { setPreviousPath } from '/store/navigation-slice';
import { useModalContext } from '/store/modal-context';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useRouter } from 'next/router';
import SurveyGuid from '/public/img/survey/survey_guide.svg';

export default function SurveyGuidePage() {
  const dispatch = useDispatch();
  const mct = useModalContext();
  const router = useRouter();
  const activeGlobalAlertModal = mct.hasAlert;
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;

  const onMovePage = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      // 로그인 이후 바로 특정 페이지(설문조사)로 이동
      dispatch(setPreviousPath('/survey'));
      return await router.push('/account/login');
      //  mct.alertShow('로그인 후 이용가능합니다.');
    }
    await router.push('/survey');
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="설문조사 안내" />
      <Layout>
        <Wrapper>
          <div className={s.title_box}>
            <div className={s.inner_box}>
              <div className={`${s.image} img-wrap`}>
                {/* <Image
                  priority
                  src={require('public/img/survey/survey_guide.png')}
                  objectFit="cover"
                  layout="fill"
                  alt="카드 이미지"
                /> */}
                <SurveyGuid />
              </div>
              <div className={s.text}>
                내 반려견에게 꼭 맞는 맞춤 플랜을 위한
                <br />
                정보작성이 1분 가량 소요됩니다.
              </div>
            </div>
          </div>
          <div className={s.btn_box}>
            <button onClick={onMovePage} className="survey-guide-start-btn">
              반려견 정보작성 시작하기
            </button>
          </div>
        </Wrapper>
      </Layout>
      {activeGlobalAlertModal && (
        <Modal_global_alert onClick={onClickModalButton} background />
      )}
    </>
  );
}
