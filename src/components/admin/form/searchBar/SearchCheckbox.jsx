import { Tooltip } from 'antd';
import s from './searchBar.module.scss';
import React, { useState, useEffect } from 'react';

const SearchCheckbox = ({
  searchValue,
  setSearchValue,
  title,
  name,
  idList,
  labelList,
  selectedCheckboxes,
  setSelectedCheckboxes,
  value,
}) => {
  // const initialValue = value || idList;

  // useEffect(() => {
  //   // 초기화
  //   setSelectedCheckboxes(initialValue);
  // }, [initialValue]);

  const onChangeHandler = (e) => {
    const { id, checked } = e.currentTarget;

    setSelectedCheckboxes((prevSelected) => {
      if (checked) {
        return [...prevSelected, id];
      } else {
        return prevSelected.filter((selectedId) => selectedId !== id);
      }
    });

    setSearchValue((prevState) => ({
      ...prevState,
      [name]: checked
        ? [...selectedCheckboxes, id]
        : selectedCheckboxes.filter((selectedId) => selectedId !== id),
    }));
  };

  if (!idList.length || !idList) return;

  // console.log('selectedCheckboxes', selectedCheckboxes);

  return (
    <>
      <div className={s['search-row']}>
        <h4 className={s['title']}>{title}</h4>
        <div className={`${s['inp-wrap']} ${s['checkbox']}`}>
          {idList.map((id, index) => {
            return (
              <label key={`radio-${name}-${index}`} htmlFor={id}>
                <input
                  id={id}
                  name={name}
                  type="checkbox"
                  value={id}
                  checked={selectedCheckboxes.includes(id)}
                  onChange={onChangeHandler}
                />
                {labelList[index]}
              </label>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default SearchCheckbox;
