import React, { useState } from 'react';
import s from './login.module.scss';
import axios from 'axios';
import Link from 'next/link';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useDispatch } from 'react-redux';
import { useModalContext } from '/store/modal-context';
import { authAction } from '/store/auth-slice';
import { useRouter } from 'next/router';
import Kakao from '/public/img/icon/kakao.png';
import Naver from '/public/img/icon/naver.png';
import Image from 'next/image';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import filter_emptyValue from '/util/func/filter_emptyValue';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { validate } from '/util/func/validation/validation_userLogin';
import PureCheckbox from '/src/components/atoms/PureCheckbox';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import Spinner from '/src/components/atoms/Spinner';

const initialValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [activeAutoLogin, setActiveAutoLogin] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();

  function kakaoLoginFunc() {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    router.push(KAKAO_AUTH_URL);
  }

  const onAutoLoginHandler = (id, checked) => {
    setActiveAutoLogin(checked);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    // console.log(formValues)
    const errObj = validate(formValues);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    // console.log('FORMVALUES : ', formValues);
    if (!isPassed) return;

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const postFormValuesApiUrl = '/api/login';
      await axios
        .post(postFormValuesApiUrl, formValues, {
          headers: {
            'content-Type': 'application/json',
          },
        })
        .then((res) => {
          console.log(res);
          
          if (res.status === 200) {
            const token = res.headers.authorization;
            activeAutoLogin
              ? dispatch(authAction.autoLogin({ token }))
              : dispatch(authAction.login({ token }));
          }
        })
        .catch((err) => {
          console.error('ERROR: ', err.response);
          const errorStatus = err.response.status;
          let errorMessage= '';
          if(errorStatus === 400 || errorStatus === 404){
            // status 400 잘못된 비밀번호
            // status 404 : 계정이 존재하지 않음
            errorMessage= '아이디 또는 비밀번호가 정확하지 않습니다. \n계정정보를 확인해주세요.';
          } else{
            errorMessage = '서버 장애입니다. 잠시 후 다시 시도해주세요.';
          }

          mct.alertShow();
          setModalMessage(errorMessage);
        });
    } catch (err) {
      console.error('통신에러: ', err);
      setModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onGlobalModalCallback = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="로그인" />
      <Layout>
        <Wrapper>
          <div className={s.flex__container}>
            <div className={s.titlebox}>
              <header className={s.title}>
                <h2>로그인</h2>
              </header>
            </div>
            <form action="/" onSubmit={onSubmit}>
              <div className={s.inputbox}>
                <InputBox
                  name="아이디"
                  type={'text'}
                  id={'email'}
                  placeholder={'아이디를 입력해주세요.'}
                  setFormValues={setFormValues}
                  autoComplete={'username'}
                  errorMessage={
                    formErrors?.email && <ErrorMessage>{formErrors?.email}</ErrorMessage>
                  }
                />
                <InputBox
                  name="비밀번호"
                  type={'password'}
                  id={'password'}
                  placeholder={'비밀번호를 입력해주세요.'}
                  setFormValues={setFormValues}
                  autoComplete={'current-password'}
                  errorMessage={
                    formErrors?.password && <ErrorMessage>{formErrors?.password}</ErrorMessage>
                  }
                />
              </div>
              <div className={s.auto__login__check}>
                <label htmlFor="autoLogin" className={s.chk__box}>
                  <PureCheckbox
                    id={'autoLogin'}
                    value={activeAutoLogin || ''}
                    onClick={onAutoLoginHandler}
                  />
                  <div className={s.autologin}>자동 로그인</div>
                </label>
              </div>
              <div className={s.btnbox}>
                <button type={'button'} className={`${s.btn} ${s.btn_login}`} onClick={onSubmit}>
                  {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '로그인'}
                </button>
                <Link href={'/account/signup'} passHref>
                  <a>
                    <button type={'button'} className={`${s.btn} ${s.btn_signup}`}>
                      회원가입
                    </button>
                  </a>
                </Link>
              </div>
              <div className={s.id__pw__search}>
                <ul className={s.list}>
                  <li>
                    <Link href={'/account/findMyId'} passHref>
                      <a>아이디 찾기</a>
                    </Link>
                  </li>
                  <li>
                    <Link href={'/account/findMyPw'} passHref>
                      <a>비밀번호찾기</a>
                    </Link>
                  </li>
                </ul>
              </div>
              <h5 className={s.easylogin}>간편로그인</h5>
              <div className={s.login_sns}>
                <button type={'button'} className={s.kakao} onClick={kakaoLoginFunc}>
                  <Image src={Kakao} width={72} height={72} alt="카카오톡 아이콘" />
                </button>
                <button className={s.naver} type={'buttom'}>
                  <Image src={Naver} width="72" height="72" alt="네이버 아이콘" />
                </button>
              </div>
            </form>
          </div>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={modalMessage} onClick={onGlobalModalCallback} />
    </>
  );
}

const InputBox = ({ id, name, type, placeholder, setFormValues, errorMessage, autoComplete }) => {
  const [value, setValue] = useState('');

  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);
    setValue(filteredValue);
    if (setFormValues && typeof setFormValues === 'function') {
      setFormValues((prevState) => {
        return {
          ...prevState,
          [id]: filteredValue,
        };
      });
    }
  };

  return (
    <div className={s.input__box}>
      <label htmlFor={id}>
        <h4 className={s.input__title}>{name}</h4>
        <input
          id={id}
          value={value}
          onChange={onChangeHandler}
          type={type || 'text'}
          placeholder={placeholder}
          autoComplete={autoComplete}
        />
        {errorMessage}
      </label>
    </div>
  );
};
