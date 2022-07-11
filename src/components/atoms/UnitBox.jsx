import React, {useState} from 'react';

function UnitBox({unitList, name,value, setValue}) {


  const initialValue = value || unitList[0].value;
  const [selectedRadio, setSelectedRadio] = useState(initialValue);


  const onChangeHandler = (e) => {
    const { id } = e.currentTarget;
    setSelectedRadio(id);
    if(setValue && typeof setValue ==='function'){
      setValue((prevState) => ({
        ...prevState,
        [name]: id,
      }));
    }

  };

  return (
    <>
      <div className="unit-box-wrap">
        {unitList.map((list, index)=>{
          const id = list.value;
          return (
            <label
              key={`${name}-${index}`}
              htmlFor={id}
              name={name}
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
    </>
  )
}

export default UnitBox;