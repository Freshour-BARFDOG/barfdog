import calcedAgeList from '/util/func/calcedAgeList';
import React, { useEffect, useState } from 'react';
import CustomSelectForTwoSelects from './CustomSelectForTwoSelects';

export default function SelectUserAges({ setFormValues, fromId, toId }) {
  
  
  
  const initialValues = {
    [fromId]: '',
    [toId]: '',
  };
  
  const options = calcedAgeList();
  const [selectedValueObj, setSelectedValueObj] = useState(initialValues);
  const [rightOptionList, setRightOptionList] = useState(options);
  
  useEffect(() => {
    const start = selectedValueObj[fromId]?.selectedIdx;
    const end = options.length;
    const filteredOptions = options.splice(start, end);
    
    const leftVal = selectedValueObj[fromId].value;
    let rightVal = selectedValueObj[toId].value;
    if(Number(leftVal) > Number(rightVal) || !rightVal){
      rightVal = leftVal;
    }
    setRightOptionList(filteredOptions);
    setFormValues((prevState) => ({
      ...prevState,
      [fromId]:  leftVal,
      [toId]:  rightVal,
    }));
  }, [selectedValueObj]);
  
  
  if (!options || !options.length) return;
  
  
  return (
    <>
      <CustomSelectForTwoSelects
        name={fromId}
        id={fromId}
        options={options}
        onChange={setSelectedValueObj}
      />
      <span style={{ margin: '0 10px' }}>~</span>
      <CustomSelectForTwoSelects
        name={toId}
        id={toId}
        options={rightOptionList}
        onChange={setSelectedValueObj}
      />
    </>
  );
}
