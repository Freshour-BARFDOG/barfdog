import React, { useState, useEffect } from 'react';
import s from './searchBar.module.scss';

const SearchSelect = ({
  title,
  name,
  id,
  setSearchValue,
  searchValue,
  options = [],
  tooltip,
  ...props
}) => {

  const initialValue = options[0].value;
  const [selectedValue, setSelectedValue] = useState(initialValue);

  useEffect(() => {
    // initValue
    if (!searchValue[id]) setSelectedValue(initialValue);
    setSelectedValue(searchValue[id]);
  }, [searchValue[id]]);

  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    setSelectedValue(value);
    if (setSearchValue && typeof setSearchValue === 'function') {
      setSearchValue((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  if (!options.length) return;

  return (
    <>
      <div className={s['search-row']}>
        <h4 className={s['title']}>
          {title}
          {tooltip && <span className={s['tooltip-wrap']}>{tooltip}</span>}
        </h4>
        <div className={`${s['inp-wrap']} ${s['term']}`}>
          <select
            className="admin_select"
            name={name}
            id={id || name}
            onChange={onChangeHandler}
            value={selectedValue}
            {...props}
          >
            {options.map((option, i) => (
              <option key={`${option}-${i}`} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </>
  );
};

export default SearchSelect;
