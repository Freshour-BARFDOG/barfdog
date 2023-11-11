import React, { useState } from 'react';
import axios from 'axios';
import s from './signup.module.scss';
import { useRouter } from 'next/router';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useSelector } from 'react-redux';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import SignInputList from '/src/components/user_signup/SignInputList';
import SignupPolicyList, { policy_KEYS } from '/src/components/user_signup/SignupPolicyList';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import Modal_termsOfThird from '/src/components/modal/Modal_termsOfThird';
import Modal_privacy from '/src/components/modal/Modal_privacy';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_signup';
import { valid_policyCheckbox } from '/util/func/validation/validationPackage';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { naverGender } from '/util/func/naverGender';
import { kakaoGender } from '/util/func/kakaoGender';
import {getDataSSR, getTokenFromServerSide} from "../../api/reqData";
import {deleteCookie, getCookie, setCookie} from "@util/func/cookie";
import { useEffect } from 'react';

String.prototype.insertAt = function(index,str){
  return this.slice(0,index) + str + this.slice(index);
}

export default function SignupPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const userState = useSelector((s) => s.userState);
  // // console.log(userState.snsInfo);

  const snsSignupMode = !!userState.snsInfo.providerId;
  const convertedBirthday =
    snsSignupMode && userState.snsInfo?.birthday?.indexOf('-') < 0
      ? userState.snsInfo.birthday?.insertAt(2, '-')
      : userState.snsInfo?.birthday; // 생일: 하이픈없을 경우 중간에 하이픈 넣는다.
  
  const initialFormValues = {
    name: userState.snsInfo.name || '',
    email: userState.snsInfo.email || '',
    password: '',
    confirmPassword: '',
    phoneNumber: transformPhoneNumber(userState.snsInfo.mobile, { seperator: '' }) || '',
    address: {
      zipcode: '',
      street: '',
      city: '',
      detailAddress: '',
    },
    birthday: `${userState.snsInfo.birthyear}-${convertedBirthday}` || '', // date형식: yyyy-mm-dd
    // birthday: new Date(userState.snsInfo.birthyear, (convertedBirthday && convertedBirthday.split('-')[1] - 1), (convertedBirthday && convertedBirthday.split('-')[2])) || '',

    gender:
      userState.snsInfo.provider == 'naver'
        ? naverGender(userState.snsInfo.gender)
        : userState.snsInfo.provider == 'kakao'
        ? kakaoGender(userState.snsInfo.gender)
        : 'NONE',
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

  // // console.log('userState: ',userState)
  // // console.log('initialFormValues: ', initialFormValues);
  // // console.log('snsSignupMode: ', snsSignupMode);

  const initialFormErrors = {
    isEmailDuplicated: null,
    isValidPhoneNumber: '휴대폰번호 인증이 필요합니다.',
  };

  const [isModalActive, setIsModalActive] = useState({
    termsOfService: false,
    termsOfThird: false,
    privacy: false,
  });
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [submitted, setSubmitted] = useState(false);
  
  const [visibility, setVisibility] = useState(false);

  
  useEffect(() => {
    setVisibility(getCookie("alliance") === "cb");
  }, []);

  
  const onSubmit = async () => {
    if(submitted) return console.error("Already Submitted!");
    try {
      const validateMode = snsSignupMode ? 'sns' : 'normal';
      const validFormResultObj = await validate(formValues, formErrors, { mode: validateMode });
      const validPolicyResultObj = valid_policyCheckbox(formValues.agreement, policy_KEYS);
      setFormErrors((prevState) => ({
        ...prevState,
        ...validFormResultObj,
        ...validPolicyResultObj,
      }));

      let isPassed = true;
      for (const validFormResultObjKey in validFormResultObj) {
        const error = validFormResultObj[validFormResultObjKey];
        if (error) isPassed = false;
      }

      if (!isPassed) {
        if(validFormResultObj.name){
          return mct.alertShow('이름을 확인해주세요.');
        }
        if(validFormResultObj.email){
          return mct.alertShow('이메일을 확인해주세요.');
        }
        if(validFormResultObj.isEmailDuplicated){
          return mct.alertShow('이메일 중복확인이 필요합니다.');
        }
        if(validFormResultObj.password){
          return mct.alertShow('비밀번호를 확인해주세요.');
        }
        if(validFormResultObj.confirmPassword){
          return mct.alertShow('비밀번호를 확인해주세요.');
        }
        if(validFormResultObj.phoneNumber){
          return mct.alertShow('휴대폰번호를 확인해주세요.');
        }
        if(validFormResultObj.isValidPhoneNumber){
          return mct.alertShow('휴대폰번호 인증이 필요합니다.');
        }
        if(validFormResultObj.detailAddress){
          return mct.alertShow('주소를 확인해주세요.');
        }
        if(validFormResultObj.street){
          return mct.alertShow('주소를 확인해주세요.');
        }
        if(validFormResultObj.birthday){
          return mct.alertShow('생년월일을 확인해주세요.');
        }

        return mct.alertShow('유효하지 않은 항목이 있습니다.');
      }

      for (const validPolicyResultObjKey in validPolicyResultObj) {
        const error = validPolicyResultObj[validPolicyResultObjKey];
        if (error) isPassed = false;
      }
      if (!isPassed) return mct.alertShow('이용약관을 확인해주세요.');
      
      mct.alertHide('');
      setSubmitted(true);
      await postSignupData(formValues);
      
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
      setSubmitted(false);
    }
  };

  const postSignupData = async (formvalues) => {
    const randomPW = generateRandomString(12);
    const body = {
      provider: formvalues.provider || null,
      providerId: formvalues.providerId || null,
      name: formvalues.name,
      email: formvalues.email,
      password: snsSignupMode ? randomPW : formvalues.password,
      confirmPassword: snsSignupMode ? randomPW : formvalues.confirmPassword,
      phoneNumber: formvalues.phoneNumber,
      address: {
        zipcode: formvalues.address.zipcode,
        city: formvalues.address.city,
        street: formvalues.address.street,
        detailAddress: formvalues.address.detailAddress,
      },
      birthday: formvalues.birthday,
      gender: formvalues.gender,
      recommendCode: formvalues.recommendCode || '',
      agreement: {
        servicePolicy: formvalues.agreement.servicePolicy,
        privacyPolicy: formvalues.agreement.privacyPolicy,
        receiveSms: formvalues.agreement.receiveSms,
        receiveEmail: formvalues.agreement.receiveEmail,
        over14YearsOld: formvalues.agreement.over14YearsOld,
      },
    };
    // console.log('SUBMIT BODY:\n', body);

    await axios
      .post('/api/join', body, {
        headers: {
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        if (res.status === 201) {
          const userName = formvalues.name;
          mct.alertHide(`회원가입에 성공하였습니다.`, onSuccessCallback);
          router.push(`/account/signup/success?username=${userName}`);
        } else {
          mct.alertHide(`회원가입에 실패하였습니다. 잠시 후 다시 시도해주세요.`);
        }
      })
      .catch((err) => {
        mct.alertHide(`ERROR\n\n서버와 통신할 수 없습니다.`);
        console.error('서버통신오류: ', err);
        setSubmitted(false);
      });
  };

  const onSuccessCallback = async () => {
    await router.push(`/account/signup/success?username=${userName}`);
  }
  
  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    
    return result;
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
                  setCokbank={visibility}
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
      {visibility && isModalActive.termsOfThird && (
        <Modal_termsOfThird
          modalState={isModalActive.termsOfThird}
          setModalState={setIsModalActive}
        />
      )}
      {isModalActive.privacy && (
        <Modal_privacy modalState={isModalActive.privacy} setModalState={setIsModalActive} />
      )}
      {hasAlert && <Modal_global_alert />}
    </>
  );
}




export async function getServerSideProps({ req }) {
  let token = null;
  let isMember = false;
  if (req?.headers?.cookie) {
    token = getTokenFromServerSide( req );
    const getApiUrl = `/api/mypage`;
    const res = await getDataSSR( req, getApiUrl, token );
    if ( res && res.status === 200 ) {
      isMember = true;
    }
  }
  
  if(isMember){
    return {
      redirect:{
        permanent: false,
        destination: '/'
      }
    }
  } else {
    return { props: { } };
  }
}
