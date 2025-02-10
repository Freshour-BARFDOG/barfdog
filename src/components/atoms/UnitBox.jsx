import { useEffect, useState } from 'react';

function UnitBox({ unitList, name, value, setValue, isDiscountAlliance = false }) {
  const [selectedRadio, setSelectedRadio] = useState(value || unitList[0].value);

  useEffect(() => {
    if (value !== selectedRadio) {
      setSelectedRadio(value)
    }
  }, [value])

  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
    if(setValue && typeof setValue ==='function'){
      if (isDiscountAlliance) {
        setValue(id);
      } else {
        setValue((prevState) => ({
          ...prevState,
          [name]: id,
        }));
      }
    }
  };

  return (
    <div className="unit-box-wrap">
      {unitList.map((list, index)=>{
        const id = list.value;
        return (
          <label
            key={`${name}-${index}`}
            id={id}
            className={`box ${selectedRadio === id ? 'active' : ''}`}
          >
            <input
              type="radio"
              value={id}
              name={name}
              id={id}
              checked={selectedRadio === id}
              onChange={onChangeHandler}
            />
            {list.label}
          </label>
        );
      })}
    </div>
  )
}

export default UnitBox;