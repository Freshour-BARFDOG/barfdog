import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './signup.module.scss';
import { IoChevronForwardOutline } from 'react-icons/io5';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import CustomRadio from '/src/components/atoms/CustomRadio';
import SignupInput from '../../../components/user_signup/SignupInput';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import axios from "axios";
import axiosConfig from "/api/axios.config";

/*
* MEMO 유효성검사
*  (완) 이름: 비어있냐
*  이메일: 회원 중에 존재하는가
*  비밀번호: 까다롭
*  비밀번호 확인: 비밀번호와 일치하는가 /
*  휴대폰번호: 비어있느가 & 인증번호가 유효한가
*  주소검색: API사용 -> 비어있는가
*  생년월일: 형식에 맞는가
* */
const valid_emailDuplication = async (value)=>{
  // 중복 검사 통과했냐 //
  let result = false;
  const API_URL = '/api/email/duplication';
  const response = await axios
    .get(API_URL, {
      headers: {
        "Content-Type": 'application/json;charset=UTF-8'
      },
      body:{
        email:value,
      }
    })
    .then((res) => {
      console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
    });

  return result;
}


const valid_isEmpty =  (value) => {
  const message = value ? '' : '항목이 비어있습니다.';
  return message;
};

const valid_email = (value) => {
  const email = value;
  let message = '';
  const RegExp = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  const isDuplicatedMemeber = valid_emailDuplication(email);
  if(!RegExp.test(email)){
    message = '이메일 형식이 올바르지 않습니다.'
  } else if (isDuplicatedMemeber) {
    message = '이미 존재하는 회원입니다.'
  }

  return message;
}

const valid_password = (value)=> {
  const pw = value;
  const RegExp = '';
  // 7자리 이상인가
  // 영문숫자 특수문자 2개 이상 조합인가
  // 동일한 숫자 3개 이상 연속으로 사용했는가.


}


const validate = (obj) => {
  let errors = {};
  const keys = Object.keys(obj);

  keys.forEach((key) => {
    const val = obj[key];

    switch (key) {
      case 'name':
        errors[key]= valid_isEmpty(val);
        break;
      case 'email':
        errors[key] = valid_isEmpty(val) || valid_email(val);
        break;
      case 'password':
        errors[key] = valid_password(val);
        break;


      default:
        break;
    }
  });

  // valid_isEmpty(file_pc.file) &&
  // (errors["file_pc"] = valid_isEmpty(file_pc.file));
  // valid_isEmpty(file_mobile.file) &&
  // (errors["file_mobile"] = valid_isEmpty(file_mobile.file));
  console.log('Validation Result: ', errors);
  return errors;
};





