import React from 'react';

const CustomSelect = ({
  id,
  value,
  setFormValues,
  options = [],
  dataType = 'string',
  className,
  style,
  ...props
}) => {
  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    let value = thisSelect.value;
    if (!setFormValues || typeof setFormValues !== 'function') {
      return console.error('ERROR: need setFormValues props type of function');
    }
    if (dataType.indexOf('number') >= 0) {
      value = Number(value);
    }

    if (id) {
      setFormValues((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    } else {
      setFormValues(value);
    }
  };

  if (!options.length) return;

  return (
    <>
      <select
        className={`custom_select ${className}`}
        id={id}
        onChange={onChangeHandler}
        value={value || ''} /* IMPORTANT: to set Initial Value */
        style={style}
        {...props}
      >
        {options.map((option, i) => {
          // - option.inStock === undefined => inStock 항목이 존재하지 않을 경우, disabled 항목을 활성화 시키지 않음.
          return (
            <option
              key={`${option}-${i}`}
              value={option.value}
              disabled={option.inStock === undefined ? false : !option.inStock}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default CustomSelect;
