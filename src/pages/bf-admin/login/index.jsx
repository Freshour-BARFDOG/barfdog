import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { useModalContext } from '/store/modal-context';
import s from './login.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import Checkbox from '/src/components/atoms/Checkbox';
import getAdminToken from '/src/pages/api/getAdminToken';
import Modal from '/src/components/modal/Modal';
import Modal_AdminResetPassword from '/src/components/modal/Modal_AdminResetPassword';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_adminLogin';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Router from 'next/router';
import Link from "next/link";



function LoginIndexPage({ autoLoginAccount }) {
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);

  useEffect(() => {
    if (autoLoginAccount) {
      setAutoLogin(true);
      setFormValues((prevState) => ({
        ...prevState,
        email: autoLoginAccount,
      }));
    }
  }, [autoLoginAccount]);


  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    setFormValues((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return;
    // ! IMPORTANT : submit 이후 enterKey event로 trigger되는 중복submit 방지
    // console.log(formValues);
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.');
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const token = await getAdminToken(formValues);
      if (!token) {
        setIsSubmitted(false);
        onShowModalHandler(
          '로그인 실패: 아이디, 비밀번호를 확인해주세요.\n지속적으로 문제발생 시, 서버장애일 수 있습니다.',
        );
      } else {
        if (autoLogin) {
          const { email, password } = formValues;
          const autoLoginExpiredDate = 7;
          dispatch(authAction.adminAugoLogin({ token: token, account: { email, password }, expiredDate: autoLoginExpiredDate }));
          onShowModalHandler(`관리자 로그인에 성공하였습니다.
본인 기기에서만 사용하시기 바랍니다.\n자동로그인: ${autoLoginExpiredDate}일간 유지`);
        } else {
          dispatch(authAction.adminLogin({ token: token }));
          onShowModalHandler('관리자 로그인에 성공하였습니다.');
        }

        setIsSubmitted(true);
      }
    } catch (err) {
      alert('로그인할 수 없습니다. 오류가 발생했습니다. 관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onShowResetPasswordModal = () => {
    mct.onShow();
  };

  const onHideResetPasswordModal = () => {
    mct.onHide();
  };

  const onAutoLogin = (checked) => {
    if (checked) {
      setModalMessage('개인정보보호를 위해\n반드시 본인 기기에서만 이용해 주세요.');
      mct.alertShow();
    }
    setAutoLogin(checked);
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  const onGlobalModalCallback = () => {
    if (isSubmitted) {
      Router.push('/bf-admin/dashboard');
    }
  };
  

  
  
  return (
    <>
      <MetaTitle title="관리자 로그인" admin={true} />
      <main id={s['loginPage']}>
        <section className="flex-wrap">
          <div className={s.frame}>
            <div className={s.container}>
              <div className={s.row}>
                <header className={s['header']}>
                  <div className={`${s.logo} img-wrap`}>
                    <Link href={"/"} passHref>
                      <a>
                        <Image src={require('/public/img/logo(favicon).png')} alt="로고"></Image>
                      </a>
                    </Link>
                  </div>
                  <h1 className={s.title}>관리자 로그인</h1>
                </header>
                <form className={'form'}>
                  <div className={s['form-row']}>
                    <label htmlFor="email">
                      <p>아이디</p>
                      <input
                        type="email"
                        id="email"
                        placeholder="이메일 주소를 입력해주세요."
                        value={formValues.email || ''}
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.email && <em className="errorMSG">{formErrors.email}</em>}
                    </label>
                  </div>
                  <div className={s['form-row']}>
                    <label htmlFor="password">
                      <p>비밀번호</p>
                      <input
                        type="password"
                        id="password"
                        placeholder="비밀번호를 입력해주세요."
                        value={formValues.password || ''}
                        onChange={onInputChangeHandler}
                      />
                      {formErrors.password && <em className="errorMSG">{formErrors.password}</em>}
                    </label>
                  </div>
                  <div className={`${s['form-row']} ${s.options}`}>
                    <span className={s['auto-index']}>
                      <Checkbox
                        id="autoLogin"
                        label="자동로그인"
                        onClick={onAutoLogin}
                        checked={autoLogin || ''}
                      />
                    </span>
                    <span className={s['reset-pw']}>
                      <button type="button" onClick={onShowResetPasswordModal}>
                        비밀번호 재설정
                      </button>
                    </span>
                  </div>
                  <div className={s['form-row']}>
                    <div className={s['btn-section']}>
                      <button
                        type="submit"
                        className="admin_btn solid confirm_l"
                        onClick={onSubmit}
                      >
                        {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '로그인'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Modal_global_alert message={modalMessage} background onClick={onGlobalModalCallback} />
      {mct.isActive && (
        <Modal onClick={onHideResetPasswordModal} background title="비밀번호 재설정">
          <Modal_AdminResetPassword />
        </Modal>
      )}
    </>
  );
}

export default LoginIndexPage;

export async function getServerSideProps(context) {
  const { req } = context;
  const cookie = req.headers.cookie;
  let autoLoginAccount = null;
  const autoLoginKey = 'adminAutoLogin';
  cookie.split(';').forEach((c) => {
    if (c.indexOf(autoLoginKey) >= 0) {
      const obj = c.split('=')[1];
      const data = JSON.parse(obj);
      autoLoginAccount = data.email;
    }
  });
  // console.log(cookie)
  return { props: { autoLoginAccount: autoLoginAccount } };
}
