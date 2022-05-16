import React, { useState } from "react";



const SelectTag = ({ name, id, onChange, options = [], style, ...props }) => {
  const [selectedValue, setSelectedValue] = useState();
  if (!options.length) return;

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const val = thisSelect.value;
    setSelectedValue(val);
    if (onChange && typeof onChange === "function") onChange(val);
  };

  return (
    <>
      <select
        className="admin_select"
        name={name}
        id={id || name}
        onChange={onChangeHandler}
        style={style}
        value={selectedValue}
        {...props}
      >
        {options.map((option, i) => {
          return i === 0 ? (
            <option
              key={`${option.label}-${i}`}
              value={option.value}
              defaultValue
            >
              {option.label}
            </option>
          ) : (
            <option key={`${option}-${i}`} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>
    </>
  );
};

export default SelectTag;
