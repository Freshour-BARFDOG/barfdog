import React, {useEffect, useState} from "react";
import s from "./customRadio.module.scss";


const CustomRadio = ({
                       setValue,
                       name,
                       idList,
                       labelList,
                     }) => {


  const initialValue = idList[0];
  const [selectedRadio, setSelectedRadio] = useState(initialValue);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);

    setValue((prevState) => ({
      ...prevState,
      [name]: id,
    }));
  };

  if (!idList.length || !idList) return;

  return (
    <>
        <div className={`${s["inp-wrap"]} ${s["radio"]}`}>
          {idList.map((id, index) => {
            return (
              <label key={`radio-${name}-${index}`} htmlFor={id}>
                <input
                  id={id}
                  name={name}
                  type="radio"
                  // value={id}
                  checked={selectedRadio === id} // _ important
                  onChange={onChangeHandler}
                />
                {labelList[index]}
              </label>
            );
          })}
        </div>
    </>
  );
};

export default CustomRadio;
