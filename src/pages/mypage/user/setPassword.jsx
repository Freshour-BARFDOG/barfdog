import React, { useEffect, useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import s from './changePassword.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import {
  valid_confirmPassword,
  valid_hasFormErrors,
  valid_password,
} from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import filter_emptyValue from '/util/func/filter_emptyValue';
import { useRouter } from 'next/router';
import { validate } from '/util/func/validation/validation_resetPassword';
import useDeviceState from '/util/hook/useDeviceState';
import {getDataSSR, postObjData} from "../../api/reqData";

const initialValues = {
  newPassword: '',
  newPasswordConfirm: '',
};

export default function SetPasswordPage() {
  const mct = useModalContext();
  const router = useRouter();
  const isMobile = useDeviceState().isMobile;
  const hasAlert = mct.hasAlert;
  const [isLoading, setIsLoading] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [form, setForm] = useState(initialValues);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    // alert('비밀번호 설정이 필요한 계정입니다.\n해당페이지에서 비밀번호 설정 후, 계정정보를 수정할 수 있습니다.')
  }, []);

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
      mct.alertShow('유효하지 않은 항목이 있습니다.');
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        password: form.newPassword,
        confirmPassword: form.newPasswordConfirm,
      }
      const url = '/api/members/sns/password';
      const res = await postObjData(url, body);
      if(res.isDone){
        mct.alertShow('비밀번호 설정이 완료되었습니다. ');
        setIsSubmitted(true);
      } else {
        mct.alertShow('비밀번호 설정에 실패하였습니다. 잠시 후 다시 시도해주세요.');
      }
      console.log(body);
    } catch (err) {
      console.error(err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onCancel = () => {
    if (confirm('비밀번호 생성을 취소하고, 이전 페이지로 돌아가시겠습니까?')) {
      const redirPage = isMobile ? '/mypage/user' : '/mypage/user/info';
      router.push(redirPage);
    }
  };

  const onModalConfirmButtonClick = () => {
    window.location.href = isMobile ? '/mypage/user' : '/mypage/user/info';
  };

  const validPwConfirm = valid_confirmPassword(form.newPassword, form.newPasswordConfirm);
  const errorMessagePWConfirm = validPwConfirm.message.label;

  
  return (
    <>
      <MetaTitle title="마이페이지 비밀번호 생성" />
      <Layout>
        <Wrapper className={s['set-password-page']}>
          <MypageWrapper>
            <section className={s.title}>
              <h1>비밀번호 생성</h1>
            </section>
            <h5 className={s['subtitle']}>
              간편 로그인으로 회원가입한 경우,{isMobile && <br/>}&nbsp;회원정보 수정을 위해 비밀번호를 생성합니다.
            </h5>
            <section className={s.content}>
             
              <div className={s.pass_box}>
                <label htmlFor="newPassword" className={s.label_box}>
                  <div className={s.label_text}>비밀번호</div>
                  <input
                    id="newPassword"
                    className={s.input_box}
                    type="password"
                    onChange={onInputChangeHandler}
                    value={form.newPassword || ''}
                  />
                </label>
                {form.newPassword?.length > 0
                  ? valid_password(form.newPassword).message.map((msg, index) => (
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
                    ))
                  : formErrors.newPassword && <ErrorMessage>{formErrors.newPassword}</ErrorMessage>}
                <label htmlFor="newPasswordConfirm" className={s.label_box}>
                  <div className={s.label_text}>비밀번호 확인</div>
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
      {hasAlert && <Modal_global_alert onClick={isSubmitted && onModalConfirmButtonClick} />}
    </>
  );
}





export async function getServerSideProps ({req}) {

  const url = '/api/members/sns/password'; // api이름: 비밀번호 설정해야하는 유저인지 확인
  const res = await getDataSSR(req, url);
  if(res.data){
    const needToSetPassword = res.data.needToSetPassword;
    if(!needToSetPassword){
      return {
        redirect:{
          destination:'/mypage/user/info',
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