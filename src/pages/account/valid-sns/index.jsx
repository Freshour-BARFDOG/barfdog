import React, { useState } from 'react';
import MetaTitle from '/src/components/atoms/MetaTitle';
import Layout from '/src/components/common/Layout';
import Wrapper from '/src/components/common/Wrapper';
import s from 'src/pages/account/valid-sns/index.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';

function ValidSnsPage() {
  const [formValues, setFormValues] = useState({});
  const [formErrors, setFormErrors] = useState({});

  console.log(formValues);
  const onChangeHandler = (e) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);
    filteredValue = filter_onlyNumber(filteredValue);
    setFormValues((prevState) => {
      return {
        ...prevState,
        [id]: filteredValue,
      };
    });
  };

  const onSubmitHandler = () => {
    console.log('비밀번호 조회 후, 일치하지 않을 경우 error메시지 ');
  };

  return (
    <>
      <MetaTitle title="SNS계정 연동확인" />
      <Layout>
        <Wrapper>
          <div className={s.box}>
            <p className={s.text}>
              고객님은 기존에 가입된 회원입니다.
              <br />
              기존 계정의 비밀번호 입력 후 연동이 완료됩니다.
            </p>
            <div className={s.container}>
              <div className={s['input-wrap']}>
                <input
                  type={'password'}
                  id={'password'}
                  name={'password'}
                  placeholder={'비밀번호를 입력해주세요.'}
                  onChange={onChangeHandler}
                  value={formValues.password || ''}
                />
                {formErrors.password && <ErrorMessage>{formErrors.password}</ErrorMessage>}
              </div>
              <button  type={'button'} className={s.btn} onClick={onSubmitHandler}>
                연동하기
              </button>
            </div>

          </div>
        </Wrapper>
      </Layout>
    </>
  );
}

export default ValidSnsPage;
