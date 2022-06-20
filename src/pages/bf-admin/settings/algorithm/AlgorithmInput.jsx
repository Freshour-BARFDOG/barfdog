import React from 'react';
import s from './algorithm.module.scss';
import ErrorMessage from '/src/components/atoms/ErrorMessage';
import filter_emptyValue from '/util/func/filter_emptyValue';
import filter_onlyNumber from '/util/func/filter_onlyNumber';
import filter_numberZeoFromTheIntegerPartOfTheDecimal from '/util/func/filter_numberZeoFromTheIntegerPartOfTheDecimal';




const AlgorithmInput = ({
  label,
  name,
  level,
  numberUnit,
  formValues,
  setFormValues,
  formErrors,
}) => {

  const onInputChangeHandler = (e) => {
    const input = e.currentTarget;
    const { id, value } = input;
    const level = id.split('-')[1];
    const filteredType = input.dataset.inputType;
    let filteredValue = value;

    if (filteredType) {
      filteredValue = filter_emptyValue(value);
    }

    if (filteredType && filteredType.indexOf('number') >= 0) {
      filteredValue = filter_onlyNumber(filteredValue);
    }

    filteredValue = filter_numberZeoFromTheIntegerPartOfTheDecimal(filteredValue);

    setFormValues((prevState) => ({
      ...prevState,
      [name]: {
        ...prevState[name],
        [level]: filteredValue,
      },
    }));
  };
  return (
    <div className="cont_divider">
      <div className="input_row">
        <div className="title_section fixedHeight">
          <label className="title" htmlFor={`${name}-VERY_LITTLE`}>
            {label}
          </label>
        </div>
        <div className="inp_section">
          <div className={`inp_box`}>
            <input
              id={`${name}-${level}`}
              type="text"
              name={name}
              data-input-type={'number'}
              value={formValues[name][level] || ''}
              onChange={onInputChangeHandler}
            />
            <em className={s['numberUnit']}>{numberUnit}</em>
            <em className="unit">%</em>
            {formErrors.name && <ErrorMessage>{formErrors.name}</ErrorMessage>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlgorithmInput;
