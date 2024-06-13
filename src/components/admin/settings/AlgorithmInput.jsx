import React from 'react';
import s from './adminSettings.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_extraIntegerNumberZero from '/util/func/filter_extraIntegerNumberZero';

const AlgorithmInput = ({
  isStatus,
  id,
  label,
  numberUnit,
  formValues,
  setFormValues,
  formErrors,
}) => {
  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    filteredValue = filter_extraIntegerNumberZero(filteredValue, numberUnit);

    setFormValues((prevState) => ({
      ...prevState,
      [id]: filteredValue,
    }));
  };
  return (
    <div className="cont_divider">
      <div className="input_row">
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={`${id}`}>
            {label}
          </label>
        </div>
        <div className="inp_section">
          <div className={`inp_box`}>
            <input
              id={`${id}`}
              type="text"
              data-input-type={'number'}
              value={formValues[id] === 0 ? '0' : formValues[id] || ''}
              onChange={onInputChangeHandler}
            />
            <input
              id={`${id}`}
              type="hidden"
              data-input-type={'number'}
              value={formValues[id] === 0 ? '0' : formValues[id] || ''}
              onChange={onInputChangeHandler}
            />
            {/*<em className={s['numberUnit']}>{numberUnit}</em>*/}
            <em className="unit">{isStatus ? '' : '%'}</em>
            {formErrors[id] && <ErrorMessage>{formErrors[id]}</ErrorMessage>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInput;
