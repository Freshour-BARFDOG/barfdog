import React, { useEffect, useRef, useState } from "react";
import s from "./searchBar.module.scss";


const SearchTextWithCategory = ({
  searchValue,
  setSearchValue,
  title,
  name,
  id,
  options = [],
}) => {
  // const optionalRef = useRef();

  const initialValue = options[0].value;
  const [selectedValue, setSelectedValue] = useState(initialValue); // * SearchSelect 컴포넌트 내부 State. 다른 input에서는 사용하지 않음

  const userInfoQuery = "query";

  useEffect(() => {
    if (!searchValue) {
      initializeOptionalButtons();
    }
  }, [searchValue]);

  const initializeOptionalButtons = () => {
    setSelectedValue(initialValue);
    setSearchValue((prevState) => ({
      ...prevState,
      [userInfoQuery]: '',
    }));
  };

  const onSelectChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    setSelectedValue(value);
    if (setSearchValue && typeof setSearchValue === "function") {
      setSearchValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const onTextChangeHandler = (e) => {
    const { value } = e.currentTarget;
    setSearchValue((prevState) => ({
      ...prevState,
      [userInfoQuery]: value,
    }));
  };

  if (!options.length) return;

  return (
    <>
      <div className={s["search-row"]}>
        <h4 className={s["title"]}>{title}</h4>
        <div className={`${s["inp-wrap"]} ${s["textWidhCategory"]}`}>
          <select
            className="admin_select"
            name={name}
            id={id || name}
            onChange={onSelectChangeHandler}
            value={selectedValue}
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
          <input
            type="text"
            onChange={onTextChangeHandler}
            value={searchValue[userInfoQuery]}
          />
        </div>
      </div>
    </>
  );
};;

export default SearchTextWithCategory;
