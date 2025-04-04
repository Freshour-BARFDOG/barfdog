import React, { useState } from 'react';

const SelectTag = ({ name, id, onChange, options = [], initialValue, style, ...props }) => {

  if (!options.length) return;

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const val = thisSelect.value;
    const thisId = thisSelect.id;
    if (onChange && typeof onChange === 'function') onChange(val, thisId);
  };

  return (
    <>
      <select
        className="admin_select"
        name={name}
        id={id || name}
        onChange={onChangeHandler}
        style={style}
        value={initialValue || ''} /* IMPORTANT: to set Initial Value */
        {...props}
      >
        {options.map((option, i) => {
          return (
            <option
              key={`${option}-${i}`}
              value={option.value}
            >
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default SelectTag;
