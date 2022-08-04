import React, {useEffect, useState} from 'react';
import s from "/src/pages/account/signup/signup.module.scss";
import PureCheckbox from "/src/components/atoms/PureCheckbox";



export const policy_KEYS = [
  { label: 'receiveSms', required: false },
  { label: 'receiveEmail', required: false },
];





export default function EditUserInfoPolicyList({formValues, setFormValues}) {
  
  
  const initialPolicyValues = {
    [policy_KEYS[0].label]: formValues.agreement.receiveSms,
    [policy_KEYS[1].label]: formValues.agreement.receiveEmail,
    _selectAllInReceiveChannel: false,
  };
  
  
  const [policyValues, setPolicyValues] = useState(initialPolicyValues);

  
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


  return (
    <>
      {/* 무료배송, 할인쿠폰 등 혜택 / 정보 수신 동의 */}
      <div className={s['join__wrap']}>
        <h4 className={s['input-title-wrap']}>
          선택약관 동의
        </h4>
        <div className={`${s['checkbox-wrap']} ${s['input-wrap']}`}>
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
                id={policy_KEYS[0].label}
                value={policyValues.receiveSms}
                setValue={setPolicyValues}
              >
                <p>SMS</p>
              </PureCheckbox>
              <PureCheckbox
                id={policy_KEYS[1].label}
                value={policyValues.receiveEmail}
                setValue={setPolicyValues}
              >
                <p>이메일</p>
              </PureCheckbox>
            </div>
            <p className={`${s.guidetext} ${s.inMypage}`}>
              <i className={s.icon} />
              모두 동의 시 적립금 1,000원 적립 (첫 주문 후 적용)
            </p>
          </div>
        </div>
      </div>
      
      
    </>
  );
}
