import React, {useEffect, useState} from 'react';
import s from "/src/pages/account/signup/signup.module.scss";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import Spinner from "/src/components/atoms/Spinner";
import SignupInput from "./SignupInput";
import SignInput_address from "./SignInput_address";
import CustomRadio from "/src/components/atoms/CustomRadio";
import getAuthNumberForPhoneNumber from "/util/func/getAuthNumberForPhoneNumber";
import {valid_authNumber, valid_phoneNumber} from "/util/func/validation/validationPackage";
import rem from "/util/func/rem";
import {genderType} from "/store/TYPE/genderType";
import {transformBirthDay} from "/util/func/transformBirthDay";



export default function SignInpuList({formValues, setFormValues, formErrors, setFormErrors}) {

  const initialLoadingState = {
    email: false,
    phoneNumber: false,
    address: false
  }

  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [authPhoneNumber, setAuthPhoneNumber] = useState({
    authNumber: '',
    authNumberEnteredByTheUser:'',
    authenticated: false,
    messageOnPhoneNumberInput: '',
    messageOnAuthNumberInput: ''
  });


  const onGetAuthNumberHandler = async () => {
    const error = valid_phoneNumber(formValues.phoneNumber);
    setFormErrors((prevState) => ({
      ...prevState,
      phoneNumber: error,
      authNumber: error,
      isValidPhoneNumber: '휴대전화 인증상태 초기화'
    }));
    setAuthPhoneNumber((prevState)=>( {
      ...prevState,
      authNumber:'',
      authenticated: false,
    }))
    if(error) {
      setAuthPhoneNumber((prevState)=>( {
        ...prevState,
        messageOnPhoneNumberInput: error,
        messageOnAuthNumberInput: error && '',
      }))
      return;
    }

    setIsLoading(prevState => ({
      ...prevState,
      phoneNumber: true
    }))

    const response = await getAuthNumberForPhoneNumber(formValues.phoneNumber);
    // console.log('AuthNumber from SERVER\n',response);
    setAuthPhoneNumber((prevState)=> ({
      ...prevState,
      authNumber: response.authNumber,
      messageOnPhoneNumberInput: response.error || response.message
    }))
    setIsLoading(prevState => ({
      ...prevState,
      phoneNumber: false
    }))
  };






  const onCheckAuthNumberHandler = () => {
    // console.log('인증번호 검증: ',authPhoneNumber.authNumberEnteredByTheUser, ' (유저입력)  ===  ', authPhoneNumber.authNumber, ' (인증번호)')
    const result = valid_authNumber(authPhoneNumber.authNumberEnteredByTheUser, authPhoneNumber.authNumber);
    const error = result.error;
    const isMatched = result.isMatched;
    // // console.log(isMatched, '<---매치드 // --> 에러: ', error)
    setFormErrors((prevState) => ({
      ...prevState,
      authNumber: error,
      isValidPhoneNumber: isMatched ? "" : error
    }));
    setAuthPhoneNumber((prevState)=>({
      ...prevState,
      authenticated: true,
      messageOnAuthNumberInput: isMatched || error
    }));
  }




  return (
    <>
      {/* ! STYLE 방법 => addClassName => 배열 ['cn1', 'cn2',...] class명 삽입(여러개 가능) => signup.module.scss파일에서 작업가능 */}
      <SignupInput
        // addedClassName={['ex1', 'ex2']}
        type={'text'}
        required={true}
        id={'name'}
        title={'이름(견주님)'}
        formValue={formValues.name}
        setFormValues={setFormValues}
        errorMessage={
          formErrors.name && <ErrorMessage className={`${s.msg}`}>{formErrors.name}</ErrorMessage>
        }
      />
      <SignupInput
        type={'text'}
        id={'email'}
        title={'이메일주소(아이디)'}
        formValue={formValues.email}
        setFormValues={setFormValues}
        disabled={true}
      >
      </SignupInput>
      <SignupInput
        type={'password'}
        required={true}
        id={'password'}
        title={'비밀번호'}
        placeholder={'현재 비밀번호를 입력하세요.'}
        setFormValues={setFormValues}
        errorMessage={formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
      />
      <SignupInput
        type={'text'}
        filteredType={'number'}
        required={true}
        id={'phoneNumber'}
        title={'휴대폰 번호'}
        addedClassName={['add-btn-section']}
        formValue={formValues.phoneNumber}
        setFormValues={setFormValues}
        errorMessage={
          (formErrors.phoneNumber ||
            authPhoneNumber.authNumber ||
            authPhoneNumber.messageOnPhoneNumberInput ||
            (formValues.phoneNumber &&formErrors.isValidPhoneNumber)) && (
            <ErrorMessage
              style={{ maxWidth: `${rem(200)}` }}
              className={`${s.msg} ${
                !formErrors.phoneNumber && authPhoneNumber.authNumber && s.loading
              }`}
            >
              {formErrors.phoneNumber ||
                authPhoneNumber.messageOnPhoneNumberInput ||
                formErrors.isValidPhoneNumber}
            </ErrorMessage>
          )
        }
      >
        <button
          type={'button'}
          className={`${s.btn}`}
          onClick={onGetAuthNumberHandler}
        >
          {isLoading.phoneNumber ? (
            <Spinner
              style={{ color: 'var(--color-main)', width: '15', height: '15' }}
              speed={0.6}
            />
          ) : (
            '인증번호받기'
          )}
        </button>
      </SignupInput>
      {authPhoneNumber.authNumber && (
        <SignupInput
          type={'text'}
          filteredType={'number'}
          required={true}
          id={'authNumberEnteredByTheUser'}
          title={'인증 번호'}
          addedClassName={['add-btn-section']}
          setFormValues={setAuthPhoneNumber}
          errorMessage={
            (formErrors.phoneAuthNumber || authPhoneNumber.authenticated) && (
              <ErrorMessage
                className={`${s.msg} ${
                  !formErrors.authNumber && authPhoneNumber.authenticated && s.valid
                }`}
              >
                {authPhoneNumber.messageOnAuthNumberInput}
              </ErrorMessage>
            )
          }
        >
          <button type={'button'} className={`${s.btn}`} onClick={onCheckAuthNumberHandler}>
            확인
          </button>
        </SignupInput>
      )}
      <SignInput_address
        formValues={formValues}
        setFormValues={setFormValues}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
      />

      <SignupInput
        type={'date'}
        id={'birthday'}
        filteredType={'date'}
        title={'생년월일(견주님)'}
        disabled={true}
        formValue={transformBirthDay(formValues.birthday)}
        setFormValues={setFormValues}
        errorMessage={formErrors.birthday && <ErrorMessage>{formErrors.birthday}</ErrorMessage>}
      />
      <div className={`${s['join__wrap']} ${s['align-items-center']}`}>
        <div className={s['input-title-wrap']}>
          <label htmlFor={'radios-gender'}>
            <span className={`${s['inp-title']} ${s['required']}`}>{'성별(견주님)'}</span>
          </label>
        </div>
        <div className={`${s['input-wrap']}`}>
          <CustomRadio
            className={`${s['gender']}`}
            name={'gender'}
            labelList={[
              { label: genderType.KOR.MALE, value: genderType.MALE },
              { label: genderType.KOR.FEMALE, value: genderType.FEMALE },
              { label: genderType.KOR.NONE, value: genderType.NONE },
            ]}
            type={'radio'}
            value={genderType[formValues.gender]}
            setValue={setFormValues}
          />
        </div>
      </div>
    </>
  );
}
