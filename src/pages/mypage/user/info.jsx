import React, { useState } from 'react';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import MypageWrapper from '/src/components/mypage/MypageWrapper';
import MetaTitle from '/src/components/atoms/MetaTitle';
import s from './info.module.scss';
import SignInputList from '/src/components/user_signup/EditUserInfoInputList';
import { useModalContext } from '/store/modal-context';
import { useSelector } from 'react-redux';
import EditUserInfoPolicyList from '/src/components/user_signup/EditUserInfoPolicyList';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import { validate } from '/util/func/validation/validation_editUserInfo';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import {getDataSSR, putObjData} from '/src/pages/api/reqData';
import Spinner from '/src/components/atoms/Spinner';
import { useRouter } from 'next/router';

export default function UserInfoPage() {
  const mct = useModalContext();
  const router = useRouter();
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;

  const initialFormValues = {
    name: userInfo.name,
    email: userInfo.email,
    password: null,
    phoneNumber: userInfo.phoneNumber,
    address: {
      zipcode: userInfo.address.zipcode,
      street: userInfo.address.street,
      city: userInfo.address.city,
      detailAddress: userInfo.address.detailAddress,
    },
    birthday: userInfo.birthday,
    gender: userInfo.gender,
    agreement: {
      receiveSms: userInfo.receiveSms,
      receiveEmail: userInfo.receiveEmail,
    },
    provider: userInfo.provider || null,
    providerId: userInfo.providerId || null,
  };

  // console.log('userState: ',userState)
  // console.log('initialFormValues: ',initialFormValues)
  const [alertModalMessage, setAlertModalMessage] = useState('');
  const [form, setForm] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
   
    if (isSubmitted) return console.error('이미 제출된 양식입니다.');
    const errObj = validate(form, formErrors);
    setFormErrors(errObj);
    const isPassed = valid_hasFormErrors(errObj);
    console.log(form);
    if (!isPassed) {
      mct.alertShow();
      setAlertModalMessage('유효하지 않은 항목이 있습니다.');
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        name: form.name,
        password: form.password,
        phoneNumber: form.phoneNumber,
        address: {
          zipcode: form.address.zipcode,
          city: form.address.city,
          street: form.address.street,
          detailAddress: form.address.detailAddress,
        },
        birthday: form.birthday,
        gender: form.gender,
        receiveSms: form.agreement.receiveSms,
        receiveEmail: form.agreement.receiveEmail,
      };
      // console.log(body);
      const url = '/api/members';
      const res = await putObjData(url, body);
      // console.log(res);
      if (res.isDone) {
        mct.alertShow();
        setIsSubmitted(true);
        setAlertModalMessage('회원정보가 정상적으로 변경되었습니다.');
      } else if (res.status === 400) {
        mct.alertShow();
        const errorMessage = `현재 비밀번호가 올바르지 않습니다.`;
        setAlertModalMessage(errorMessage);
        setFormErrors({
          password: errorMessage,
        });
      }
    } catch (err) {
      console.error('통신에러: ', err);
      setAlertModalMessage(`데이터 처리 중 오류가 발생했습니다.\n${err}`);
    }
    setIsLoading((prevState) => ({
      ...prevState,
      submit: false,
    }));
  };

  const onModalConfirmButtonClick = () => {
    window.location.reload();
  };

  const onClickWithdrawalButton = () => {
    if (confirm('회원탈퇴 페이지로 이동하시겠습니까?')) {
      window.location.href = '/mypage/user/withdrawal';
    }
  };

  return (
    <>
      <MetaTitle title="마이페이지 회원정보변경" />
      <Layout>
        <Wrapper>
          <MypageWrapper>
            <section className={s.title}>
              <h1>회원 정보 변경</h1>
            </section>
            <section className={s.userContent}>
              <SignInputList
                formValues={form}
                setFormValues={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
              <em className={s.divider} />
              <EditUserInfoPolicyList
                formValues={form}
                setFormValues={setForm}
                formErrors={formErrors}
                setFormErrors={setFormErrors}
              />
            </section>
            <section className={s.btn_section}>
              <div className={s.btn_box}>
                <button type={'button'} className={s.left_box} onClick={onClickWithdrawalButton}>
                  회원 탈퇴
                </button>
                <button
                  type={'button'}
                  className={s.right_box}
                  onClick={onSubmit}
                  disabled={isSubmitted}
                >
                  {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '저장'}
                </button>
              </div>
            </section>
          </MypageWrapper>
        </Wrapper>
      </Layout>
      <Modal_global_alert
        message={alertModalMessage}
        onClick={isSubmitted && onModalConfirmButtonClick}
      />
    </>
  );
}


export async function getServerSideProps ({req}) {
  // 간편로그인 sns로 회원가입한 유저일 경우 => 비밀번호 설정해야하는 유저인지 확인 => 비밀번호 미설정 시, 마이페이지 > 계정정보 수정페이지 접근불가 (sns 간편로그인 정책으로 인하여, 회원가입단계에서 비밀번호 설정불가함으로 인함)
  /*
  - 비밀번호 설정해야하는 유저일 경우, 결과값: true → 회원정보 수정하기 전, sns 유저 비밀번호 설정 api로 이동
  - 비밀번호 설정하지 않아도 될 유저일 경우 경우, 결과값: false → 회원정보 수정하기 api로 이동
  * */
  const url = '/api/members/sns/password'; // api이름: 비밀번호 설정해야하는 유저인지 확인
  const res = await getDataSSR(req, url);
  if(res.data){
    const needToSetPassword = res.data.needToSetPassword;
    // console.log('needToSetPassword: ',needToSetPassword);
    // if(!needToSetPassword){ // ! TEST
    if(needToSetPassword){ // ! PROD
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