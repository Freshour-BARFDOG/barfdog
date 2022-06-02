import React, {useEffect, useState} from "react";
import getElemIdx from "/util/func/getElemIdx";

const CustomSelect = ({name, id, onChange, options = [], ...props}) => {

  const initialValue = options[0].value;
  const [selectedValue, setSelectedValue] = useState(initialValue);

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    const options = Array.from(thisSelect.children);
    let selectedOptionIdx;
    options.map((option)=>{
      const thisOptionValue = option.value;
      if(value === thisOptionValue) {
        selectedOptionIdx = getElemIdx(option);
      }
    })
    setSelectedValue(value);
    if (onChange && typeof onChange === "function") {
      onChange((prevState) => ({
        ...prevState, [name]: {value, selectedIdx: selectedOptionIdx},
      }));
    }
  };


  if (!options.length) return;

  return (<>
    <select
      className="admin_select"
      name={name}
      id={id || name}
      onChange={onChangeHandler}
      value={selectedValue}
      {...props}
    >
      {options.map((option, i) => {
        return i === 0 ? (<option
          key={`${option.label}-${i}`}
          value={option.value}
          defaultValue
        >
          {option.label}
        </option>) : (<option key={`${option}-${i}`} value={option.value}>
          {option.label}
        </option>);
      })}
    </select>
  </>);
};

export default CustomSelect;
