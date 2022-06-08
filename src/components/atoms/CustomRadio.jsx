import React, {useEffect, useState} from "react";
import s from "./customRadio.module.scss";


const CustomRadio = ({
                       setValue,
                       name,
                       labelList,
                       className
                     }) => {

  const initialValue = labelList[2].value;
  const [selectedRadio, setSelectedRadio] = useState(initialValue);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    setValue((prevState) => ({
      ...prevState,
      [name]: id,
    }));
  };

  if (!labelList.length || !labelList) return;

  return (
    <>
        <div className={`${s["inp-wrap"]} ${s["radio"]} ${className || ''}`}>
          {labelList.map((list, index) => {
            return (
              <label key={`radio-${name}-${index}`} htmlFor={list.value}>
                <input
                  id={list.value}
                  name={name}
                  type="radio"
                  value={list.value}
                  checked={selectedRadio === list.value} // _ important
                  onChange={onChangeHandler}
                />
                {list.label}
              </label>
            );
          })}
        </div>
    </>
  );
};

export default CustomRadio;
