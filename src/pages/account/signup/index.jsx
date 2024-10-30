import React, { useRef, useState } from 'react';
import axios from 'axios';
import s from './signup.module.scss';
import { useRouter } from 'next/router';
import MetaTitle from '/src/components/atoms/MetaTitle';
import { useDispatch, useSelector } from 'react-redux';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import SignInputList from '/src/components/user_signup/SignInputList';
import SignupPolicyList, {
  policy_KEYS,
} from '/src/components/user_signup/SignupPolicyList';
import Modal_termsOfSerivce from '/src/components/modal/Modal_termsOfSerivce';
import Modal_termsOfThird from '/src/components/modal/Modal_termsOfThird';
import Modal_privacy from '/src/components/modal/Modal_privacy';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useModalContext } from '/store/modal-context';
import { validate } from '/util/func/validation/validation_signup';
import { valid_policyCheckbox } from '/util/func/validation/validationPackage';
import { transformPhoneNumber } from '/util/func/transformPhoneNumber';
import { naverGender } from '/util/func/naverGender';
import { kakaoGender } from '/util/func/kakaoGender';
import { getDataSSR, getTokenFromServerSide } from '../../api/reqData';
import { deleteCookie, getCookie, setCookie } from '@util/func/cookie';
import { useEffect } from 'react';
import { cookieType } from '/store/TYPE/cookieType';
import { authAction } from '/store/auth-slice';
import useNaverAnalytics from "../../../../util/hook/useNaverAnalytics";

String.prototype.insertAt = function (index, str) {
  return this.slice(0, index) + str + this.slice(index);
};

