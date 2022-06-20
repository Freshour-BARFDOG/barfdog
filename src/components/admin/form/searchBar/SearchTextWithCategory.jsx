import React, { useEffect, useRef, useState } from "react";
import s from "./searchBar.module.scss";


const SearchTextWithCategory = ({
  searchValue,
  setSearchValue,
  title,
  name,
  id,
  tooltip,
  className,
  options = [],
  searchButton,
}) => {
  // const optionalRef = useRef();

  const initialValue = options[0].value || '';
  const [selectedValue, setSelectedValue] = useState(initialValue);

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
      <div className={`${s["search-row"]} ${className}`}>
        <h4 className={s["title"]}>
          {title}
          {tooltip && <span className={s["tooltip-wrap"]}>{tooltip}</span>}
        </h4>
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
            value={searchValue[userInfoQuery] || ''}
          />
          {searchButton}
        </div>
      </div>
    </>
  );
};;

export default SearchTextWithCategory;
