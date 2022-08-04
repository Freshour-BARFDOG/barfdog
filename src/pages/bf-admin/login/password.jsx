import React, { useState, useEffect } from 'react';
import s from './login.module.scss';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import { validate } from '/util/func/validation/validation_resetPassword';
import {valid_hasFormErrors, valid_password} from '/util/func/validation/validationPackage';
import {putObjData} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import {useModalContext} from "/store/modal-context";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import enterKey from "/util/func/enterKey";

function ResetPasswordPage() {
  const initialFormValues = {
    pw: '',
    pw2: '',
  }
  const mct = useModalContext();
  const auth = useSelector(s=>s.auth);
  const adminInfo = auth.adminInfo;
  
  const router = useRouter();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const [form, setForm] = useState(initialFormValues);
  const [modalMessage, setModalMessage] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Redirection : 비밀번호 인증없이 접근한 경우
    if (!isAdmin || !adminInfo.email) return router.push('/bf-admin/login');
  }, [isAdmin]);

  const onInputChangeHandler = (event) => {
    const input = event.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    filteredValue = filter_emptyValue(value);
    if (filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');

    const body = {
      email: adminInfo.email,
      password: form.password,
      passwordConfirm: form.passwordConfirm,
    };
    const errObj = validate(body);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const url = '/api/admin/password'
      const res = await putObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow();
        setModalMessage('비밀번호가 변경되었습니다.');
        setIsSubmitted(true);
      } else {
        alert(`Error: ${res.error}`);
      }
    } catch (err) {
      mct.alertShow();
      setModalMessage('장애가 발생했습니다. 잠시 후 다시 시도해주세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };
  
  const onModalButtonClick = () => {
    mct.alertHide();
    router.push('/bf-admin/login');
  };
  
  
  const onKeyDownHandler = (e)=>{
    enterKey(e, onSubmit)
  }
  return (
    <>
      <main id={s['loginPage']}>
        <section className="flex-wrap animation-show-all-child">
          <div className={s.frame}>
            <div className={s.container}>
              <div className={s.row}>
                <header className={s['header']}>
                  <div className={`${s.logo} img-wrap`}>
                    <Link href="/bf-admin/login">
                      <a>
                        <Image src={require('@public/img/logo(favicon).png')} alt="로고"/>
                      </a>
                    </Link>
                  </div>
                  <h1 className={s.title}>관리자 비밀번호 재설정</h1>
                </header>
                <form className={s['index-body']} action="/api/login" method="post">
                  <div className={s['form-row']}>
                    <label htmlFor="password">
                      <p>비밀번호</p>
                      <input
                        type="password"
                        id="password"
                        placeholder="영문/숫자/특수문자 2가지 이상 조합 7 ~ 15자"
                        onChange={onInputChangeHandler}
                        data-input-type={'string'}
                      />
                    </label>
                    {form.password?.length > 0 && valid_password(form.password).message.map((msg, index) => (
                      <><ErrorMessage
                        key={`pw-msg-${index}`}
                        className={`${s.msg} ${msg.valid ? s.valid : ''} ${index !== 0 && s.siblings}`}
                      >
                        {msg.label}
                      </ErrorMessage><br/>
                      </>
                    ))}
                    {/*{formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}*/}
                  </div>
                  <div className={s['form-row']}>
                    <label htmlFor="passwordConfirm">
                      <p>비밀번호 확인</p>
                      <input
                        type="password"
                        id="passwordConfirm"
                        placeholder="비밀번호 재입력"
                        onChange={onInputChangeHandler}
                        data-input-type={'string'}
                        onKeyDown={onKeyDownHandler}
                      />
                    </label>
                    {formErrors.passwordConfirm && <ErrorMessage>{formErrors.passwordConfirm}</ErrorMessage>}
                  </div>
                  <div className={`${s['form-row']} ${s['btn-section']}`}>
                    <button
                      type="button"
                      className="admin_btn solid confirm_l fullWidth"
                      onClick={onSubmit}
                    >
                      {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '비밀번호 재설정'}
                    </button>
                  </div>
                  <div className={`${s['form-row']} ${s['btn-section']}`}></div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Modal_global_alert message={modalMessage} onClick={onModalButtonClick} background />
    </>
  );
}

export default ResetPasswordPage;
