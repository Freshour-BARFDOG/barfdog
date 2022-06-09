import React, {useEffect, useMemo, useState} from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from './signup.module.scss';
import { IoChevronForwardOutline } from 'react-icons/io5';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import CustomRadio from '/src/components/atoms/CustomRadio';
import SignupInput from '/src/components/user_signup/SignupInput';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import {
  valid_confirmPassword,
  valid_email,
  valid_password,
  validate,
} from '/util/func/signup_validation';
import Spinner from '/src/components/atoms/Spinner';

/*
 * MEMO 유효성검사
 *  1--------  휴대폰번호: 인증번호 ==> 서버에 통신 후 , 휴대폰인증절차 진행
 *  2-------- 주소검색: API사용
 *  PART2
 *   __퍼블리싱 > 약관보기
 *
 * */

let isFirstRendering = true;

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
    recommendCode: '',
  };

  const policy_KEYS = ['servicePolicy', 'privacyPolicy', 'receiveSms','receiveEmail', 'over14YearsOld' ];
  const initialPolicyValues = {
    [policy_KEYS[0]]: false,
    [policy_KEYS[1]]: false,
    [policy_KEYS[2]]: false,
    [policy_KEYS[3]]: false,
    [policy_KEYS[4]]: false,
    _selectAllInReceiveChannel: false,
    _selectAllPolicies: false,
  };


  const [formValues, setFormValues] = useState(initialFormValues);
  const [policyValues, setPolicyValues] = useState(initialPolicyValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // console.log(formValues);
  // console.log(isLoading);
  // console.log(formErrors);
  // console.log(policyValues);

  useEffect(() => {
    if (!isFirstRendering) {
      const validPassword = valid_password(formValues.password);
      const validConfirmPassword = valid_confirmPassword(
        formValues.password,
        formValues.confirmPassword,
      );
      setFormErrors((prevState) => {
        return {
          ...prevState,
          password: validPassword,
          confirmPassword: validConfirmPassword?.error,
          passwordMatch: validConfirmPassword?.isMatched,
        };
      });
    }
    isFirstRendering = false;
  }, [formValues.password, formValues.confirmPassword]);



  // MEMO: 기능 > 무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)
  useEffect(() => {
    const triggerCheckbox1 = 'receiveSms';
    const triggerCheckbox2 = 'receiveEmail';
    const targetKey = '_selectAllInReceiveChannel';
    setPolicyValues(prevState=> {
      let counter = 0;
      const allCheckedCounter = 2;
      for (const prevStateKey in prevState) {
        const val = prevState[prevStateKey];
        if(prevStateKey === triggerCheckbox1 || prevStateKey === triggerCheckbox2){
          val && counter++;
        }
      }
      return {
        ...prevState,
        [targetKey]: counter === allCheckedCounter
      }
    })
  }, [policyValues.receiveSms, policyValues.receiveEmail]);




  useEffect(() => {
    setPolicyValues(prevState=> {
      const targetKey = '_selectAllPolicies';
      let isAllCheckboxChecked;
      for (const prevStateKey in prevState) {
        const targetCheckbox = policy_KEYS.indexOf(prevStateKey) >= 0
        if(targetCheckbox){
          const val = prevState[prevStateKey];
          isAllCheckboxChecked = val;
          if(!val) break;
        }
      }
      return {
        ...prevState,
        [targetKey]: isAllCheckboxChecked
      }
    })

  },  [policyValues.privacyPolicy, policyValues.servicePolicy,policyValues.receiveSms,policyValues.receiveEmail, policyValues.over14YearsOld ]);



  const onCheckEmailDuplication = async () => {
    setIsLoading(true);
    setFormErrors((prevState) => {
      return {
        ...prevState,
        email: '중복 확인 중입니다.',
      };
    });
    try {
      const result = await valid_email(formValues.email);
      setFormErrors((prevState) => {
        return {
          ...prevState,
          email: result.message,
          isEmailDuplicated: result.isEmailDuplicated,
        };
      });
    } catch (err) {
      alert('서버 통신오류: 관리자에게 문의하세요.');
      console.error('에러발생: ', err);
    }
    setIsLoading(false);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(formValues);
    const result = await validate(formValues);
    setFormErrors(result);
    // if (Object.keys(formErrors).length) return console.error(formErrors);
  };


  const onSelectAllRecieveChannel = (checked) => {
    const targetValue1 = 'receiveSms';
    const targetValue2 = 'receiveEmail';
    setPolicyValues((prevState) => {
      return {
        ...prevState,
        [targetValue1]: checked,
        [targetValue2]: checked,
      };
    });
  };


  const onSelectAllPolicies = (checked) => {
    setPolicyValues((prevState) => {
      let tempObj = {}
      for (const prevStateKey in prevState) {
        const val = prevState[prevStateKey];
        tempObj[prevStateKey] = checked;
      }
      return tempObj
    });
  };

  return (
    <Layout>
      <Wrapper>
        <div className={s.main}>
          <div className={s['main-title']}>
            <h2>회원가입</h2>
          </div>

          <div className={s['join-form']} method={'post'} onSubmit={onSubmit}>
            <section className={s['input-section']}>
              <SignupInput
                type={'text'}
                required={true}
                id={'name'}
                title={'이름(견주님)'}
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.name && (
                    <ErrorMessage className={`${s.msg}`}>{formErrors.name}</ErrorMessage>
                  )
                }
              />
              <SignupInput
                type={'text'}
                required={true}
                id={'email'}
                title={'이메일주소(아이디)'}
                addedClassName={'add-btn-section'}
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.email && (
                    <ErrorMessage
                      className={`${s.msg} ${isLoading ? s.loading : ''} ${
                        formErrors.isEmailDuplicated === false && s.valid
                      }`}
                    >
                      {formErrors.email}
                    </ErrorMessage>
                  )
                }
              >
                <div className={`${s.btn} ${s.smallbtn}`} onClick={onCheckEmailDuplication}>
                  {isLoading ? (
                    <Spinner
                      style={{ color: 'var(--color-main)', width: '15', height: '15' }}
                      speed={0.6}
                    />
                  ) : (
                    '중복확인'
                  )}
                </div>
              </SignupInput>
              <SignupInput
                type={'password'}
                required={true}
                id={'password'}
                title={'비밀번호'}
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.password && (
                    <>
                      {valid_password(formValues.password).message.map((msg, index) => (
                        <ErrorMessage
                          key={`pw-msg-${index}`}
                          className={`${s.msg} ${msg.valid ? s.valid : ''} ${
                            index !== 0 && s.siblings
                          }`}
                        >
                          {msg.label}
                        </ErrorMessage>
                      ))}
                    </>
                  )
                }
              />
              <SignupInput
                type={'password'}
                required={true}
                id={'confirmPassword'}
                title={'비밀번호 확인'}
                setFormValues={setFormValues}
                errorMessage={
                  (formErrors.passwordMatch || formErrors.confirmPassword) && (
                    <ErrorMessage className={`${s.msg} ${formErrors.passwordMatch && s.valid}`}>
                      {formErrors.passwordMatch || formErrors.confirmPassword}
                    </ErrorMessage>
                  )
                }
              />
              <SignupInput
                type={'text'}
                filteredType={'number'}
                required={true}
                id={'phoneNumber'}
                title={'휴대폰 번호'}
                addedClassName={'add-btn-section'}
                폰
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.phoneNumber && <ErrorMessage>{formErrors.phoneNumber}</ErrorMessage>
                }
              >
                <div className={`${s.btn} ${s.smallbtn}`}>인증번호 받기</div>
              </SignupInput>
              <SignupInput
                type={'text'}
                required={true}
                id={'address'}
                title={'주소 검색'}
                placeholder={'기본주소'}
                addedClassName={'add-btn-section'}
                disabled
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.address && <ErrorMessage>{formErrors.address}</ErrorMessage>
                }
              >
                <div className={`${s.btn} ${s.bigbtn}`}>주소 검색</div>
              </SignupInput>
              <SignupInput
                type={'date'}
                required={true}
                id={'birthday'}
                title={'생년월일(견주님)'}
                setFormValues={setFormValues}
                errorMessage={
                  formErrors.birthday && <ErrorMessage>{formErrors.birthday}</ErrorMessage>
                }
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
                    initialValueIndex={2}
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
                <PureCheckbox
                  id={'agree-all'}
                  className={s['agree-all']}
                  value={policyValues._selectAllPolicies}
                  eventHandler={onSelectAllPolicies}
                >
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
                <PureCheckbox
                  id={'servicePolicy'}
                  value={policyValues.servicePolicy}
                  setValue={setPolicyValues}
                >
                  <p className={s['title']}>이용약관 동의 (필수)</p>
                </PureCheckbox>
                <button className={s.terms__view}>
                  약관보기
                  <IoChevronForwardOutline />
                </button>
              </div>

              {/* 개인정보 수집 이용동의  */}
              <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
                <PureCheckbox
                  id={'privacyPolicy'}
                  value={policyValues.privacyPolicy}
                  setValue={setPolicyValues}
                >
                  <p className={s.title}>개인정보 수집 이용 동의 (필수)</p>
                </PureCheckbox>
                <button className={s.terms__view}>
                  약관보기
                  <IoChevronForwardOutline />
                </button>
              </div>
              {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
              <div className={`${s['checkbox-wrap']} ${s['receive-event']}`}>
                <PureCheckbox
                  id={'agree-event-channel-all'}
                  value={policyValues._selectAllInReceiveChannel}
                  eventHandler={onSelectAllRecieveChannel}
                >
                  <p className="">무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</p>
                </PureCheckbox>
                <div className={s['select-channel']}>
                  <div className={s['flex-wrap']}>
                    <PureCheckbox
                      id={'receiveSms'}
                      value={policyValues.receiveSms}
                      setValue={setPolicyValues}
                    >
                      <p>SMS</p>
                    </PureCheckbox>
                    <PureCheckbox
                      id={'receiveEmail'}
                      value={policyValues.receiveEmail}
                      setValue={setPolicyValues}
                    >
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
                <PureCheckbox
                  id={'over14YearsOld'}
                  value={policyValues.over14YearsOld}
                  setValue={setPolicyValues}
                >
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
};

export default SignupPage;
