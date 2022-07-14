import React from 'react';

const CustomSelect = ({ id,value,  setFormValues, options = [], style, ...props }) => {


  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    if (!setFormValues || typeof setFormValues !== 'function') {
      return console.error('ERROR: need setFormValues props type of function');
    }

    setFormValues((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  if (!options.length) return;

  return (
    <>
      <select
        className={`s.admin_select`}
        id={id}
        onChange={onChangeHandler}
        value={value || ''} /* IMPORTANT: to set Initial Value */
        style={style}
        {...props}
      >
        {options.map((option, i) => {
          return (
            <option key={`${option}-${i}`} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default CustomSelect;
