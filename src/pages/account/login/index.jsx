import React, {useEffect, useRef, useState} from 'react';
import s from './login.module.scss';
import axios from 'axios';
import Link from 'next/link';
import MetaTitle from "/src/components/atoms/MetaTitle";
import {useDispatch} from "react-redux";
import {useModalContext} from "/store/modal-context";
import {authAction} from "@store/auth-slice";
import {useRouter} from 'next/router';
import Kakao from '/public/img/icon/kakao.png';
import Naver from '/public/img/icon/naver.png';
import Image from 'next/image';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import filter_emptyValue from '/util/func/filter_emptyValue';
import Modal_global_alert from "/src/components/modal/Modal_global_alert";
import ErrorMessage from "/src/components/atoms/ErrorMessage";
import {validate} from "/util/func/userLogin_validation";
import PureCheckbox from "/src/components/atoms/PureCheckbox";


/*
*  MEMO 4. 그리고, 로그인 토큰이 존재한다면,,,, 로그인 / 회원가입 페이지에 접근할 경우 . Redir
*
* */


const initialValues = {
  email: '',
  password: '',
  // autoLogin:false
};


export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();

  const naverRef = useRef();
  useEffect(() => {
    const naverScript = document.createElement("script");
    naverScript.src = "https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js";
    naverScript.type = "text/javascript";
    document.head.appendChild(naverScript);

    naverScript.onload = () => {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
        callbackHandle: true,
        isPopup: false,
        loginButton: {
          color: "green",
          type: 3,
          height: 0,
        }
      });
      naverLogin.init();
      naverLogin.logout(); //네이버 로그인이 계속 유지되는 경우가 있음, 초기화시 로그아웃
    }
  }, []);

  function naverLoginFunc() {
    naverRef.current.children[0].click();

  }

  function kakaoLoginFunc() {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    router.push(KAKAO_AUTH_URL);
  }


  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const errorObj = await validate(formValues);
      setFormErrors(prevState => ({
        ...prevState,
        ...errorObj
      }));
      let isPassedValid = true;
      for (const key in errorObj) {
        const error = errorObj[key]
        if (error) isPassedValid = false;
      }
      if (isPassedValid) {
        sendFormValueData(formValues);
      }
    } catch (err) {
      console.error('통신에러: ', err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
  };

  const sendFormValueData = (data) => {
    // console.log(data);
    const TEST_DATA = {
      email: data.email,
      password: data.password
    }
    // console.log('FORMVALUES : ', formValues);
    // console.log('FORMERRORS : ', formErrors);
    axios
      .post('/api/login', TEST_DATA, {
        headers: {
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        console.log(res);
        console.log(formValues)
        if (res.status === 200) {
          const token = res.headers.authorization;
          const activeAutoLogin = data.autoLogin;
          activeAutoLogin ? dispatch(authAction.autoLogin({token})) : dispatch(authAction.login({token}))
          ;
        }
      })
      .catch((err) => {
        console.error('서버통신오류: ', err);
        mct.alertShow();
        setAlertModalMessage('서버 장애입니다. 잠시 후 다시 시도해주세요.');
        console.error(err.request);
        console.error(err.response);
      });
  };


  return (
    <>
      <MetaTitle title="로그인"/>
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
                  errorMessage={formErrors?.email && <ErrorMessage>{formErrors?.email}</ErrorMessage>}
                />
                <InputBox
                  name="비밀번호"
                  type={'password'}
                  id={'password'}
                  placeholder={'비밀번호를 입력해주세요.'}
                  setFormValues={setFormValues}
                  errorMessage={formErrors?.password && <ErrorMessage>{formErrors?.password}</ErrorMessage>}
                />
              </div>
              <div className={s.auto__login__check}>
                <label htmlFor="autoLogin" className={s.chk__box}>
                  <PureCheckbox
                    id={'autoLogin'}
                    value={formValues.autoLogin}
                    setValue={setFormValues}
                  />
                  <div className={s.autologin}>자동 로그인</div>
                </label>
              </div>
              <div className={s.btnbox}>
                <button type={'button'} className={`${s.btn} ${s.btn_login}`} onClick={onSubmit}>
                  로그인
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
                  <Image src={Kakao} width={72} height={72} alt="카카오톡 아이콘"/>
                </button>
                {/* naver가 제공해주는 로그인 버튼*/}
                <div ref={naverRef} id="naverIdLogin"></div>
                <button className={s.naver} type={'submit'} onClick={naverLoginFunc}>
                  <Image src={Naver} width="72" height="72" alt="네이버 아이콘"/>
                </button>
              </div>
            </form>
          </div>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={alertModalMessage}/>
    </>
  );
}


const InputBox = ({id, name, type, placeholder, setFormValues, errorMessage}) => {
  const [value, setValue] = useState('');

  const onChangeHandler = (e) => {
    const {id, value} = e.currentTarget;
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
  }

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
        />
        {errorMessage}
      </label>
    </div>
  );
}
