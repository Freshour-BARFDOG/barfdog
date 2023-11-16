import React, { useEffect, useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { Title } from '/src/components/atoms/Checkbox';
import s from '../valid-sns/result.module.scss';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { putObjData } from '/src/pages/api/reqData';
import { userStateAction } from '/store/userState-slice';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import MetaTitle from "../../../components/atoms/MetaTitle";

const coolTime = 60;
let remainingTime = coolTime;
export default function FindMyPasswordPage() {
  const mct = useModalContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const userState = useSelector((s) => s.userState);
  const userInfo = userState.tempMyAccount;
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [time, setTime] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isSubmitted) return;
    let timer;
    if (timer) return clearTimeout(timer);
    timer = setInterval(() => {
      if (remainingTime <= 0) {
        remainingTime = coolTime;
        setIsSubmitted(false);
        clearTimeout(timer);
      }
      const timerStr = `0:${('0' + remainingTime--).slice(-2)}`;
      setTime(timerStr);
    }, 1000);
    return () => {
      timer = null;
    };
  }, [isSubmitted]);

  useEffect(() => {
    if (!userInfo.email) {
      alert('조회된 계정이 없습니다.');
      window.location.href = '/account/login';
    }
  }, []);

  const onSubmit = async (e) => {
    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        email: userInfo.email,
        name: userInfo.name,
        phoneNumber: userInfo.phoneNumber,
      };
      // console.log(body);
      const url = `/api/temporaryPassword`; // 임시 비밀번호 발급
      const res = await putObjData(url, body);
      if (res.isDone) {
        const success = res.data.data.responseCode === 200; // DirectSend(핸드폰 메시지 전송 API) 응답코드 (200 이외의 값이면 다이렉트센드 내부 에러);
        if (success) {
          dispatch(userStateAction.tempMyAccount({ data: body }));
          setModalMessage('임시비밀번호를 재전송하였습니다.');
          setIsSubmitted(true);
        } else {
          mct.alertShow();
          setModalMessage(
            '임시 비밀번호 발신 중, 문제가 발생하였습니다.\n지속적으로 문제가 발생할경우, 사이트 관리자에게 문의해주세요.',
          );
        }

        await router.push('/account/findMyPw/result');
      } else if (res.status === 404) {
        mct.alertShow();
        setModalMessage('일치하는 정보를 찾을 수 없습니다.');
      }
    } catch (err) {
      console.error('통신에러: ', err);
      setModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onClickModalButton = () => {
    mct.alertHide();
  };

  if (!userInfo.email) {
    return;
  }
  return (
    <>
      <MetaTitle title="비밀번호 찾기 결과" />
      <Layout>
        <Wrapper>
          <div className={s.flex_container}>
            <Title name="비밀번호 찾기"></Title>
            <section className={`${s.linebox} ${s['flex-box']}`}>
              {isLoading.submit ? (
                <Spinner />
              ) : (
                <div>
                  <span className={`${s.frontline} ${s.pwline}`}>회원님 휴대폰으로</span>
                  <span className={`${s.secondline} ${s.pwline}`}>
                    임시비밀번호가 발급되었습니다.
                  </span>
                </div>
              )}
            </section>
            <button
              type={'button'}
              className={`${s.btn} ${s.white} ${isSubmitted ? s.disabled : ''}`}
              onClick={onSubmit}
              disabled={isSubmitted}
            >
              {isSubmitted ? time : '임시비밀번호 재발급'}
            </button>
            <Link href={'/account/login'} passHref>
              <a className={s.btn}>
                <button type={'button'}>로그인</button>
              </a>
            </Link>
          </div>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={modalMessage} onClick={onClickModalButton} />
    </>
  );
}
