import React, { useEffect, useState } from 'react';
import s from './Modal_AdminResetPassword.module.scss';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { authAction } from '@store/auth-slice';
import { useModalContext } from '@store/modal-context';
import axios from 'axios';
import timer from '@util/func/timer';
import transformTime from '@util/func/transformTime';
import filter_onlyNumber from '@util/func/filter_onlyNumber';
import CloseButton from '@src/components/atoms/CloseButton';
import Modal_alert from './Modal_alert';
import enterKey from "/util/func/enterKey";
import {valid_email} from "/util/func/validation/validationPackage";




export default function AdminResetPassword() {
  const mct = useModalContext();
  const initialTime = 181;
  const [isSendNumber, setIsSendNumber] = useState(false);
  const [startTimer, setStartTimer] = useState(false);
  const [time, setTime] = useState(initialTime);
  const [displayedTime, setDisplayedTime] = useState();
  const [authNum, setAuthNum] = useState();
  const [email, setEmail] = useState();

  useEffect(() => {
    if (time !== 0 && startTimer) timer(time, [setTime, setDisplayedTime], setStartTimer);
  }, [time, startTimer]);


  const onSendEmailHandler = (e) => {
    e.preventDefault();
    const val = email?.trim(); // test account: 'develope07@binter.co.kr'
    // if (!val) {
    //   mct.alertShow('이메일을 입력해주세요.');
    //   return;
    // }
    const error = valid_email(val);
    if(error) return mct.alertShow(error);
    

    (async () => {
      // 관리자 비밀번호 변경을 위해 이메일 인증번호 보내기
      const body = {
        email: val,
      };
      try {
        // insert async & await code
        const url = '/api/adminPasswordEmailAuth';
        const res = await axios
          .post(url, body, {
            headers: {
              'Content-Type': 'application/json',
            },
          })
          .then((res) => {
            return res;
          })
          .catch((err) => {
            return err;
          });
 
        if (res?.status === 200) {
          const authNumber = res.data.authNumber;
          setIsSendNumber(true);
          setStartTimer(true);
          setTime(initialTime);
          setAuthNum(authNumber);
        } else {
          mct.alertShow(
            '관리자 이메일이 아닌 경우 발송되지 않습니다.\n지속적으로 에러가 발생할 경우 서버 관리자에게 문의하세요.',
          );
        }
      } catch (err) {
        console.error('ERROR: ',err);
        alert(err);
      }
    })();
  };

  const onEmailChangeHandler = (e) => {
    const val = e.currentTarget.value;
    setEmail(val);
  };

  return (
    <>
      {/* {modalMessage && (
        <Modal_alert text={modalMessage} isConfirm={onModalHandler} />
      )} */}
      <div className={s['modal-wrap']}>
        <i className={s['btn-close']}>
          <CloseButton />
        </i>
        <h3 className={s.title}>비밀번호 재설정</h3>
        <div className={s.form}>
          <div className={s['form-row']}>
            <label htmlFor={s['modal-email']}>
              <input
                type="email"
                id="modal-email"
                placeholder="관리자 이메일주소를 입력해주세요."
                value={email || ''}
                onChange={onEmailChangeHandler}
                disabled={startTimer && true}
              />
            </label>
          </div>
          <div className={s['btn-section']}>
            <button
              type="button"
              className={`admin_btn solid fullWidth confirm_l ${startTimer && 'disabled'}`}
              onClick={onSendEmailHandler}
            >
              {isSendNumber ? '인증번호 재전송' : '인증번호 전송'}
            </button>
          </div>
          <div className={s.notice}>
            <p>1.개발사에게 전달한 바프독 사내 이메일을 입력하세요.</p>
            <p>2. 이메일, 비밀번호 모두가 기억나지 않을 경우, 개발사에게 문의하세요</p>
          </div>
        </div>
        {isSendNumber && <AuthNumber displayedTime={displayedTime} authNum={authNum} data={{email}}/>}
      </div>
    </>
  );
}

const AuthNumber = ({ displayedTime, authNum, data }) => {
  const mct = useModalContext();
  const [enteredNumber, setEnteredNumber] = useState('');
  const [submit, setSubmit] = useState(false);
  const router = useRouter();
  const dispatch = useDispatch();


  const onAuth = (e) => {
    e.preventDefault();
    if (!enteredNumber) return mct.alertShow('인증번호를 입력해주세요.');
    if(submit) return mct.alertShow( '이미 제출된 양식입니다.' );
     console.log('(*테스트 종류 후 삭제) 인증코드: ', authNum);
    if (authNum === enteredNumber) {
      const body = {
        email: data.email,
      }
      dispatch(authAction.adminResetPassword({data: body}));
      setSubmit(true);
      mct.alertShow(`인증 완료: 페이지 새로고침 전까지\n비밀번호를 변경할 수 있습니다.\n( 확인 버튼 클릭 후, 페이지 이동합니다.)`, onSuccessCallback); // 확인클릭 시, 비밀번호 재설정 modal Hide
    } else {
      mct.alertShow('인증실패: 인증번호를 확인해주세요.');
      setSubmit(false);
    }
  };
  
  const onSuccessCallback = async () => {
    mct.onHide();
    mct.alertHide();
    await router.push(`/bf-admin/login/resetPassword?authnum=${authNum}`);
  };

  const onChangeHandler = (e) => {
    const val = e.currentTarget.value;
    const filteredValue = filter_onlyNumber(val);
    setEnteredNumber(filteredValue);
  };
  
  const onKeyDownHandler = (e)=>{
    enterKey(e, onAuth)
  }
  

  return (
    <>
      <div className={s['form-row']}>
        <label htmlFor={s['modal-email']}>
          <input
            type="text"
            id="modal-email"
            value={enteredNumber || ''}
            placeholder="인증번호 4자리를 입력해주세요."
            onChange={onChangeHandler}
            onKeyDown={onKeyDownHandler}
            disabled={submit}
          />
          {!submit && <em className={s.displayedTime}>{transformTime( displayedTime )}</em>}
        </label>
      </div>
      <div className={s['btn-section']}>
        <button type="button" className={`admin_btn solid fullWidth confirm_l ${submit ? 'disabled': ''}`} disabled={submit} onClick={onAuth}>
          인증하기
        </button>
      </div>
      {/*{modalMessage && <Modal_alert className={s.alertModal} text={modalMessage} isConfirm={onModalHandler} />}*/}
    </>
  );
};
