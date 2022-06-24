import React, { useState } from 'react';

const SelectTag = ({ name, id, onChange, options = [], initialValue, style, ...props }) => {
  const [selectedValue, setSelectedValue] = useState(initialValue);
  if (!options.length) return;

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const val = thisSelect.value;
    setSelectedValue(val);
    if (onChange && typeof onChange === 'function') onChange(val);
  };
  console.log(selectedValue)


  return (
    <>
      <select
        className="admin_select"
        name={name}
        id={id || name}
        onChange={onChangeHandler}
        style={style}
        value={initialValue} /* to Set Initial Value*/
        {...props}
      >
        {options.map((option, i) => {
          return (
            <option
              key={`${option}-${i}`}
              value={option.value}
              // selected={initialValue === option.value}
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
