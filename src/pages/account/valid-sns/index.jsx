import React, { useEffect, useState } from 'react';
import s from 'src/pages/account/valid-sns/valid-sns.module.scss';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import axios from 'axios';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { useDispatch, useSelector } from 'react-redux';
import Spinner from '/src/components/atoms/Spinner';
import { useModalContext } from '/store/modal-context';
import enterKey from '/util/func/enterKey';
import { authAction } from '/store/auth-slice';
import { filter_blindEmail } from '/util/func/filter_blindEmail';

export default function ValidSnsPage() {
  const userState = useSelector((s) => s.userState);
  const dispatch = useDispatch();
  const mct = useModalContext();
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [tokenFromServer, setTokenFromServer] = useState(null);
  const [isLoading, setIsLoading] = useState({});

  // // console.log(userState)
  useEffect(() => {
    if (!userState.snsInfo.provider || !userState.snsInfo.provider) {
      alert('연동할 SNS정보가 없습니다.');
      window.location.href= '/';
    }
  }, []);

  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);
    setFormValues((prevState) => {
      return {
        ...prevState,
        [id]: filteredValue,
      };
    });
  };
  
  const onSuccessHandler = () => {
    mct.alertHide();
    const token = tokenFromServer;
    if (token) {
      dispatch(authAction.login({ token, redirect: '/account/valid-sns/result' }));
    } else {
      alert('인증과정 중에 문제가 발생했습니다. 다시 시도해주세요.');
      window.location.href = '/account/login';
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    if (!formValues.password) {
      // client 유효성검사: 비밀번호가 비어있는지
      mct.alertShow();
      return setAlertModalMessage(`비밀번호를 입력해주세요.`);
    }

    // const body = { // ! TEST TESTTESTTESTTESTTESTTEST
    //   password: 'user',
    //   phoneNumber: '01099038544',
    //   provider: userState.snsInfo.provider, // SNS 업체
    //   providerId: userState.snsInfo.providerId, // sns 고유값
    //   tokenValidDays: null, // null 일 경우, 서버 최소 토큰유지: 2시간
    // };
    // // console.log(body);

    const body = {
      password: formValues.password,
      phoneNumber: userState.snsInfo.mobile.replace(/-/g, '') || userState.snsInfo.mobile_e164, // 본인 휴대폰번호 ! Q. 국제번호일경우 => 처리 방침 ?
      provider: userState.snsInfo.provider, // SNS 업체
      providerId: userState.snsInfo.providerId, // sns 고유값
      tokenValidDays: null, // null 일 경우, 서버 최소 토큰유지: 2시간
    };
    // console.log('valid_body:', body);

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      await axios
        .post('/api/connectSns', body, {
          headers: {
            'content-Type': 'application/json',
          },
        })
        .then((res) => {
          // console.log(res);
          if (res.status === 200) {
            const token = res.headers.authorization;
            setIsSubmitted(true);
            setTokenFromServer(token);
            // location.replace('/')
            // res.redirect(`/`);
            setIsLoading((prevState) => ({
              ...prevState,
              submit: false,
            })); 
            onSuccessHandler();
            window.location.href= '/';
          }
        })
        .catch((err) => {
          mct.alertHide();
          // // console.log(err.response);
          if (err.response.status === 400) {
            mct.alertShow();
            setAlertModalMessage(`비밀번호가 올바르지 않습니다.`);
          }
          console.error('서버통신오류: ', err);
          setIsLoading((prevState) => ({
            ...prevState,
            submit: false,
          }));
        });
    } catch (err) {
      console.error(err);
    }
  };

  const onEnterKeyHandler = (e) => {
    enterKey(e, onSubmit);
  };

  const onConfirmHandler = () => {
    mct.alertHide();
  };

  if (!userState.snsInfo.providerId || !userState.snsInfo.provider) {
    return console.error('Required Provider');
  }

  return (
    <>
      <MetaTitle title="SNS계정 연동확인" />
      <Layout>
        <Wrapper>
          <div className={s.box}>
            <p className={s.text}>
              고객님은 기존에 가입된 회원입니다.
              <p>{filter_blindEmail(userState.snsInfo.email)}</p>
              기존 계정의 비밀번호 입력 후 연동이 완료됩니다.
            </p>
            <div className={s.container}>
              <div className={s['input-wrap']}>
                <input
                  type={'password'}
                  id={'password'}
                  name={'password'}
                  placeholder={'비밀번호를 입력해주세요.'}
                  onKeyDown={onEnterKeyHandler}
                  onChange={onChangeHandler}
                  value={formValues.password || ''}
                />
                {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
              </div>
              <button type={'button'} className={s.btn} onClick={onSubmit}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '연동하기'}
              </button>
            </div>
          </div>
        </Wrapper>
      </Layout>
      <Modal_global_alert
        message={alertModalMessage}
        onClick={isSubmitted ? onSuccessHandler : onConfirmHandler}
      />
    </>
  );
}




