import React, {useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './signup.module.scss';


import SignInputList from "/src/components/user_signup/SignInputList";
import SignupPolicyList, { policy_KEYS } from "/src/components/user_signup/SignupPolicyList";
import Modal_termsOfSerivce from "/src/components/modal/Modal_termsOfSerivce";
import Modal_privacy from "/src/components/modal/Modal_privacy";
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import { useModalContext } from "/store/modal-context";
import axios from "axios";
import DaumPostcode from "react-daum-postcode";
import { useRouter } from 'next/router';
import MetaTitle from "/src/components/atoms/MetaTitle";
import {validate} from "/util/func/validation_signup";
import {
  valid_policyCheckbox
} from '/util/func/validationPackage';




const initialFormValues = {
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  address: {
    zipcode: '',
    street:'',
    city:'',
    detailAddress: ''
  },
  birthday: '',
  gender: 'NONE',
  recommendCode: '',
  agreement : {
    servicePolicy : false,
    privacyPolicy : false,
    receiveSms : false,
    receiveEmail : false,
    over14YearsOld : false
  }
};


const initialFormErrors = {
  name: "",
  email: "",
  isEmailDuplicated: "이메일인증이 필요합니다.",
  password: "",
  confirmPassword: "",
  phoneNumber: "",
  isValidPhoneNumber: "휴대폰번호 인증이 필요합니다.",
  gender: "",
  address: "",
  birthday: "",
  privacyPolicy: "",
  servicePolicy: "",
  over14YearsOld: ""
}

const SignupPage = () => {

  const mct = useModalContext();
  const router = useRouter();
  const [isModalActive, setIsModalActive] = useState({
    termsOfService: false,
    privacy: false
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
      setFormErrors(prevState => ({
        ...prevState,
        ...validFormResultObj,
        ...validPolicyResultObj,
      }));


      let isPassedValid = true;
      for (const validFormResultObjKey in validFormResultObj) {
        const error = validFormResultObj[validFormResultObjKey]
        if(error) isPassedValid = false;
      }

      for (const validPolicyResultObjKey in validPolicyResultObj) {
        const error = validPolicyResultObj[validPolicyResultObjKey];
        if(error) isPassedValid = false;
      }

      if(isPassedValid){
        sendSignupData(formValues);
        mct.alertHide();
        setAlertModalMessage('')
      }else{
        mct.alertShow();
        setAlertModalMessage('유효하지 않은 항목이 있습니다.');
      }
    } catch (err) {
      console.error('통신에러: ',err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }

  };

  // console.log(formValues)

  const sendSignupData = (data) => {
    // console.log(data);
    console.log('FORMVALUES : ',formValues);
    console.log('FORMERRORS : ', formErrors);

    axios
      .post('/api/join', data, {
        headers: {
          'content-Type': 'application/json',
        }
      })
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        if(res.status === 201){
          router.push(`/account/signup/success?username=${data.name}`);
        }
      })
      .catch((err) => {
        mct.alertHide();
        setAlertModalMessage(`ERROR\n\n서버와 통신할 수 없습니다.`);
        console.error('서버통신오류: ',err);
        // console.log(err.request)
        // console.log(err.response)
      });
  }




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
};

export default SignupPage;

