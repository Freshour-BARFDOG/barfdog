import s from './searchBox.module.scss';
import React from 'react';
import { searchType } from '/store/TYPE/searchType';

export const SearchBox = ({ value, setValue, onSearch }) => {
  const onChangeHandler = (e) => {
    const val = e.currentTarget.value;
    const key = e.currentTarget.id;
    setValue((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  return (
    <div className={s['search-box']}>
      <select id={searchType.CATEGORY.NAME} onChange={onChangeHandler}>
        {searchType.CATEGORY.options.map((op, i) =>
          (value && value[searchType.CATEGORY.NAME] === op.value) ? (
            <option key={`search-option-${i}`} value={op.title} selected>
              {op.label}
            </option>
          ) : (
            <option key={`search-option-${i}`} value={op.title}>
              {op.label}
            </option>
          ),
        )}
      </select>
      <input
        id={searchType.KEYWORD.NAME}
        type="text"
        placeholder="검색어를 입력해주세요"
        value={value[searchType.KEYWORD.NAME] || ''}
        onChange={onChangeHandler}
      />
      <button
        type={'button'}
        onClick={onSearch}
        className={'custom_btn solid basic_m'}
      >
        검색
      </button>
    </div>
  );
};
