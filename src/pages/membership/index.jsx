import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/membership/membership.module.scss';
import Image from 'next/image';
import MembershipImg from '/public/img/membership.png';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';

import ReleaseNotiForm from '../../components/atoms/ReleaseNotiForm';

const initialFormValues = {
  name: '',
  number: '',
  dogSizeType: '',
  dogType: '',
  privacyPolicy: false,
};

const initialFormErrors = {};

export default function MembershipPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [submitState, setSubmitState] = useState(null);

  const onSubmit = () => {
    if (formValues.name === '') {
      setFormErrors({ name: '이름을 입력해주세요.' });

      console.log(formErrors);
    }
  };

  // const onSubmit = async () => {
  // if (submitState === true) return;
  // const errObj = validate(formValues, 3);
  // const isPassed = valid_hasFormErrors(errObj);
  // if (!isPassed) return;
  // const postFormValuesApiUrl = '/api/dogs';
  // try {
  //   setIsLoading((prevState) => ({
  //     ...prevState,
  //     submit: true,
  //   }));
  //   let modalMessage;
  //   const res = await postObjData(postFormValuesApiUrl, formValues);
  //   // console.log(res);
  //   if (res.isDone) {
  //     const slicedReportApiLink =
  //       res.data.data._links.query_surveyReport.href.split('/');
  //     const linkLength = slicedReportApiLink.length;
  //     const surveyReportsId = slicedReportApiLink[linkLength - 1];
  //     svyData.deleteStoredSurveyData(userId);
  //     await router.push(`/survey/statistics/${surveyReportsId}`);
  //     setSubmitState(true);
  //   } else {
  //     modalMessage = '내부 통신장애입니다. 잠시 후 다시 시도해주세요.';
  //     mct.alertShow(modalMessage);
  //     setSubmitState(false);
  //   }
  // } catch (err) {
  //   await mct.alertShow(
  //     'API통신 오류가 발생했습니다. 서버관리자에게 문의하세요.',
  //   );
  //   setTimeout(() => {
  //     window.location.href = '/surveyGuide';
  //   }, [1000]);
  //   console.error('API통신 오류 : ', err);
  // }
  // setIsLoading((prevState) => ({
  //   ...prevState,
  //   submit: false,
  // }));
  // };

  return (
    <>
      <MetaTitle title="멤버십" />
      <Layout>
        <Wrapper>
          <section className={s.membership_top}>
            <div className={s.membership_left}>
              <div className={s.membership_title}>
                <h1>
                  바프독을
                  <br />
                  <span> 더 알차고 멋지게 즐기실 수 있도록 </span>
                  <br />
                  새로운 방법을 준비 중입니다!
                </h1>
              </div>
              <div className={s.membership_text}>
                <div>
                  * 자세한 서비스 내용은 준비되는 대로 안내드리겠습니다.
                </div>
              </div>
            </div>
            <div className={s.img_wrap}>
              <Image src={MembershipImg} alt="MembershipImg" />
            </div>
          </section>
        </Wrapper>

        <Wrapper fullWidth={true}>
          <section className={s.membership_alarm}>
            <div className={s.alarm_title}>출시 알림 신청하기</div>
            <div className={s.alarm_text}>
              바프독 서비스를 더 알차고 멋지게 즐길 수 있는 멤버십 서비스가
              <br /> 정식 론칭되면 가장 먼저 알려드릴게요!
            </div>
            <ReleaseNotiForm
              formValues={formValues}
              setFormValues={setFormValues}
              onSubmit={onSubmit}
              required={true}
              formErrors={formErrors}
            />
          </section>
        </Wrapper>
      </Layout>
    </>
  );
}
