import React, { useEffect, useState } from 'react';
import s from '/src/pages/survey/survey.module.scss';
import { dogInedibleFoodType } from '../../../store/TYPE/dogInedibleFoodType';
import { dogCautionType } from '../../../store/TYPE/dogCautionType';

const InputRadio = ({
  formValueKey,
  formValues,
  setFormValues,
  name,
  idList,
  labelList,
  className,
  desc,
  defaultStyle,
  dataType = 'string',
}) => {
  // 최초 값
  let initialSelectedRadio = `${formValueKey}-${formValues[formValueKey]}`;
  if (formValueKey === 'caution') {
    // 설문조사 수정하기 > 있어요항목 UI > checked표시를 위함
    const val = formValues[formValueKey];
    if (val !== dogCautionType.NONE) {
      initialSelectedRadio = `${formValueKey}-`;
    }
  }

  const [selectedRadio, setSelectedRadio] = useState(initialSelectedRadio); // * component 내부 value

  // console.log()
  useEffect(() => {
    // '기타' input의 입력값(value)와 연계한 UI의 변화
    // => input value에 SurveyInputRadio의 idList 중의 id를 입력했을 경우, 해당 id에 checked 표기하기 위함.
    // ex. 기타 특이사항 (질병) 등이 있어요 => 기타란에 'NONE'입력했을 경우 => '없어요 SurveyInputRadio'가 선택된다.
    idList.forEach((id) => {
      if (formValues[formValueKey] === id) {
        // // console.log('formValues[formValueKey]',formValues[formValueKey],'& id:', id)
        setSelectedRadio(`${formValueKey}-${id}`); // 목적지고
      }
    });
  }, [formValues[formValueKey]]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
    if (id.indexOf(formValueKey) < 0)
      return console.error('formValueKey를 입력해주세요.');
    const separator = '-';
    let val = id.split(separator)[1];

    if (dataType === 'number') {
      val = Number(val);
    }

    setFormValues((prevState) => ({
      ...prevState,
      [formValueKey]: val,
    }));
  };

  return (
    <>
      <ul className={`${className} ${s['inputRadio-wrap']}`}>
        {idList.map((id, index) => {
          return (
            <li key={`radio-${name}-${index}`}>
              {defaultStyle ? (
                <label>
                  <input
                    id={`${formValueKey}-${id}`}
                    type="radio"
                    checked={selectedRadio === `${formValueKey}-${id}`} // * important
                    onChange={onChangeHandler}
                  />
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              ) : (
                <label
                  key={`radio-${formValueKey}-${index}`}
                  htmlFor={`${formValueKey}-${id}`}
                  className={`${s.inputRadio} ${
                    selectedRadio === formValueKey + '-' + id && s.checked
                  }`}
                >
                  <input
                    id={`${formValueKey}-${id}`}
                    type="radio"
                    className="hide"
                    checked={selectedRadio === `${formValueKey}-${id}`} // * important
                    onChange={onChangeHandler}
                  />
                  {labelList[index]}
                  {desc && desc.length && (
                    <span className={s.desc}>{desc[index]}</span>
                  )}
                </label>
              )}
            </li>
          );
        })}
      </ul>
    </>
  );
};

export default InputRadio;
