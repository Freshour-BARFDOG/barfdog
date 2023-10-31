import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './withdrawal.module.scss';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';
import filter_emptyValue from '/util/func/filter_emptyValue';
import useDeviceState from '/util/hook/useDeviceState';
import { valid_isEmpty } from '/util/func/validation/validationPackage';
import {deleteData, deleteObjData, getDataSSR} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import enterKey from '/util/func/enterKey';
import { authAction } from '/store/auth-slice';
import {useDispatch, useSelector} from 'react-redux';

export default function WithDrawalPage() {
  const mct = useModalContext();
  const auth = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const deviceState = useDeviceState();
  const isMobile = deviceState.isMobile;

  const [pw, setPw] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState({});

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { value } = input;
    let filteredValue = filter_emptyValue(value); // 스페이스바 제거
    setPw(filteredValue);
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    const isEmpty = valid_isEmpty(pw);
    if (isEmpty) {
      mct.alertShow('비밀번호를 입력해주세요.');
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));

      const url = '/api/members';
      const res = await deleteObjData(url, {
        data: { password: pw },
      });
      // console.log(res);
      let message;
      if (res.isDone) {
        setIsSubmitted(true);
        message = '회원 탈퇴되었습니다.\n그 동안 바프독을 이용해주셔서 감사합니다.';
        setTimeout(()=>{
          dispatch(authAction.logout());
        },3000)
        
      } else if (res.status === 400) {
        
        const errorArr = res.data.data.errors;
        message = errorArr.map(err=>err.defaultMessage).join(', '); // 서버에서 보낸 에러 사유
      }
  
      mct.alertShow(message);
    } catch (err) {
      console.error('통신에러: ', err);
      mct.alertShow(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onKeyDownHandler = (e) => {
    enterKey(e, onSubmit);
  };

  const onCancel = () => {
    window.location.href = isMobile ? '/mypage/user' : '/mypage/user/info';
  };

  const onSuccessModalCallback = () => {
    dispatch(authAction.logout());
  };

  return (
    <>
      <MetaTitle title="회원탈퇴" />
      <Layout>
        <Wrapper>
          <section className={s.title}>
            <div className={s.text}>회원 탈퇴</div>
          </section>

          <section className={s.content}>
            <div className={s.content_text}>
              정말 탈퇴하시겠습니까? <br></br>탈퇴 시 보유 적립금은 모두 삭제됩니다.
            </div>

            <label id="hi" className={s.labe_box}>
              <div className={s.label_text}>비밀번호 확인</div>
              <input
                className={s.input_box}
                type="password"
                value={pw || ''}
                onChange={onInputChangeHandler}
                onKeyDown={onKeyDownHandler}
              />
            </label>
          </section>
          <section className={s.btn}>
            <div className={s.btn_box}>
              <button className={s.btn_cancel} onClick={onCancel}>
                취소
              </button>
              <button className={s.btn_withdraw} onClick={onSubmit}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '탈퇴'}
              </button>
            </div>
          </section>
        </Wrapper>
      </Layout>
      <Modal_global_alert
        onClick={isSubmitted && onSuccessModalCallback}
        background
      />
    </>
  );
}




export async function getServerSideProps ({req}) {
  const url = '/api/members/sns/password'; // api이름: 비밀번호 설정해야하는 유저인지 확인
  const res = await getDataSSR(req, url);
  if(res.data){
    const needToSetPassword = res.data.needToSetPassword;
    if(needToSetPassword){
      return {
        redirect:{
          destination:'/mypage/user/setPassword',
          permanent: false,
        },
        props: {}
      }
    }
  }
  
  return {
    props: {}
  }
  
}