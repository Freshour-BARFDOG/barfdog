import React from "react";
import s from "./searchBar.module.scss";



function SearchPlainInput({ title, name, onChange, searchValue }) {
  const onChangeHandler = (e) => {
    const thisSelect = e.currentTarget;
    const value = thisSelect.value;
    if (onChange && typeof onChange === "function") {
      onChange((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <div className={s["search-row"]}>
      <h4 className={s["title"]}>{title}</h4>
      <div className={`${s["inp-wrap"]} ${s["plainText"]}`}>
        <input type="text" value={searchValue && searchValue[name]} onChange={onChangeHandler}/>
      </div>
    </div>
  );
}

export default SearchPlainInput