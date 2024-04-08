import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from '/src/pages/healthcare/vet/vet.module.scss';
import Image from 'next/image';
import Soon from '/public/img/healthcare/soon.png';
import VetImg from '/public/img/healthcare/vet.jpg';
import NotiForm from '../../../components/atoms/NotiForm';

const initialFormValues = {
  name: '',
  number: '',
  dogSizeType: '',
  dogType: '',
  privacyPolicy: false,
};

const initialFormErrors = {};

export default function AiVetPage() {
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const onSubmit = () => {
    if (formValues.name === '') {
      setFormErrors({ name: '이름을 입력해주세요.' });

      console.log(formErrors);
    }
  };

  return (
    <>
      <MetaTitle title="AI 수의사" />
      <Layout>
        <Wrapper>
          <section className={s.vet_top}>
            <div className={s.vet_left}>
              <div className={s.vet_title_wrap}>
                <div className={s.vet_title}>
                  <p>AI</p> 수의사
                </div>
                <div className={s.img_wrap}>
                  <Image src={Soon} alt="soon" />
                </div>
              </div>
              <div className={s.vet_text}>
                <div>
                  보다 더 고도화된
                  <span>AI 챗봇 서비스</span>로<span>로 반려견 건강 상담</span>
                  을 받아보세요!
                </div>
              </div>
            </div>
            <div className={s.vet_right}>
              <Image src={VetImg} alt="report" />
            </div>
          </section>
        </Wrapper>

        <Wrapper fullWidth={true}>
          <section className={s.membership_alarm}>
            <div className={s.alarm_title}>출시 알림 신청하기</div>
            <div className={s.alarm_text}>
              집에서 간편하게 반려견 건강 상담을 받아보고 싶으신가요?
              <br /> 바프독 AI 수의사 서비스가 출시될 때 가장 먼저 알려드릴게요.
            </div>
            <NotiForm
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