const SignupPage = () => {
  const initialFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phoneNumber: '',
    address: '',
    birthday: '',
    gender: '',
    recommendCode:''
  }

  const initialPolicyValues = {
    servicePolicy: false,
    privacyPolicy: false,
    receiveSms: false,
    receiveEmail: false,
    over14YearsOld: false,
  }
  const [formValues, setFormValues] = useState(initialFormValues);
  const [policyValues, setPolicyValues] = useState();
  const [formErrors, setFormErrors] = useState({});
  console.log(formValues);

  const onSubmit = (e) => {
    e.preventDefault();
    console.log(formValues);
    setFormErrors(validate(formValues));
    // if (Object.keys(formErrors).length) return console.error(formErrors);
  };


  return (
    <Layout>
      <Wrapper>
        <div className={s.main}>
          <div className={s['main-title']}>
            <h2>회원가입</h2>
          </div>

          <div
            className={s['join-form']}
            method={'post'}
            encType={'application/x-www-form-urlencoded'}
            onSubmit={onSubmit}
          >
            <section className={s['input-section']}>
              <SignupInput
                type={'text'}
                required={true}
                id={'name'}
                title={'이름(견주님)'}
                setFormValues={setFormValues}
                errorMessage={formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
              />

              <SignupInput
                type={'text'}
                required={true}
                id={'email'}
                title={'이메일주소(아이디)'}
                addedClassName={'add-btn-section'}
                setFormValues={setFormValues}
                errorMessage={formErrors.email && <ErrorMessage>{formErrors.email}</ErrorMessage>}
              >
                <div className={`${s.btn} ${s.smallbtn}`}>중복확인</div>
              </SignupInput>
              <SignupInput
                type={'password'}
                required={true}
                id={'password'}
                title={'비밀번호'}
                setFormValues={setFormValues}
                errorMessage={formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
              />
              <SignupInput
                type={'password'}
                required={true}
                id={'confirmPassword'}
                title={'비밀번호 확인'}
                setFormValues={setFormValues}
                errorMessage={formErrors.confirmPassword && <ErrorMessage>{formErrors.confirmPassword}</ErrorMessage>}
              />
              <SignupInput
                type={'text'}
                required={true}
                id={'phoneNumber'}
                title={'휴대폰 번호'}
                addedClassName={'add-btn-section'}
                setFormValues={setFormValues}
                errorMessage={formErrors.phoneNumber && <ErrorMessage>{formErrors.phoneNumber}</ErrorMessage>}
              >
                <div className={`${s.btn} ${s.smallbtn}`}>인증번호 받기</div>
              </SignupInput>
              <SignupInput
                type={'text'}
                required={true}
                id={'address'}
                title={'주소 검색'}
                addedClassName={'add-btn-section'}
                disabled
                setFormValues={setFormValues}
                errorMessage={formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>}
              >
                <div className={`${s.btn} ${s.bigbtn}`}>주소 검색</div>
              </SignupInput>
              <SignupInput
                type={'text'}
                required={true}
                id={'birthday'}
                title={'생년월일(견주님)'}
                placeholder={'YYYY      /      MM      /      DD'}
                errorMessage={formErrors.birthday && <ErrorMessage>{formErrors.birthday}</ErrorMessage>}
              />
              <div className={s['join__wrap']}>
                <div className={s['input-title-wrap']}>
                  <label htmlFor={'radios-gender'}>
                    <span className={`${s['inp-title']} ${s['required']}`}>{'성별(견주님)'}</span>
                  </label>
                </div>
                <div className={`${s['input-wrap']}`}>
                  <CustomRadio
                    className={s['gender']}
                    name={'gender'}
                    labelList={[
                      { label: '남자', value: 'man' },
                      { label: '여자', value: 'woman' },
                      {
                        label: '선택안함',
                        value: 'non-selected',
                      },
                    ]}
                    type={'radio'}
                    setValue={setFormValues}
                  />
                </div>
              </div>
              <SignupInput
                type={'text'}
                required={false}
                id={'recommend-code'}
                title={'추천코드'}
                placeholder={'추천코드는 계정 당 한 번만 입력 가능합니다.'}
              />
            </section>
            <section className={s['terms-section']}>
              <h4 className={`${s['main-title']}`}>이용약관 동의</h4>
              {/* 이용약관 동의 */}
              <div className={`${s['checkbox-wrap']} ${s['select-all']}`}>
                <PureCheckbox id={'agree-all'} className={s['agree-all']}>
                  <div className={s['desc-section']}>
                    <p className={s['title']}>전체 동의합니다.</p>
                    <p className={s['desc']}>
                      선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수
                      있습니다.
                    </p>
                  </div>
                </PureCheckbox>
              </div>

              <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
                <PureCheckbox id={'agree-service'}>
                  <p className={s['title']}>이용약관 동의 (필수)</p>
                </PureCheckbox>
                <button className={s.terms__view}>
                  약관보기
                  <IoChevronForwardOutline />
                </button>
              </div>

              {/* 개인정보 수집 이용동의  */}
              <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
                <PureCheckbox id={'agree-privacy'}>
                  <p className={s.title}>개인정보 수집 이용 동의 (필수)</p>
                </PureCheckbox>
                <button className={s.terms__view}>
                  약관보기
                  <IoChevronForwardOutline />
                </button>
              </div>
              {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
              <div className={`${s['checkbox-wrap']} ${s['receive-event']}`}>
                <PureCheckbox id={'agree-event-channel-all'}>
                  <p className="">무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</p>
                </PureCheckbox>
                <div className={s['select-channel']}>
                  <div className={s['flex-wrap']}>
                    <PureCheckbox
                      id={'agree-sms'}
                      onChange={(val) => {
                        console.log(val);
                      }}
                    >
                      <p>SMS</p>
                    </PureCheckbox>
                    <PureCheckbox id={'agree-email'}>
                      <p>이메일</p>
                    </PureCheckbox>
                  </div>
                  <p className={s.guidetext}>
                    <i className={s.icon} />
                    모두 동의 시 적립금 1,000원 적립 (첫 주문 후 적용)
                  </p>
                </div>
              </div>
              <div className={s['checkbox-wrap']}>
                <PureCheckbox id={'agree-age'}>
                  <div>본인은 만 14세 이상입니다. (필수)</div>
                </PureCheckbox>
              </div>
            </section>
            <section className={s['btn-section']}>
              <button type={'submit'} className={`${s.btn} ${s.join}`} onClick={onSubmit}>
                회원가입
              </button>
            </section>
          </div>
        </div>
      </Wrapper>
    </Layout>
  );
}

export default SignupPage;
