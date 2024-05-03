import React, { useEffect, useRef, useState } from 'react';
import s from './login.module.scss';
import axios from 'axios';
import Link from 'next/link';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useDispatch, useSelector } from 'react-redux';
import { useModalContext } from '/store/modal-context';
import { authAction } from '/store/auth-slice';
import { useRouter } from 'next/router';
import KakaoLoginBtn from '/src/components/atoms/KakaoLoginBtn';
import NaverLoginBtn from '/src/components/atoms/NaverLoginBtn';
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
import { cookieType } from '/store/TYPE/cookieType';
import enterKey from '/util/func/enterKey';
import { FullScreenLoading } from '../../../components/atoms/FullScreenLoading';
import { getDataSSR, getTokenFromServerSide } from '../../api/reqData';
import { userType } from '../../../../store/TYPE/userAuthType';

const initialValues = {
  email: '',
  password: '',
};

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useDispatch();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const [modalMessage, setModalMessage] = useState('');
  const [isLoading, setIsLoading] = useState({});
  const [autoLogin, setAutoLogin] = useState(false);
  const [formValues, setFormValues] = useState(initialValues);
  const [formErrors, setFormErrors] = useState();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const naverRef = useRef();
  const previousPath = useSelector((state) => state.navigation.previousPath);

  useEffect(() => {
    const naverScript = document.createElement('script');
    naverScript.src =
      'https://static.nid.naver.com/js/naveridlogin_js_sdk_2.0.2.js';
    naverScript.type = 'text/javascript';
    document.head.appendChild(naverScript);

    naverScript.onload = () => {
      const naverLogin = new window.naver.LoginWithNaverId({
        clientId: process.env.NEXT_PUBLIC_NAVER_CLIENT_ID,
        callbackUrl: process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI,
        callbackHandle: true,
        isPopup: false,
        loginButton: {
          color: 'green',
          type: 3,
          height: 0,
        },
      });
      naverLogin.init();
      naverLogin.logout(); //네이버 로그인이 계속 유지되는 경우가 있음, 초기화시 로그아웃
    };
  }, []);

  function naverLoginFunc() {
    // naverRef.current.children[0].click();
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize`;
    const clientId = process.env.NEXT_PUBLIC_NAVER_CLIENT_ID;
    const redirUri = process.env.NEXT_PUBLIC_NAVER_REDIRECT_URI;
    const state = 'barfdogNaverLogin'; // state(상태 유지를 위한 임의의 문자열) 정보를 넣어 아래 예제와 같은 주소로 요청을 보낸다.
    // ! state => 필수항목 / 상태토큰값은 어디에서 확인하는지 , API 가이드에서 추가 확인 필요????
    router.push(
      `${NAVER_AUTH_URL}?response_type=code&client_id=${clientId}&redirect_uri=${redirUri}&state=${state}`,
    );
  }

  function kakaoLoginFunc() {
    const KAKAO_AUTH_URL = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY}&redirect_uri=${process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URI}&response_type=code`;
    router.push(KAKAO_AUTH_URL);
  }

  const onAutoLoginHandler = (id, checked) => {
    setAutoLogin(checked);
  };

  const onSubmit = async () => {
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');

    const errObj = validate(formValues);
    const isPassed = valid_hasFormErrors(errObj);
    setFormErrors(errObj);
    if (!isPassed) return;
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const autologinValue = cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 변경가능
      const defValue = cookieType.LOGIN_EXPIRED_PERIOD.VALUE_FOR_RESTAPI; // 2시간 (클라이언트에서 def 값은 변경불가)
      const body = {
        email: formValues.email,
        password: formValues.password,
        tokenValidDays: autoLogin ? autologinValue : defValue,
      };
      await axios
        .post('/api/login', body, {
          headers: {
            'content-Type': 'application/json',
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            const token = res.headers.authorization;
            const { temporaryPassword, email, name, roleList } = res.data;
            const urlParams = new URLSearchParams(window.location.search);
            const prevPathParams = urlParams.get('prevPath');

            const payload = {
              token,
              expiredDate: res.data.expiresAt,
              data: {
                temporaryPassword,
                email,
                name,
                roleList,
              },
              previousPath:
                prevPathParams !== '/'
                  ? prevPathParams
                  : previousPath
                  ? previousPath // 지정 (다음 페이지)
                  : sessionStorage.getItem('prevPath'), // 일반 (이전 페이지)
            };
            if (autoLogin) {
              dispatch(authAction.autoLogin(payload));
            } else {
              dispatch(authAction.login(payload));
            }
          } else {
            alert('로그인에 실패하였습니다.');
          }
          setIsSubmitted(true);
          setIsLoading((prevState) => ({
            ...prevState,
            movePage: true,
          }));
        })
        .catch((err) => {
          if (!err) return;
          console.error('ERROR: ', err);
          const errorStatus = err?.response?.status;
          let errorMessage = '';
          if (errorStatus === 400 || errorStatus === 404) {
            // status 400 잘못된 비밀번호
            // status 404 : 계정이 존재하지 않음
            errorMessage =
              '아이디 또는 비밀번호가 정확하지 않습니다. \n계정정보를 확인해주세요.';
          } else {
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

  const onEnterKeyHandler = (e) => {
    enterKey(e, onSubmit);
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
            <div className={s.login_sns_btn}>
              <KakaoLoginBtn
                align="right"
                className={`${s.loginBtn}`}
                onClick={kakaoLoginFunc}
              />
              <div
                className={s.naverId}
                id="naverIdLogin"
                style={{ display: 'none' }}
              ></div>
              <NaverLoginBtn
                align="right"
                className={`${s.loginBtn}`}
                onClick={naverLoginFunc}
              />
            </div>
            <div className={s.line_box}>
              <div className={s.line}></div>
              <div className={s.line_text}> 또는 이메일로 로그인 </div>
              <div className={s.line}></div>
            </div>
            <div onSubmit={onSubmit}>
              <div className={s.inputbox}>
                <InputBox
                  name="아이디"
                  type={'text'}
                  id={'email'}
                  placeholder={'아이디를 입력해주세요.'}
                  setFormValues={setFormValues}
                  autoComplete={'username'}
                  onKeyDown={onEnterKeyHandler}
                  errorMessage={
                    formErrors?.email && (
                      <ErrorMessage>{formErrors?.email}</ErrorMessage>
                    )
                  }
                />
                <InputBox
                  name="비밀번호"
                  type={'password'}
                  id={'password'}
                  placeholder={'비밀번호를 입력해주세요.'}
                  setFormValues={setFormValues}
                  autoComplete={'current-password'}
                  onKeyDown={onEnterKeyHandler}
                  errorMessage={
                    formErrors?.password && (
                      <ErrorMessage>{formErrors?.password}</ErrorMessage>
                    )
                  }
                />
                <div className={s.auto__login__container}>
                  <div className={s.auto__login__check}>
                    <label
                      htmlFor="autoLogin"
                      className={s.chk__box}
                      style={{
                        display: 'flex',
                        gap: '0.7rem',
                        marginLeft: '0.8rem',
                      }}
                    >
                      <PureCheckbox
                        id={'autoLogin'}
                        value={autoLogin || ''}
                        onClick={onAutoLoginHandler}
                      />
                      <div
                        className={s.autologin}
                        style={{
                          fontSize: '0.9rem',
                        }}
                      >
                        자동 로그인
                      </div>
                    </label>
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
                  </div>
                </div>
              </div>

              <div className={s.btnbox}>
                <button
                  type={'button'}
                  className={`${s.btn} ${s.btn_login}`}
                  onClick={onSubmit}
                >
                  {isLoading.submit || isLoading.movePage ? (
                    <Spinner style={{ color: '#fff' }} />
                  ) : (
                    '로그인'
                  )}
                </button>
                <Link href={'/account/signup'} passHref>
                  <a>
                    <button
                      type={'button'}
                      className={`${s.btn} ${s.btn_signup}`}
                    >
                      이메일로 회원가입
                    </button>
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </Wrapper>
      </Layout>
      {hasAlert && (
        <Modal_global_alert
          message={modalMessage}
          onClick={onGlobalModalCallback}
        />
      )}
    </>
  );
}

const InputBox = ({
  id,
  name,
  type,
  placeholder,
  setFormValues,
  errorMessage,
  autoComplete,
  onKeyDown,
}) => {
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
        <input
          id={id}
          value={value}
          onChange={onChangeHandler}
          type={type || 'text'}
          placeholder={placeholder}
          autoComplete={autoComplete}
          onKeyDown={onKeyDown}
        />
        {errorMessage}
      </label>
    </div>
  );
};

export async function getServerSideProps({ req }) {
  let token = null;
  let isMember = false;
  if (req?.headers?.cookie) {
    token = getTokenFromServerSide(req);
    const getApiUrl = `/api/mypage`;
    const res = await getDataSSR(req, getApiUrl, token);
    if (res && res.status === 200) {
      isMember = true;
    }
  }

  if (isMember) {
    return {
      redirect: {
        permanent: false,
        destination: '/',
      },
    };
  } else {
    return { props: {} };
  }
}
