import React, { useState } from 'react';
import s from '/src/pages/account/findMyId/findMyAccount.module.scss';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import { validate } from '/util/func/validation/validation_findMyAccount';
import { valid_hasFormErrors } from '/util/func/validation/validationPackage';
import { useModalContext } from '/store/modal-context';
import { useRouter } from 'next/router';
import Modal_global_alert from '/src/components/modal/Modal_global_alert';
import Spinner from '/src/components/atoms/Spinner';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import { getData } from '/src/pages/api/reqData';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import { useDispatch } from 'react-redux';
import { userStateAction } from '/store/userState-slice';
import MetaTitle from "../../../components/atoms/MetaTitle";



let initialFormValues = {
  name: null,
  phoneNumber: null,
};

initialFormValues = { // TEST ACCOUNT
  // name:'김회원',
  // phoneNumber:'01099038544',
  // name: '관리자',
  // phoneNumber: '01056785678',
}

export default function Mypage() {
  const mct = useModalContext();
  const hasAlert = mct.hasAlert;
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

      const url = `/api/email?name=${form.name}&phoneNumber=${form.phoneNumber}`;
      const res = await getData(url);
      if (res.status === 200) {
        // console.log(res);
        const findInfo = {
          email: res.data.email,
          provider: res.data.provider,
        };
        dispatch(userStateAction.tempMyAccount({ data: findInfo }));
        await router.push('/account/findMyId/result');
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

  return (
    <>
      <MetaTitle title="아이디 찾기" />
      <Layout>
        <Wrapper>
          <div className={s.flex__container}>
            <header className={s.title}>
              <h2>아이디 찾기</h2>
            </header>
            <section className={s.input__field}>
              <FindMyAccountInputBox
                id={'name'}
                name="이름"
                mode="을"
                formErrors={formErrors}
                value={form}
                onChange={onInputChangeHandler}
                filterType={'string'}
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
            <div className={s.btn__group}>
              <button onClick={onSubmit} type={'button'} className={`${s.btn} ${s.id__search}`}>
                {isLoading.submit ? <Spinner style={{ color: '#fff' }} /> : '아이디찾기'}
              </button>
            </div>
          </div>
        </Wrapper>
      </Layout>
      {hasAlert && <Modal_global_alert message={modalMessage} onClick={onClickModalButton} />}
      
    </>
  );
}

export function FindMyAccountInputBox({ id, name, mode, formErrors, value, onChange, filterType }) {
  return (
    <label className={s.input__box} htmlFor={id}>
      <h4 className={s.input__title}>{name}</h4>
      <input
        id={id}
        type="text"
        data-input-type={filterType}
        placeholder={`${name}${mode === '을' ? '을' : '를'} 입력해주세요.`}
        value={value[id] || ''}
        onChange={onChange}
      />
      {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
    </label>
  );
}
