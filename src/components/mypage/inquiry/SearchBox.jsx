import s from './searchBox.module.scss';
import React from 'react';
import { searchType } from '/store/TYPE/searchType';
import Search from '/public/img/inquiry_search.svg';

export const SearchBox = ({ value, onSearch, setValues, idMap, event }) => {
  const onChangeHandler = (e) => {
    const val = e.currentTarget.value;
    const key = e.currentTarget.id;
    setValues((prev) => ({
      ...prev,
      [key]: val,
    }));
    
  };

  return (
    <div className={s['search-box']}>
      <select id={idMap.category} onChange={onChangeHandler}>
        {searchType.CATEGORY.options.map((op, i) =>  <option key={`search-option-${i}`} value={op.value}>
          {op.label}
        </option>)}
      </select>
      <input
        id={idMap.title}
        type="text"
        placeholder="검색어를 입력해주세요"
        value={value[idMap.title] || ''}
        onChange={onChangeHandler}
        onKeyDown={event.onKeyDown}
      />
      <button
        type={'button'}
        onClick={onSearch}
        className={'custom_btn solid basic_m'}
      >
        <Search className={s.search_icon} />
        <span>
          검색
        </span>
      </button>
    </div>
  );
};
