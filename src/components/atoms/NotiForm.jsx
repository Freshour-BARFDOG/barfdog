import React, { useEffect, useState } from 'react';
import s from './notiForm.module.scss';
import InputRadio from './InputRadio';
import PureCheckbox from './PureCheckbox';
import { dogBreedType } from '/store/TYPE/dogBreedType.js';
import { dogSizeType } from '/store/TYPE/dogSizeType';
import { DogTypeCustomSelectWithCustomOptions } from '../survey/DogTypeCustomSelectWithCustomOptions';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import ErrorMessage from '/src/components/atoms/ErrorMessage';

function NotiForm({
  formValues,
  setFormValues,
  formErrors,
  onSubmit,
  required,
}) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 650);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const onInputChangeHandler = (e, filteredType) => {
    const { id, value } = e.currentTarget;
    let filteredValue = filter_emptyValue(value);

    if (filteredType === 'number') {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    setFormValues((prevState) => {
      return {
        ...prevState,
        [id]: filteredValue,
      };
    });
  };

  // console.log(formErrors.name);

  return (
    <div className={s.alarm_form}>
      <div className={s.user_info}>
        <div className={s.input_name}>
          <label htmlFor={'name'}>
            <span
              className={`${s['input_title']} ${required && s['required']}`}
            >
              이름
            </span>
          </label>
          <input
            required={true}
            id={'name'}
            className={`${s.input_underLine} ${s['focus-underline']}`}
            type="text"
            placeholder="이름을 입력해주세요"
            data-input-type={'string'}
            value={formValues.name || ''}
            onChange={onInputChangeHandler}
          />
          {formErrors.name && (
            <ErrorMessage className={`${s.msg}`}>
              {formErrors.name}
            </ErrorMessage>
          )}
          {/* {id === "name" && (!value || value === "") && errorMessage} */}
        </div>
        <div className={s.input_number}>
          <label htmlFor={'number'}>
            <span
              className={`${s['input_title']} ${required && s['required']}`}
            >
              휴대폰번호
            </span>
          </label>
          <input
            id={'number'}
            className={`${s.input_underLine} ${s['focus-underline']}`}
            type="text"
            filteredType="number"
            placeholder="‘-’ 제외하고 입력해주세요"
            required={true}
            data-input-type={'string'}
            value={formValues?.number || ''}
            onChange={(e) => onInputChangeHandler(e, 'number')}
          />
        </div>
      </div>

      <div className={s.dog_info}>
        <div className={s.input_title}>견종선택</div>
        <div className={s.dog_size}>
          <InputRadio
            formValueKey={'dogSizeType'}
            formValues={formValues}
            setFormValues={setFormValues}
            className={s.dog_choice}
            idList={[dogSizeType.SMALL, dogSizeType.MIDDLE, dogSizeType.LARGE]}
            labelList={['소형견', '중형견', '대형견']}
          />
        </div>
        <div className={s.dog_type}>
          <DogTypeCustomSelectWithCustomOptions
            id={'dogType'}
            options={dogBreedType.map((dogType) => ({
              label: dogType.label,
              value: dogType.value,
            }))}
            value={formValues}
            setFormValues={setFormValues}
            width={isMobile ? 300 : 430}
            viewerWidth={isMobile ? 300 : 430}
          />
        </div>
      </div>

      {/* <div>
        <input
          onChange={onInputChangeHandler}
          type="checkbox"
          id={'privacyPolicy'}
          checked={formValues.privacyPolicy}
          disabled={true}
          value={formValues}
          setFormValues={setFormValues}
        />
      </div> */}

      <div className={`${s['checkbox-wrap']} ${s['space-between']}`}>
        <PureCheckbox
          id={'privacyPolicy'}
          value={formValues.privacyPolicy}
          setValue={setFormValues}
          errorMessage={
            // formErrors[policy_KEYS[1].label] && (
            <ErrorMessage className={`${s.msg}`}>
              {/* {formErrors[policy_KEYS[1].label]} */}
            </ErrorMessage>
            // )
          }
        >
          <p className={s.title}>개인정보 수집 이용 동의 (필수)</p>
        </PureCheckbox>
      </div>

      <button type={'button'} className={s.alarm_btn} onClick={onSubmit}>
        출시 알림 신청
      </button>
    </div>
  );
}

export default NotiForm;
