import React from 'react';
import s from './searchBar.module.scss'



function SearchBar({ children, onReset, onSearch }) {
  
  const onSearchHandler = () => {
    onSearch();
  }
  const onResetHandler = () => {
    onReset();
  }
  return (
    <div id={s["searchBar"]}>
      <div className={s["search-section"]}>{children}</div>
      <div className={s["btn-section"]}>
        <button className="admin_btn solid confirm_m" onClick={onSearchHandler}>
          검색
        </button>
        <button className="admin_btn line confirm_m" onClick={onResetHandler}>
          초기화
        </button>
      </div>
    </div>
  );
}

export default SearchBar;