import React, { useEffect, useState } from 'react';
import s from '/src/pages/account/signup/signup.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import Spinner from '/src/components/atoms/Spinner';
import SignupInput from './SignupInput';
import SignInput_birthday from './SignInput_birthday';
import SignInput_address from './SignInput_address';
import CustomRadio from '/src/components/atoms/CustomRadio';
import getAuthNumberForPhoneNumber from '/util/func/getAuthNumberForPhoneNumber';
import {
  valid_authNumber,
  valid_confirmPassword,
  valid_email,
  valid_email_duplication,
  valid_password,
  valid_phoneNumber,
} from '/util/func/validation/validationPackage';
import rem from '/util/func/rem';
import { genderType } from '/store/TYPE/genderType';

let isFirstRendering = true;

export default function SignInputList({
  formValues,
  setFormValues,
  formErrors,
  setFormErrors,
  inputrefs,
}) {
  const snsSignupMode = !!formValues.providerId;
  const initialLoadingState = {
    email: false,
    phoneNumber: false,
    address: false,
    birthday: false,
  };

  const [isLoading, setIsLoading] = useState(initialLoadingState);
  const [authPhoneNumber, setAuthPhoneNumber] = useState({
    authNumber: '',
    authNumberEnteredByTheUser: '',
    authenticated: false,
    messageOnPhoneNumberInput: '',
    messageOnAuthNumberInput: '',
  });

  const [confirmPasswordMessage, setConfirmPasswordMessage] = useState('');
  const [emailValdationMessage, setEmailPassedValidationMessage] = useState('');

  useEffect(() => {
    (async () => {
      const inValidEmailErrorMessage = valid_email(formValues.email);
      const response =
        !inValidEmailErrorMessage &&
        (await valid_email_duplication(formValues.email));
      const message = response.message;
      const error = response.error;

      setEmailPassedValidationMessage(error ? '' : message);
    })();
  }, [formErrors.isEmailDuplicated]);

  useEffect(() => {
    if (!isFirstRendering) {
      const validPassword = valid_password(formValues.password);
      const validConfirmPassword = valid_confirmPassword(
        formValues.password,
        formValues.confirmPassword,
      );
      // // console.log('Keyboardevent!: ',validConfirmPassword)
      setFormErrors((prevState) => ({
        ...prevState,
        password: validPassword,
        confirmPassword: validConfirmPassword.error,
      }));
      setConfirmPasswordMessage(validConfirmPassword.message);
    }
    isFirstRendering = false;
  }, [formValues.password, formValues.confirmPassword, setFormErrors]);

  const onCheckEmailDuplication = async () => {
    if (isLoading.email) return console.error('Loading email duplicate check');
    const error = valid_email(formValues.email);
    if (error) {
      return setFormErrors((prevState) => ({
        ...prevState,
        email: error,
        messageOnEmail: '',
        isEmailDuplicated: '이메일 중복확인 초기화',
      }));
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        email: '이메일 중복확인 중입니다.',
      }));

      const response = await valid_email_duplication(formValues.email);
      // // console.log(response);
      setFormErrors((prevState) => ({
        ...prevState,
        email: response.error,
        isEmailDuplicated: response.error,
        _messageOnEmail: response.message,
      }));
    } catch (err) {
      setFormErrors((prevState) => ({
        ...prevState,
        isEmailDuplicated: !!err,
      }));
      alert('이메일 중복확인 중 에러가 발생하였습니다.');
      console.error(err);
    } finally {
      setIsLoading((prevState) => ({
        ...prevState,
        email: false,
      }));
    }
  };

  const onGetAuthNumberHandler = async () => {
    const error = valid_phoneNumber(formValues.phoneNumber);
    setFormErrors((prevState) => ({
      ...prevState,
      phoneNumber: error,
      authNumber: error,
      isValidPhoneNumber: '',
    }));
    setAuthPhoneNumber((prevState) => ({
      ...prevState,
      authNumber: '',
      authenticated: false,
    }));
    if (error) {
      setAuthPhoneNumber((prevState) => ({
        ...prevState,
        messageOnPhoneNumberInput: error,
        messageOnAuthNumberInput: error && '',
      }));
      return;
    }

    setIsLoading((prevState) => ({
      ...prevState,
      phoneNumber: true,
    }));

    const response = await getAuthNumberForPhoneNumber(formValues.phoneNumber);
    // console.log(response);
    setAuthPhoneNumber((prevState) => ({
      ...prevState,
      authNumber: response.authNumber,
      messageOnPhoneNumberInput: response.error || response.message,
    }));
    setIsLoading((prevState) => ({
      ...prevState,
      phoneNumber: false,
    }));
  };

  const onCheckAuthNumberHandler = () => {
    //  console.log(
    //   '인증번호 검증: ',
    //   authPhoneNumber.authNumberEnteredByTheUser,
    //   ' (유저입력)  ===  ',
    //   authPhoneNumber.authNumber,
    //   ' (인증번호)',
    // );
    const result = valid_authNumber(
      authPhoneNumber.authNumberEnteredByTheUser,
      authPhoneNumber.authNumber,
    );
    const error = result.error;
    const isMatched = result.isMatched;
    // // console.log(isMatched, '<---매치드 // --> 에러: ', error)
    setFormErrors((prevState) => ({
      ...prevState,
      authNumber: error,
      isValidPhoneNumber: isMatched ? '' : error,
    }));
    setAuthPhoneNumber((prevState) => ({
      ...prevState,
      authenticated: true,
      messageOnAuthNumberInput: isMatched || error,
    }));
  };

  // // console.log("formErrors.email: ",formErrors, "\nemailValdationMessage: ",emailValdationMessage);
  return (
    <>
      <SignupInput
        type={'text'}
        required={true}
        id={'name'}
        title={'이름(견주님)'}
        formValue={formValues.name}
        setFormValues={setFormValues}
        inputref={inputrefs.name}
        errorMessage={
          formErrors.name && (
            <ErrorMessage className={`${s.msg}`}>
              {formErrors.name}
            </ErrorMessage>
          )
        }
      />
      <SignupInput
        type={'text'}
        required={true}
        id={'email'}
        title={'이메일주소(아이디)'}
        addedClassName={['add-btn-section']}
        formValue={formValues.email}
        setFormValues={setFormValues}
        setFormErrors={setFormErrors}
        inputref={inputrefs.email}
        errorMessage={
          (isLoading.email ||
            formErrors.email ||
            (formValues.email && formErrors.isEmailDuplicated) ||
            emailValdationMessage) && (
            <ErrorMessage
              className={`${s.msg} ${isLoading.email ? s.loading : ''} ${
                !formErrors.email &&
                !formErrors.isEmailDuplicated &&
                emailValdationMessage
                  ? s.valid
                  : ''
              }`}
            >
              {isLoading.email ||
                formErrors.email ||
                formErrors.isEmailDuplicated ||
                emailValdationMessage}
            </ErrorMessage>
          )
        }
      >
        <button className={`${s.btn}`} onClick={onCheckEmailDuplication}>
          {isLoading.email ? (
            <Spinner
              style={{ color: 'var(--color-main)', width: '15', height: '15' }}
              speed={0.6}
            />
          ) : (
            '중복확인'
          )}
        </button>
      </SignupInput>
      {!snsSignupMode && (
        <>
          <SignupInput
            type={'password'}
            required={true}
            id={'password'}
            title={'비밀번호'}
            setFormValues={setFormValues}
            inputref={inputrefs.password}
            errorMessage={
              formErrors.password && (
                <>
                  {valid_password(formValues.password).message.map(
                    (msg, index) => (
                      <ErrorMessage
                        key={`pw-msg-${index}`}
                        className={`${s.msg} ${msg.valid ? s.valid : ''} ${
                          index !== 0 && s.siblings
                        }`}
                      >
                        {msg.label}
                      </ErrorMessage>
                    ),
                  )}
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
            inputref={inputrefs.passwordConfirm}
            errorMessage={
              (formErrors.confirmPassword || confirmPasswordMessage) && (
                <>
                  <ErrorMessage
                    className={`${s.msg} ${
                      (!formErrors.confirmPassword ||
                        confirmPasswordMessage.isValid) &&
                      s.valid
                    }`}
                  >
                    {formErrors.confirmPassword || confirmPasswordMessage.label}
                  </ErrorMessage>
                </>
              )
            }
          />
        </>
      )}
      <SignupInput
        type={'text'}
        filteredType={'number'}
        required={true}
        id={'phoneNumber'}
        title={'휴대폰 번호'}
        addedClassName={['add-btn-section']}
        formValue={formValues.phoneNumber}
        setFormValues={setFormValues}
        inputref={inputrefs.phoneNumber}
        errorMessage={
          (formErrors.phoneNumber ||
            authPhoneNumber.authNumber ||
            authPhoneNumber.messageOnPhoneNumberInput ||
            (formValues.phoneNumber && formErrors.isValidPhoneNumber)) && (
            <ErrorMessage
              style={{ maxWidth: `${rem(200)}` }}
              className={`${s.msg} ${
                !formErrors.phoneNumber &&
                authPhoneNumber.authNumber &&
                s.loading
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
          inputref={inputrefs.phoneNumber}
          errorMessage={
            (formErrors.phoneAuthNumber || authPhoneNumber.authenticated) && (
              <ErrorMessage
                className={`${s.msg} ${
                  !formErrors.authNumber &&
                  authPhoneNumber.authenticated &&
                  s.valid
                }`}
              >
                {authPhoneNumber.messageOnAuthNumberInput}
              </ErrorMessage>
            )
          }
        >
          <button
            type={'button'}
            className={`${s.btn}`}
            onClick={onCheckAuthNumberHandler}
          >
            확인
          </button>
        </SignupInput>
      )}
      <SignInput_address
        formValues={formValues}
        setFormValues={setFormValues}
        formErrors={formErrors}
        setFormErrors={setFormErrors}
        inputrefs={inputrefs}
        isEdit={false}
        errorMessage={
          formErrors.detailAddress &&
          formErrors.street && (
            <ErrorMessage className={`${s.msg}`}>
              {formErrors.detailAddress}
            </ErrorMessage>
          )
        }
      />

      {/* <SignupInput
        className={s['birthday']}
        type={'date'}
        required={true}
        id={'birthday'}
        filteredType={'date'}
        title={'생년월일(견주님)'}
        formValue={formValues.birthday}
        setFormValues={setFormValues}
        errorMessage={formErrors.birthday && <ErrorMessage>{formErrors.birthday}</ErrorMessage>}
      /> */}

      <SignInput_birthday
        className={s['birthday']}
        type={'date'}
        required={true}
        id={'birthday'}
        filteredType={'date'}
        title={'생년월일(견주님)'}
        formValue={formValues.birthday}
        setFormValues={setFormValues}
        inputrefs={inputrefs}
        errorMessage={
          formErrors.birthday && (
            <ErrorMessage>{formErrors.birthday}</ErrorMessage>
          )
        }
      />

      <div className={s['join__wrap']}>
        <div className={s['input-title-wrap']}>
          <label htmlFor={'radios-gender'}>
            <span className={`${s['inp-title']} ${s['required']}`}>
              {'성별(견주님)'}
            </span>
          </label>
        </div>
        <div className={`${s['input-wrap']}`}>
          <CustomRadio
            className={s['gender']}
            name={'gender'}
            labelList={[
              { label: genderType.KOR.MALE, value: genderType.MALE },
              { label: genderType.KOR.FEMALE, value: genderType.FEMALE },
              {
                label: genderType.KOR.NONE,
                value: genderType.NONE,
              },
            ]}
            type={'radio'}
            value={formValues.gender || genderType.NONE}
            setValue={setFormValues}
          />
        </div>
      </div>
      <SignupInput
        type={'text'}
        required={false}
        id={'recommendCode'}
        title={'추천코드'}
        placeholder={'추천코드는 계정 당 한 번만 입력 가능합니다.'}
        setFormValues={setFormValues}
        inputref={null}
      />
    </>
  );
}
