import React, { useState } from 'react';
import s from '/src/pages/account/findMyId/findMyAccount.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import { validate } from '/util/func/validation/validation_findMyAccount';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { putObjData } from '/src/pages/api/reqData';
import { userStateAction } from '/store/userState-slice';
import Spinner from '/src/components/atoms/Spinner';
import { FindMyAccountInputBox } from '../findMyId';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import MetaTitle from "../../../components/atoms/MetaTitle";

const initialFormValues = {
  // TEST ACCOUNT
  email: 'admin@gmail.com',
  name: '관리자',
  phoneNumber: '01056785678',
};

// const initialFormValues = {
//   email: null,
//   name: null,
//   phoneNumber: null,
// }

export default function FindMyPwPage() {
  const mct = useModalContext();
  const router = useRouter();
  const dispatch = useDispatch();
  const [form, setForm] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  
  const onInputChangeHandler = (event) => {
    const input = event.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;
    filteredValue = filter_emptyValue(value);
    if (filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }
    setForm((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const errObj = await validate(form);
    const isPassed = valid_hasFormErrors(errObj);
    if (isPassed) {
      mct.alertHide();
      setFormErrors({});
      setModalMessage('');
    } else {
      mct.alertShow();
      setModalMessage('유효하지 않은 항목이 있습니다.');
      setFormErrors(errObj);
      return;
    }

    try {
      setIsLoading((prevState) => ({
        ...prevState,
        submit: true,
      }));
      const body = {
        email: form.email,
        name: form.name,
        phoneNumber: form.phoneNumber,
      };
      const url = `/api/temporaryPassword`; // 임시 비밀번호 발급
      const res = await putObjData(url, body);
      if (res.isDone) {
        const success = res.data.data.responseCode === 200; // DirectSend(핸드폰 메시지 전송 API) 응답코드 (200 이외의 값이면 다이렉트센드 내부 에러);
        if (success) {
          dispatch(userStateAction.tempMyAccount({ data: body }));
        } else {
          mct.alertShow();
          setModalMessage('임시 비밀번호 발신 중, 문제가 발생하였습니다.\n지속적으로 문제가 발생할경우, 사이트 관리자에게 문의해주세요.');
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

  console.log(form)
  return (
    <>
      <MetaTitle title="비밀번호 찾기" />
      <Layout>
        <Wrapper>
          <div className={s.flex__container}>
            <header className={s.title}>
              <h2>비밀번호 찾기</h2>
            </header>
            <section className={s.input__field}>
              <FindMyAccountInputBox
                id={'email'}
                name="아이디"
                formErrors={formErrors}
                value={form}
                onChange={onInputChangeHandler}
                filterType={'string'}
              />
              <FindMyAccountInputBox
                id={'name'}
                name="이름"
                mode={'을'}
                formErrors={formErrors}
                value={form}
                onChange={onInputChangeHandler}
                filterType={''}
              />
              <FindMyAccountInputBox
                id={'phoneNumber'}
                name="휴대폰 번호"
                formErrors={formErrors}
                value={form}
                onChange={onInputChangeHandler}
                filterType={'number'}
              />
            </section>

            <section className={s.btn__group}>
              <button onClick={onSubmit} type={'button'} className={`${s.btn} ${s.id__search}`}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '임시비밀번호 받기'}
              </button>
            </section>
          </div>
        </Wrapper>
      </Layout>
      <Modal_global_alert message={modalMessage} onClick={onClickModalButton} />
    </>
  );
}
