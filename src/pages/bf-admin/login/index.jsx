import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { authAction } from '/store/auth-slice';
import { useModalContext } from '/store/modal-context';
import s from './login.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Image from 'next/image';
import Checkbox from '/src/components/atoms/Checkbox';
import Modal from '/src/components/modal/Modal';
import Modal_AdminResetPassword from '/src/components/modal/Modal_AdminResetPassword';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import { validate } from '/util/func/validation/validation_adminLogin';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Link from "next/link";
import {getDataSSR, getTokenFromServerSide, postObjData} from "/src/pages/api/reqData";
import {cookieType} from "/store/TYPE/cookieType";
import {userType} from "/store/TYPE/userAuthType";



export default function AdminLoginPage () {
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formValues, setFormValues] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [autoLogin, setAutoLogin] = useState(false);
  

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
    if (isSubmitted) return onShowModalHandler('이미 제출된 양식입니다.');
    const errObj = validate(formValues);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    if (!isPassed) return alert('유효하지 않은 항목이 있습니다.');
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const autoLoginPeriod = cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 변경가능
      const defPeriod = cookieType.LOGIN_EXPIRED_PERIOD.VALUE_FOR_RESTAPI; // 2시간 (클라이언트에서 def 값은 변경불가)
      const body = {
        email: formValues.email,
        password: formValues.password,
        tokenValidDays: autoLogin ? autoLoginPeriod : defPeriod,
      };
      const res = await postObjData("/api/login", body);
      if (res.status === 200) {
        const data = res.data.data;
        console.log(res);
        const isAdmin = data.roleList?.indexOf(userType.ADMIN) >= 0;
        if(!isAdmin){
          return alert('관리자 계정을 정확히 입력해주세요.')
        }
        const payload = {
          expiredDate: data.expiresAt,
          token: res.data.headers.authorization,
          roleList: data.roleList
        }
        if(autoLogin){
          dispatch(authAction.adminAutoLogin(payload));
        } else{
          dispatch(authAction.adminLogin(payload));
        }
        
        setIsSubmitted(true);
        setIsLoading((prevState) => ({
          ...prevState,
          movePage: true,
        }));
        window.location.href='/bf-admin/dashboard';
      }else {
        setIsSubmitted(false);
        onShowModalHandler(
          '로그인 실패: 아이디, 비밀번호를 확인해주세요.\n지속적으로 문제발생 시, 서버장애일 수 있습니다.',
        );
      }
    } catch (err) {
      alert ('로그인할 수 없습니다. 오류가 발생했습니다. 관리자에게 문의하세요.');
      console.error('API통신 오류 : ', err);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onAutoLogin = (checked) => {
    if (checked) {
      const autoLoginPeriod = cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 변경가능
      setModalMessage(`개인정보보호를 위해\n반드시 본인 기기에서만 이용해 주세요.\n(자동로그인 유지기간: ${autoLoginPeriod}일)`);
      mct.alertShow();
    }
    setAutoLogin(checked);
  };

  const onShowModalHandler = (message) => {
    mct.alertShow();
    setModalMessage(message);
  };

  
  return (
    <>
      <MetaTitle title="관리자 로그인" admin={true} />
      <Modal_global_alert message={modalMessage} background onClick={()=>{
        mct.alertHide();
      }} />
      {mct.isActive && (
        <Modal onClick={mct.alertHide} background title="비밀번호 재설정">
          <Modal_AdminResetPassword />
        </Modal>
      )}
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
                      <button type="button" onClick={mct.onShow}>
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
                        {(isLoading.submit || isLoading.movePage) ? <Spinner style={{ color: '#fff' }} /> : '로그인'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


export async function getServerSideProps({ req }) {
  let token = null;
  let USER_TYPE = null;
  if (req?.headers?.cookie) {
    token = getTokenFromServerSide( req );
    console.log('token: ', token)
    const getApiUrl = `/api/admin/setting`;
    const res = await getDataSSR( req, getApiUrl, token );
    console.log('res: ', res)
    if ( res && res.status === 200 ) {
      USER_TYPE = userType.ADMIN;
    }
  }
  
  if(USER_TYPE && USER_TYPE === userType.ADMIN){
    return {
      redirect:{
        permanent: false,
        destination: '/bf-admin/dashboard'
      }
    }
  } else {
    return { props: { } };
  }
}
