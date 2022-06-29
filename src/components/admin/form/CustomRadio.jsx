import React, {useEffect, useState} from 'react';
import s from './customRadio.module.scss';

const CustomRadio = ({
  setValue,
  value,
  name,
  idList,
  labelList,
  initIndex,
}) => {


  const initialValue = value || idList[initIndex || 0] ;
  const [selectedRadio, setSelectedRadio] = useState(initialValue);

  useEffect(() => {
    setSelectedRadio(initialValue);
  }, [initialValue]);

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    const isNameIncluded = id.indexOf(name) >= 0
    const filteredId = isNameIncluded ? id.replace(name,'') : id;
    setSelectedRadio(filteredId);
    if (setValue && typeof setValue === 'function') {
      setValue((prevState) => ({
        ...prevState,
        [name]: filteredId,
      }));
    }

  };

  if (!idList.length || !idList) return;

  return (
    <>
      <div className={`${s['inp-wrap']} ${s['radio']}`}>
        {idList.map((id, index) => {
          const convertedId = `${name}${id}`;
          return (
            <label key={convertedId} htmlFor={convertedId}>
              <input
                id={convertedId}
                name={name}
                type="radio"
                onChange={onChangeHandler}
                checked={selectedRadio === id} // ! important: idList의 id와 selectedRadio를 매칭시킨다.
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

