import React, {useEffect, useState} from 'react';
import s from "/src/pages/account/signup/signup.module.scss";
import PureCheckbox from "/src/components/atoms/PureCheckbox";
import {IoChevronForwardOutline} from "react-icons/io5";
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import {plugin} from "next/dist/build/webpack/config/helpers";
import {deleteCookie, getCookie, setCookie} from "@util/func/cookie";



export const policy_KEYS = [
  { label: 'servicePolicy', required: true },
  { label: 'privacyPolicy', required: true },
  { label: 'thirdPolicy', required: true },
  { label: 'receiveSms', required: false },
  { label: 'receiveEmail', required: false },
  { label: 'over14YearsOld', required: true },
];


const initialPolicyValues = {
  [policy_KEYS[0].label]: false,
  [policy_KEYS[1].label]: false,
  [policy_KEYS[2].label]: false,
  [policy_KEYS[3].label]: false,
  [policy_KEYS[4].label]: false,
  [policy_KEYS[5].label]: false,
  _selectAllInReceiveChannel: false,
  _selectAllPolicies: false,
};




function SignupPolicyList(props) {

  const {setFormValues, formErrors, setModalState, inputrefs} = props;
  const [policyValues, setPolicyValues] = useState(initialPolicyValues);

  const visibility = props.setCokbank;
  
  useEffect(() => {

    const tempObj = initialPolicyValues;
    tempObj.thirdPolicy = false;

    setPolicyValues(tempObj);
    
    // console.log(visibility)
    policy_KEYS[2].required = visibility;

  }, [visibility]);

  
  useEffect(() => {
    let filteredPolicyValues;
    for (const key in policyValues) {
      const val = policyValues[key];
      if(key.indexOf('_') < 0){
        filteredPolicyValues = {
          ...filteredPolicyValues,
          [key]: val
        }
      }
    }

    setFormValues(prevState=>({
      ...prevState,
      agreement: {
        ...filteredPolicyValues
      }
    }))

  }, [policyValues, setFormValues]);




  // MEMO: 기능 > 무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)
  useEffect(() => {
    const triggerCheckbox1 = 'receiveSms';
    const triggerCheckbox2 = 'receiveEmail';
    const targetKey = '_selectAllInReceiveChannel';
    setPolicyValues(prevState=> {
      let counter = 0;
      const allCheckedCounter = 2;
      for (const prevStateKey in prevState) {
        const val = prevState[prevStateKey];
        if(prevStateKey === triggerCheckbox1 || prevStateKey === triggerCheckbox2){
          val && counter++;
        }
      }
      return {
        ...prevState,
        [targetKey]: counter === allCheckedCounter
      }
    })
  }, [policyValues.receiveSms, policyValues.receiveEmail]);




  useEffect(() => {
    setPolicyValues((prevState) => {
      const targetKey = '_selectAllPolicies';
      let isAllCheckboxChecked = true;

      const keys = Object.keys(prevState);
      keys.forEach((key, index) => {

        if(!visibility && index === 2) return;

        const realCheckBox = policy_KEYS[index]?.label?.indexOf(key) >= 0;
        const val = prevState[key];
        if (realCheckBox && !val) {
          return (isAllCheckboxChecked = false);
        }
      });
      return {
        ...prevState,
        [targetKey]: isAllCheckboxChecked,
      };
    });
  }, [
    policyValues.privacyPolicy,
    policyValues.servicePolicy,
    policyValues.thirdPolicy,
    policyValues.receiveSms,
    policyValues.receiveEmail,
    policyValues.over14YearsOld,
  ]);




  const onSelectAllRecieveChannel = (checked) => {
    const targetValue1 = 'receiveSms';
    const targetValue2 = 'receiveEmail';
    setPolicyValues((prevState) => {
      return {
        ...prevState,
        [targetValue1]: checked,
        [targetValue2]: checked,
      };
    });
  };

  const onSelectAllPolicies = (checked) => {
    setPolicyValues((prevState) => {
      let tempObj = {};
      for (const prevStateKey in prevState) {
        tempObj[prevStateKey] = checked;
      }
      if(!visibility) tempObj.thirdPolicy = false;
      setPolicyValues(tempObj);

      return tempObj;
    });
  };


  const onModalShow = (e)=>{
    const modalSort = e.currentTarget.dataset.modalSort;
    // // console.log(modalSort);
    setModalState(prevState => ({
      [modalSort]: true
    }))
  }


  return (
    <>
      <div className={`${s['checkbox-wrap']} ${s['select-all']}`}>
        <PureCheckbox
          id={'agree-all'}
          className={s['agree-all']}
          value={policyValues._selectAllPolicies}
          eventHandler={onSelectAllPolicies}
        >
          <div className={s['desc-section']}>
            <p className={s['title']}>전체 동의합니다.</p>
            <p className={s['desc']}>
              선택항목에 동의하지 않은 경우도 회원가입 및 일반적인 서비스를 이용할 수 있습니다.
            </p>
          </div>
        </PureCheckbox>
      </div>

      <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
        <PureCheckbox
          id={policy_KEYS[0].label}
          value={policyValues.servicePolicy}
          setValue={setPolicyValues}
          errorMessage={
            formErrors[policy_KEYS[0].label] && (
              <ErrorMessage className={`${s.msg}`}>{formErrors[policy_KEYS[0].label]}</ErrorMessage>
            )
          }
        >
          <p className={s['title']} >이용약관 동의 (필수)</p>
        </PureCheckbox>
        <button className={s.terms__view} onClick={onModalShow} data-modal-sort={'termsOfService'}>
          약관보기
          <IoChevronForwardOutline />
        </button>
      </div>

      {/* 개인정보 수집 이용동의  */}
      <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
        <PureCheckbox
          id={policy_KEYS[1].label}
          value={policyValues.privacyPolicy}
          setValue={setPolicyValues}
          errorMessage={
            formErrors[policy_KEYS[1].label] && (
              <ErrorMessage className={`${s.msg}`}>{formErrors[policy_KEYS[1].label]}</ErrorMessage>
            )
          }
        >
          <p className={s.title}>개인정보 수집 이용 동의 (필수)</p>
        </PureCheckbox>
        <button className={s.terms__view} onClick={onModalShow} data-modal-sort={'privacy'}>
          약관보기
          <IoChevronForwardOutline />
        </button>
      </div>

      {/* 콕뱅크 제3자 수집 이용동의  */}
      {visibility && (

        <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
          <PureCheckbox
            id={policy_KEYS[2].label}
            value={policyValues.thirdPolicy}
            setValue={setPolicyValues}
            errorMessage={
              formErrors[policy_KEYS[2].label] && (
                <ErrorMessage className={`${s.msg}`}>{formErrors[policy_KEYS[2].label]}</ErrorMessage>
              )
            }
          >
            <p className={s.title}>개인정보 제3자 제공 동의 (필수)</p>
          </PureCheckbox>
          <button className={s.terms__view} onClick={onModalShow} data-modal-sort={'termsOfThird'}>
            약관보기
            <IoChevronForwardOutline />
          </button>
        </div>

      )}

      {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
      <div className={`${s['checkbox-wrap']} ${s['receive-event']}`}>
        <PureCheckbox
          id={'agree-event-channel-all'}
          value={policyValues._selectAllInReceiveChannel}
          eventHandler={onSelectAllRecieveChannel}
        >
          <p className="">무료배송, 할인쿠폰 등 혜택/정보 수신 동의 (선택)</p>
        </PureCheckbox>
        <div className={s['select-channel']}>
          <div className={s['flex-wrap']}>
            <PureCheckbox
              id={policy_KEYS[3].label}
              value={policyValues.receiveSms}
              setValue={setPolicyValues}
            >
              <p>SMS</p>
            </PureCheckbox>
            <PureCheckbox
              id={policy_KEYS[4].label}
              value={policyValues.receiveEmail}
              setValue={setPolicyValues}
            >
              <p>이메일</p>
            </PureCheckbox>
          </div>
          <p className={s.guidetext}>
            <i className={s.icon} />
            모두 동의 시 적립금 1,000원 적립 (첫 주문 후 적용)
          </p>
        </div>
      </div>
      <div className={s['checkbox-wrap']}>
        <PureCheckbox
          id={policy_KEYS[5].label}
          value={policyValues.over14YearsOld}
          setValue={setPolicyValues}
          errorMessage={
            formErrors[policy_KEYS[5].label] && (
              <ErrorMessage className={`${s.msg}`}>{formErrors[policy_KEYS[5].label]}</ErrorMessage>
            )
          }
        >
          <div>본인은 만 14세 이상입니다. (필수)</div>
        </PureCheckbox>
      </div>
    </>
  );
}

export default SignupPolicyList;