export default function SignupPage() {
  const dispatch = useDispatch();
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
  const router = useRouter();
  const userState = useSelector((s) => s.userState);
  const inputrefs = {
    name: useRef(null),
    email: useRef(null),
    password: useRef(null),
    passwordConfirm: useRef(null),
    phoneNumber: useRef(null),
    street: useRef(null),
    detailAddress: useRef(null),
    birthday: useRef(null),
  };

  const snsSignupMode = !!userState.snsInfo.providerId;
  const convertedBirthday =
    snsSignupMode && userState.snsInfo?.birthday?.indexOf('-') < 0
      ? `${userState.snsInfo.birthday.substring(
          0,
          2,
        )}-${userState.snsInfo.birthday.substring(2)}` // 생일: 하이픈없을 경우 중간에 하이픈 넣는다.
      : userState.snsInfo?.birthday;

  const initialFormValues = {
    name: userState.snsInfo.name || '',
    email: userState.snsInfo.email || '',
    password: '',
    confirmPassword: '',
    phoneNumber:
      transformPhoneNumber(userState.snsInfo.mobile, { seperator: '' }) || '',
    address: {
      zipcode: '',
      street: '',
      city: '',
      detailAddress: '',
    },
    birthday: `${userState.snsInfo.birthyear}-${convertedBirthday}` || '', // date형식: yyyy-mm-dd
    // birthday: new Date(userState.snsInfo.birthyear, (convertedBirthday && convertedBirthday.split('-')[1] - 1), (convertedBirthday && convertedBirthday.split('-')[2])) || '',

    gender:
      userState.snsInfo.provider == 'naver'
        ? naverGender(userState.snsInfo.gender)
        : userState.snsInfo.provider == 'kakao'
        ? kakaoGender(userState.snsInfo.gender)
        : 'NONE',
    recommendCode: '',
    agreement: {
      servicePolicy: false,
      privacyPolicy: false,
      receiveSms: false,
      receiveEmail: false,
      over14YearsOld: false,
    },
    provider: userState.snsInfo.provider || null,
    providerId: userState.snsInfo.providerId || null,
  };

  // // console.log('userState: ',userState)

  const initialFormErrors = {
    isEmailDuplicated: null,
    isValidPhoneNumber: '휴대폰번호 인증이 필요합니다.',
  };

  const [isModalActive, setIsModalActive] = useState({
    termsOfService: false,
    termsOfThird: false,
    privacy: false,
  });
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [submitted, setSubmitted] = useState(false);

  const [visibility, setVisibility] = useState(false);
  const [alliance, setAlliance] = useState(null);

  // console.log('initialFormValues: ', initialFormValues);
  // console.log('snsSignupMode: ', snsSignupMode);
  // console.log('formValues: ', formValues);

  useEffect(() => {
    inputrefs.name.current.focus();
    // @YYL 콕뱅크 회원인지 확인
    if (getCookie('alliance') === 'cb') {
      setAlliance('cb');
      setVisibility(true);
    }
  }, []);

  const onLoginHandler = async () => {
    try {
      // const autologinValue = cookieType.AUTO_LOGIN_EXPIRED_PERIOD.VALUE; // 변경가능
      const defValue = cookieType.LOGIN_EXPIRED_PERIOD.VALUE_FOR_RESTAPI; // 2시간 (클라이언트에서 def 값은 변경불가)
      const body = {
        email: formValues.email,
        password: formValues.password,
        tokenValidDays: defValue,
      };
      await axios
        .post('/api/login', body, {
          headers: {
            'content-Type': 'application/json',
          },
        })
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            const token = res.headers.authorization;
            const { temporaryPassword, email, name, roleList } = res.data;

            const payload = {
              token,
              expiredDate: res.data.expiresAt,
              data: {
                temporaryPassword,
                email,
                name,
                roleList,
              },
            };
            dispatch(authAction.login(payload));
            // 홈으로 이동
            // router.push('/');
          } else {
            alert('로그인에 실패하였습니다.');
          }
          // setIsLoading((prevState) => ({
          //   ...prevState,
          //   movePage: true,
          // }));
        })
        .catch((err) => {
          if (!err) return;
          console.error('ERROR: ', err);
          // const errorStatus = err?.response?.status;
          // let errorMessage = '';
          // errorMessage = '서버 장애입니다. 잠시 후 다시 시도해주세요.';
          // mct.alertShow(errorMessage);
        });
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
  };

  const onSubmit = async () => {
    if (submitted) return console.error('Already Submitted!');
    try {
      const validateMode = snsSignupMode ? 'sns' : 'normal';
      const validFormResultObj = await validate(formValues, formErrors, {
        mode: validateMode,
      });
      const validPolicyResultObj = valid_policyCheckbox(
        formValues.agreement,
        policy_KEYS,
      );
      setFormErrors((prevState) => ({
        ...prevState,
        ...validFormResultObj,
        ...validPolicyResultObj,
      }));

      let isPassed = true;
      for (const validFormResultObjKey in validFormResultObj) {
        const error = validFormResultObj[validFormResultObjKey];
        if (error) isPassed = false;
      }

      if (!isPassed) {
        if (validFormResultObj.name) {
          return inputrefs.name.current.focus();
        }
        if (validFormResultObj.email) {
          return inputrefs.email.current.focus();
        }
        if (validFormResultObj.isEmailDuplicated) {
          return inputrefs.email.current.focus();
        }
        if (validFormResultObj.password) {
          return inputrefs.password.current.focus();
        }
        if (validFormResultObj.confirmPassword) {
          return inputrefs.passwordConfirm.current.focus();
        }
        if (validFormResultObj.phoneNumber) {
          return inputrefs.phoneNumber.current.focus();
        }
        if (validFormResultObj.isValidPhoneNumber) {
          return inputrefs.phoneNumber.current.focus();
        }
        if (validFormResultObj.street) {
          let element = document.querySelector('#addressTitle');
          return element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }
        if (validFormResultObj.detailAddress) {
          return inputrefs.detailAddress.current.focus();
        }
        if (validFormResultObj.birthday) {
          let element = document.querySelector('#birthdayTitle');
          return element.scrollIntoView({
            behavior: 'smooth',
            block: 'center',
          });
        }

        // return mct.alertShow('유효하지 않은 항목이 있습니다.');
      }

      for (const validPolicyResultObjKey in validPolicyResultObj) {
        const error = validPolicyResultObj[validPolicyResultObjKey];
        if (error) isPassed = false;
      }
      // if (!isPassed) return mct.alertShow('이용약관을 확인해주세요.');
      if (!isPassed) {
        let element = document.querySelector('#signupTitle');
        return element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }

      mct.alertHide('');
      setSubmitted(true);
      await postSignupData(formValues);
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
      setSubmitted(false);
    }
  };

  const postSignupData = async (formvalues) => {
    const randomPW = generateRandomString(12);
    const body = {
      provider: formvalues.provider || null,
      providerId: formvalues.providerId || null,
      name: formvalues.name,
      email: formvalues.email,
      password: snsSignupMode ? randomPW : formvalues.password,
      confirmPassword: snsSignupMode ? randomPW : formvalues.confirmPassword,
      phoneNumber: formvalues.phoneNumber,
      address: {
        zipcode: formvalues.address.zipcode,
        city: formvalues.address.city,
        street: formvalues.address.street,
        detailAddress: formvalues.address.detailAddress,
      },
      birthday: formvalues.birthday,
      gender: formvalues.gender,
      recommendCode: formvalues.recommendCode || '',
      agreement: {
        servicePolicy: formvalues.agreement.servicePolicy,
        privacyPolicy: formvalues.agreement.privacyPolicy,
        receiveSms: formvalues.agreement.receiveSms,
        receiveEmail: formvalues.agreement.receiveEmail,
        over14YearsOld: formvalues.agreement.over14YearsOld,
      },

      // @YYL 콕뱅크 회원인지 확인
      allianceInfo: {
        alliance: alliance,
        alliancePolicy: formvalues.agreement.thirdPolicy,
      },
    };
    // console.log('SUBMIT BODY:\n', body);

    await axios
      .post('/api/join', body, {
        headers: {
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // console.log(res);
        // console.log(res.data);
        if (res.status === 201) {
          const userName = formvalues.name;
          mct.alertShow(`회원가입에 성공하였습니다.`, onSuccessCallback);
          // router.push(`/account/signup/success?username=${userName}`);
        } else {
          mct.alertHide(
            `회원가입에 실패하였습니다. 잠시 후 다시 시도해주세요.`,
          );
        }
      })
      .catch((err) => {
        mct.alertHide(`ERROR\n\n서버와 통신할 수 없습니다.`);
        console.error('서버통신오류: ', err);
        setSubmitted(false);
      });
  };
  const { triggerConversion } = useNaverAnalytics();
  const onSuccessCallback = async () => {
    // await router.push(`/account/signup/success?username=${userName}`);

    // 전환 스크립트 설정
    triggerConversion('2', '1');

    // const script1 = document.createElement('script');
    // script1.src = '//wcs.naver.net/wcslog.js';
    // script1.async = true;
    // document.body.appendChild(script1);
    //
    // const script2 = document.createElement('script');
    // script2.type = 'text/javascript';
    // script2.innerHTML = `
    //           var _nasa = {};
    //           if (window.wcs) _nasa["cnv"] = wcs.cnv("2", "1"); // 전환유형 2: 회원가입 완료, 전환가치 1: 고정 값
    //         `;
    // document.body.appendChild(script2);

    // // 전환 스크립트가 작동할 시간을 주기 위해 잠시 대기
    setTimeout(() => {
      // 회원가입 후 바로 로그인
      onLoginHandler();
    }, 500); // 0.5초 대기
  };

  const generateRandomString = (num) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < num; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }

    return result;
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  return (
    <>
      <MetaTitle title="회원가입" />
      <Layout>
        <Wrapper>
          <div className={s.main}>
            <div className={s['title-wrap']}>
              <h2 className={s['main-title']}>회원가입</h2>
            </div>

            <div className={s['join-form']} onSubmit={onSubmit}>
              <section className={s['input-section']}>
                <SignInputList
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  inputrefs={inputrefs}
                />
              </section>
              <section className={s['policy-section']}>
                <div className={`${s['title-wrap']}`}>
                  <h3 className={`${s['main-title']}`} id="signupTitle">
                    이용약관 동의
                  </h3>
                </div>
                <SignupPolicyList
                  formValues={formValues}
                  setFormValues={setFormValues}
                  formErrors={formErrors}
                  setFormErrors={setFormErrors}
                  setModalState={setIsModalActive}
                  setCokbank={visibility}
                  inputrefs={inputrefs}
                />
              </section>
              <section className={s['btn-section']}>
                <button
                  type={'button'}
                  className={`${s.btn} ${s.join}`}
                  onClick={onSubmit}
                >
                  회원가입
                </button>
              </section>
            </div>
          </div>
        </Wrapper>
      </Layout>
      {isModalActive.termsOfService && (
        <Modal_termsOfSerivce
          modalState={isModalActive.termsOfService}
          setModalState={setIsModalActive}
        />
      )}
      {visibility && isModalActive.termsOfThird && (
        <Modal_termsOfThird
          modalState={isModalActive.termsOfThird}
          setModalState={setIsModalActive}
        />
      )}
      {isModalActive.privacy && (
        <Modal_privacy
          modalState={isModalActive.privacy}
          setModalState={setIsModalActive}
        />
      )}
      {hasAlert && <Modal_global_alert onClick={onClickModalButton} />}
    </>
  );
}

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
