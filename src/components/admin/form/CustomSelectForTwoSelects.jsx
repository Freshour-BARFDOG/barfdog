import React, { useEffect, useState } from 'react';
import getElemIdx from '/util/func/getElemIdx';

const CustomSelectForTwoSelects = ({ name, id, onChange, options = [], value, style, ...props }) => {
  // const initialValue = options[0].value || '';
  const [selectedValue, setSelectedValue] = useState('');
  
  useEffect( () => {
    setSelectedValue(value);
  }, [value] );
  

  const onChangeHandler = (e) => {
    const select = e.currentTarget;
    const value = select.value;
    const options = Array.from(select.children);
    let selectedOptionIdx;
    options.map((option) => {
      const thisOptionValue = option.value;
      if (value === thisOptionValue) {
        selectedOptionIdx = getElemIdx(option);
      }
    });
    setSelectedValue(value);
    if (onChange && typeof onChange === 'function') {
      onChange((prevState) => ({
        ...prevState,
        [name]: { value, selectedIdx: selectedOptionIdx },
      }));
    }
  };

  if (!options.length) return;

  return (
    <>
      <select
        className="admin_select"
        name={name}
        id={id || name}
        onChange={onChangeHandler}
        value={selectedValue}
        style={style}
        {...props}
      >
        {options.map((option, i) => (
          <option key={`${option}-${i}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
};

export default CustomSelectForTwoSelects;

/*        {options.map((option, i) => {
          return i === 0 ? (
            <option key={`${option.label}-${i}`} value={option.value} defaultValue>
              {option.label}
            </option>
          ) : (
            <option key={`${option}-${i}`} value={option.value}>
              {option.label}
            </option>
          );
        })}
* 
* */
