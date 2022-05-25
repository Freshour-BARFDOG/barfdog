import s from "./searchBar.module.scss";
import React, { useState, useEffect } from "react";





const SearchRadio = ({
  searchValue,
  setSearchValue,
  title,
  name,
  idList,
  labelList,
  tooltip
}) => {

  const initialValue = idList[0];
  const [selectedRadio, setSelectedRadio] = useState(initialValue); // * component 내부 value

  useEffect(() => {
    if(!searchValue){
      setSelectedRadio(initialValue);
    }
  }, [searchValue]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    setSearchValue((prevState) => ({
      ...prevState,
      [name]: id,
    }));
  };

  if (!idList.length || !idList) return;

  return (
    <>
      <div className={s["search-row"]}>
        <h4 className={s["title"]}>
          {title}
          {tooltip && <span className={s["tooltip-wrap"]}>{tooltip}</span>}
        </h4>
        <div className={`${s["inp-wrap"]} ${s["radio"]}`}>
          {idList.map((id, index) => {
            return (
              <label key={`radio-${name}-${index}`} htmlFor={id}>
                <input
                  id={id}
                  name={name}
                  type="radio"
                  value={id}
                  checked={selectedRadio === id} // * important
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

export default SearchRadio;
