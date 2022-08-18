import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './signup.module.scss';
import SignInputList from '/src/components/user_signup/SignInputList';
import SignupPolicyList, { policy_KEYS } from '/src/components/user_signup/SignupPolicyList';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import Modal_privacy from '/src/components/modal/Modal_privacy';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import axios from 'axios';
import { useRouter } from 'next/router';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { validate } from '/util/func/validation/validation_signup';
import { valid_policyCheckbox } from '/util/func/validation/validationPackage';
import { useSelector } from 'react-redux';

export default function SignupPage() {
  const mct = useModalContext();
  const router = useRouter();
  const userState = useSelector((s) => s.userState);
  console.log(userState.snsInfo);
  
const naverGender = function (gender) {
  // naver 성별
  // - F: 여성
  // - M: 남성
  // - U: 확인불가
  switch (gender) {
    case 'F': 
      return 'FEMALE';
    case 'M': 
      return 'MALE';
    case 'U':
    default:
      return 'NONE';
  }
}
  // naver 에서 받는 성별 출력
  // console.log(naverGender(userState.snsInfo.gender));
  const initialFormValues = {
    name: userState.snsInfo.name ||'',
    email: userState.snsInfo.email ||'',
    password: '',
    confirmPassword: '',
    phoneNumber: userState.snsInfo.mobile || '',
    address: {
      zipcode: '',
      street: '',
      city: '',
      detailAddress: '',
    },
    // ! 생년월일 셋팅 확인 필요
    birthday:`${userState.snsInfo.birthyear}-${userState.snsInfo.birthday}` || '',
    // ! gender 셋팅 확인 필요
    gender: userState.snsInfo.provider == 'naver'? naverGender(userState.snsInfo.gender): 'NONE',
    // gender:'MALE',

    recommendCode: '',
    agreement: {
      servicePolicy: false,
      privacyPolicy: false,
      receiveSms: false,
      receiveEmail: false,
      over14YearsOld: false,
    },
    provider: userState.snsInfo.provider || null,
    providerId: userState.snsInfo.providerId || null,
  };

  // console.log('userState: ',userState)
  // console.log('initialFormValues: ',initialFormValues)

  const initialFormErrors = {
    isEmailDuplicated: null,
    isValidPhoneNumber: '휴대폰번호 인증이 필요합니다.',
  };

  const [isModalActive, setIsModalActive] = useState({
    termsOfService: false,
    privacy: false,
  });
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);

  const onSubmit = async (e) => {
    e.preventDefault();
    // console.log(formErrors);
    try {
      const validFormResultObj = await validate(formValues, formErrors);
      const validPolicyResultObj = valid_policyCheckbox(formValues.agreement, policy_KEYS);
      setFormErrors((prevState) => ({
        ...prevState,
        ...validFormResultObj,
        ...validPolicyResultObj,
      }));

      let isPassedValid = true;
      for (const validFormResultObjKey in validFormResultObj) {
        const error = validFormResultObj[validFormResultObjKey];
        if (error) isPassedValid = false;
      }

      for (const validPolicyResultObjKey in validPolicyResultObj) {
        const error = validPolicyResultObj[validPolicyResultObjKey];
        if (error) isPassedValid = false;
      }

      if (isPassedValid) {
        mct.alertHide();
        setAlertModalMessage('');
        await sendSignupData(formValues);
      } else {
        mct.alertShow();
        setAlertModalMessage('유효하지 않은 항목이 있습니다.');
      }
    } catch (err) {
      console.error('통신에러: ', err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
  };

  // console.log(formValues)

  const sendSignupData = async (formvalues) => {
    console.log('SUBMIT DATA:\n', formvalues);
    // data.providerId = "asdfasdf-asdfasdf"; // ! TEST 임의의 providerID를 서버에 전송해도, 가입이 된다.
    // 단, providerID가 중복될 경우, 해당 providerId sns계정으로 가입불가능.
    await axios
      .post('/api/join', formvalues, {
        headers: {
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log(res);
        console.log(res.data);
        if (res.status === 201) {
          const userName = formvalues.name
          alert('회원가입에 성공하였습니다.');
          router.push(`/account/signup/success?username=${userName}`);
        }
      })
      .catch((err) => {
        mct.alertHide();
        setAlertModalMessage(`ERROR\n\n서버와 통신할 수 없습니다.`);
        console.error('서버통신오류: ', err);
      });
  };

  return (
    <>
      <MetaTitle title="회원가입" />
      <Layout>
        <Wrapper>
          <div className={s.main}>
            <div className={s['title-wrap']}>
              <h2 className={s['main-title']}>회원가입</h2>
            </div>

            <div className={s['join-form']} onSubmit={onSubmit}>
              <section className={s['input-section']}>
                <SignInputList
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                />
              </section>
              <section className={s['policy-section']}>
                <div className={`${s['title-wrap']}`}>
                  <h3 className={`${s['main-title']}`}>이용약관 동의</h3>
                </div>
                <SignupPolicyList
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  setModalState={setIsModalActive}
                />
              </section>
              <section className={s['btn-section']}>
                <button type={'button'} className={`${s.btn} ${s.join}`} onClick={onSubmit}>
                  회원가입
                </button>
              </section>
            </div>
          </div>
        </Wrapper>
      </Layout>
      {isModalActive.termsOfService && (
        <Modal_termsOfSerivce
          modalState={isModalActive.termsOfService}
          setModalState={setIsModalActive}
        />
      )}
      {isModalActive.privacy && (
        <Modal_privacy modalState={isModalActive.privacy} setModalState={setIsModalActive} />
      )}
      <Modal_global_alert message={alertModalMessage} />
    </>
  );
}

