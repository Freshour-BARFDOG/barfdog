import React, { useEffect, useState } from 'react';
import s from "./Modal_AdminResetPassword.module.scss";
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authAction } from '@store/auth-slice';
import { postData } from "/api/reqData";
import axios from "axios";


import timer from "@util/func/timer";
import transformTime from "@util/func/transformTime";
import filter_onlyNumber from "@util/func/filter_onlyNumber";
import randomNumbers from "@util/func/randomNumbers";
import CloseButton from "@src/components/atoms/CloseButton";
import Modal_alert from "./Modal_alert";



// 1. 관리자 계정 확인 (get)
// 2. 다이렉트 샌드 이메일 사용 /// 클라이언트에서 인증번호 생성
// 3. 입력번호 확인 후 / 변경된 비밀번호 전송
//


const AuthNumberComponent = ({ displayedTime, authNum }) => {

  const [numberBeforeAuth, setNumberBeforeAuth] = useState("");
  const [modalMessage, setModalMessage] = useState("");
  const [isAuth, setAuth]= useState(false);
  const router = useRouter();
  const dispatch = useDispatch();

  const onModalHandler = (isConfirm) => {
    if (isConfirm) setModalMessage("");
    if(isAuth) router.push(`/bf-admin/login/password?authnum=${authNum}`);
  };

  const onAuthNumberHandler = (e) => {
    e.preventDefault();
    console.log('인증코드 확인용 console: ',authNum); // ! -------> 테스트용: 개발기간 끝난 후 삭제할 것
    if (authNum === numberBeforeAuth) {
      
      setModalMessage(
        `인증 완료: 페이지 새로고침 전까지 비밀번호를 변경할 수 있습니다.`
      )
      dispatch(authAction.adminResetPassword());
      setAuth(true);
    }else{
      setModalMessage("인증실패: 인증번호를 확인해주세요.");
      setAuth(false);
    }
  };

  const onChangeHandler = (e) => {
    const val = e.currentTarget.value;
    const filteredValue = filter_onlyNumber(val);
    setNumberBeforeAuth(filteredValue);
  };



  return (
    <>
      {modalMessage && (
        <Modal_alert text={modalMessage} isConfirm={onModalHandler} />
      )}
      <form action="/bf-admin/login" onSubmit={onAuthNumberHandler}>
        <div className={s["form-row"]}>
          <label htmlFor={s["modal-email"]}>
            <input
              type="text"
              id="modal-email"
              value={numberBeforeAuth}
              placeholder="인증번호 6자리를 입력해주세요."
              onChange={onChangeHandler}
            />
            <em className={s.displayedTime}>{transformTime(displayedTime)}</em>
          </label>
        </div>
        <div className={s["btn-section"]}>
          <button type="submit" className="admin_btn solid fullWidth confirm_l">
            인증하기
          </button>
        </div>
      </form>
    </>
  );
};







function AdminResetPassword() {

  const initialTime = 181;
  const [isSendNumber, setIsSendNumber] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [time, setTime] = useState(initialTime);
  const [displayedTime, setDisplayedTime] = useState();
  const [authNum, setAuthNum] =  useState();
  const [email, setEmail] = useState();
  const [modalMessage, setModalMessage] = useState('');


  useEffect(() => {
    if (time !== 0 && startTimer)
      timer(time, [setTime, setDisplayedTime], setStartTimer);
  }, [time, startTimer, modalMessage]);


  const onModalHandler = (isConfirm) => {
    if (isConfirm) setModalMessage('');
  }

  const onSendEmailHandler = (e) => {
    e.preventDefault();
    const val = email?.trim(); // test account: 'develope07@binter.co.kr'

    if (!val) {
      setModalMessage("이메일을 입력해주세요.");
      return;
    }

    const body = {
      email: val,
    };
    
    const postDataToServer = (async(res) => {
      const response = await axios
        .post("/api/adminPasswordEmailAuth", body, {
          "Content-Type": "application/json",
        })
        .then((res) => {
          // console.log(res);
          return res;

        })
        .catch((err) => {
          console.log(err.response);
          console.log(err.request);
        });
        if (response?.status === 200){
          setIsSendNumber(true);
          setStartTimer(true);
          setTime(initialTime);
          setAuthNum(randomNumbers(6));
        } else{
          setModalMessage("관리자 이메일이 아닌 경우 발송되지 않습니다. 지속적으로 에러가 발생할 경우 서버 관리자에게 문의하세요.");
        }
    })();



  }

  const onEmailChangeHandler = (e) => {
    const val = e.currentTarget.value;
    setEmail(val);
  }

  return (
    <>
      {modalMessage && (
        <Modal_alert text={modalMessage} isConfirm={onModalHandler} />
      )}
      <div className={s["modal-wrap"]}>
        <i className={s["btn-close"]}>
          <CloseButton />
        </i>
        <h3 className={s.title}>비밀번호 재설정</h3>
        <form action="/bf-admin/login" onSubmit={onSendEmailHandler}>
          <div className={s["form-row"]}>
            <label htmlFor={s["modal-email"]}>
              <input
                type="email"
                id="modal-email"
                placeholder="관리자 이메일주소를 입력해주세요."
                value={email}
                onChange={onEmailChangeHandler}
                disabled={startTimer && true}
              />
            </label>
          </div>
          <div className={s["btn-section"]}>
            <button
              type="submit"
              className={`admin_btn solid fullWidth confirm_l ${
                startTimer && "disabled"
              }`}
            >
              {isSendNumber ? "인증번호 재전송" : "인증번호 전송"}
            </button>
          </div>
          <div className={s.notice}>
            <p>1.개발사에게 전달한 바프독 사내 이메일을 입력하세요.</p>
            <p>
              2. 이메일, 비밀번호 모두가 기억나지 않을 경우, 개발사에게
              문의하세요
            </p>
          </div>
        </form>
        {isSendNumber && (
          <AuthNumberComponent
            displayedTime={displayedTime}
            authNum={authNum}
          />
        )}
      </div>
    </>
  );
}

export default AdminResetPassword