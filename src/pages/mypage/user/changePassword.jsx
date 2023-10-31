import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './changePassword.module.scss';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import Spinner from '/src/components/atoms/Spinner';
import filter_emptyValue from '/util/func/filter_emptyValue';
import { validate } from '/util/func/validation/validation_resetPassword';
import {
  valid_confirmPassword,
  valid_hasFormErrors,
  valid_password,
} from '/util/func/validation/validationPackage';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import {useRouter} from "next/router";
import useDeviceState from "/util/hook/useDeviceState";



const initialValues = {
  originPassword: '',
  newPassword: '',
  newPasswordConfirm: '',
}
export default function ChangePasswordPage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const deviceState = useDeviceState();
  const isMobile = deviceState.isMobile;
  const [form, setForm] = useState(initialValues);
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    let filteredValue = value;
    filteredValue = filter_emptyValue(value); // 스페이스바 제거
    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
 
    const errObj = validate(form, formErrors);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) {
      mct.alertShow();
      setAlertModalMessage('유효하지 않은 항목이 있습니다.');
      return;
    }
    
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        password: form.originPassword,
        newPassword: form.newPassword,
        newPasswordConfirm: form.newPasswordConfirm,
      };
      const url = '/api/members/password';
      const res = await putObjData(url, body);
      // // console.log(res);
      if (res.isDone) {
        mct.alertShow();
        setIsSubmitted(true);
        setAlertModalMessage('회원정보가 정상적으로 변경되었습니다.');
      } else if (res.status === 400) {
        mct.alertShow();
        const errorMessage = `현재 비밀번호가 올바르지 않습니다.`;
        setAlertModalMessage(errorMessage);
        setFormErrors({
          password: errorMessage,
        });
      }
    } catch (err) {
      console.error('통신에러: ', err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onModalConfirmButtonClick = () => {
    window.location.reload();
  };
  
  
  const onCancel = ()=>{
    if(confirm('비밀번호 변경을 취소하시겠습니까?')){
      const redirPage = isMobile ? '/mypage/user' : '/mypage/user/info'
      router.push(redirPage);
    }
  }
  
  
  const validPwConfirm = valid_confirmPassword(form.newPassword, form.newPasswordConfirm);
  const errorMessagePWConfirm = validPwConfirm.message.label;
  return (
    <>
      <MetaTitle title="마이페이지 비밀번호변경" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              <div>비밀번호 변경</div>
            </section>

            <section className={s.content}>
              <div className={s.pass_box}>
                <label htmlFor="password" className={s.label_box1}>
                  <div className={s.label_text}>현재 비밀번호</div>
                  <input
                    id={'originPassword'}
                    className={s.input_box}
                    type="password"
                    onChange={onInputChangeHandler}
                    value={form.originPassword || ''}
                  />
                </label>
                {formErrors.originPassword && <ErrorMessage>{formErrors.originPassword}</ErrorMessage>}
                <label htmlFor="newPassword" className={s.label_box}>
                  <div className={s.label_text}>새 비밀번호</div>
                  <input
                    id="newPassword"
                    className={s.input_box}
                    type="password"
                    onChange={onInputChangeHandler}
                    value={form.newPassword || ''}
                  />
                </label>
                {form.newPassword?.length > 0 ?
                  valid_password(form.newPassword).message.map((msg, index) => (
                    <li key={`error-message-${index}`}>
                      <ErrorMessage
                        key={`pw-msg-${index}`}
                        className={`${s.msg} ${msg.valid ? s.valid : ''} ${
                          index !== 0 && s.siblings
                        }`}
                      >
                        {msg.label}
                      </ErrorMessage>
                      <br />
                    </li>
                  )) : formErrors.newPassword && (
                  <ErrorMessage>{formErrors.newPassword}</ErrorMessage>
                )}
                <label htmlFor="newPasswordConfirm" className={s.label_box}>
                  <div className={s.label_text}>새 비밀번호 확인</div>
                  <input
                    id="newPasswordConfirm"
                    className={s.input_box}
                    type="password"
                    onChange={onInputChangeHandler}
                    value={form.newPasswordConfirm || ''}
                  />
                </label>
                {(form.newPassword?.length > 0 && (
                  <ErrorMessage valid={!validPwConfirm.error}>{errorMessagePWConfirm}</ErrorMessage>
                )) ||
                  (formErrors.newPasswordConfirm && (
                    <ErrorMessage>{formErrors.newPasswordConfirm}</ErrorMessage>
                  ))}
              </div>
            </section>

            <section className={s.btn}>
              <div className={s.btn_box}>
                <button type={'button'} className={s.left_box} onClick={onCancel}>
                  취소
                </button>
                <button type={'button'} className={s.right_box} onClick={onSubmit}>
                  {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '저장'}
                </button>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert
        message={alertModalMessage}
        onClick={isSubmitted && onModalConfirmButtonClick}
      />}
      
    </>
  );
}



export async function getServerSideProps ({req}) {

  const url = '/api/members/sns/password'; // api이름: 비밀번호 설정해야하는 유저인지 확인
  const res = await getDataSSR(req, url);
  if(res.data){
    const needToSetPassword = res.data.needToSetPassword;
    if(needToSetPassword){
      return {
        redirect:{
          destination:'/mypage/user/setPassword',
          permanent: false,
        },
        props: {}
      }
    }
  }
  
  return {
    props: {}
  }
  
}