import React, { useState, useEffect } from "react";
import s from "./searchBar.module.scss";

const SearchSelect = ({
  title,
  name,
  id,
  onChange,
  searchValue,
  options = [],
  ...props
}) => {

  const initialValue = options[0].value;
  useEffect(() => {
    if (!searchValue) setSelectedValue(initialValue);
  }, [searchValue]);

  const [selectedValue, setSelectedValue] = useState(initialValue); // * SearchSelect 컴포넌트 내부 State. 다른 input에서는 사용하지 않음

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    setSelectedValue(value);
    if (onChange && typeof onChange === "function") {
      onChange((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };


  if (!options.length) return;

  return (
    <>
      <div className={s["search-row"]}>
        <h4 className={s["title"]}>{title}</h4>
        <div className={`${s["inp-wrap"]} ${s["term"]}`}>
          <select
            className="admin_select"
            name={name}
            id={id || name}
            onChange={onChangeHandler}
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
        </div>
      </div>
    </>
  );
};

export default SearchSelect;
