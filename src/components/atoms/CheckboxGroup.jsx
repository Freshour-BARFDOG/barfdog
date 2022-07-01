import React, {useEffect, useState} from 'react';
import Checkbox from './Checkbox';
import styled from "styled-components";
import rem from '/util/func/rem';


const Wrap = styled.div`
  display:flex;
  align-content: center;
  justify-content: flex-start;
  column-gap: ${rem(10)};
`;



const CheckboxGroup = ({id, items = [], formValues, setFormValues, mode}) => {

  // 내부 checkbox UI(checked값)를 위한 State
  const [selectedValues, setSelectedValues] = useState({});
  

  
  useEffect(() => {
    if(mode !== 'update') return;
    let initialValue = {};
    const tempArr = formValues[id]?.replace(/\s/g, '').split(',') || [];
  
    if (tempArr.length && Array.isArray(tempArr)) {
      tempArr.forEach((key) => {
        initialValue = {
          ...initialValue,
          [key]: true,
        };
      });
    }
    setSelectedValues(initialValue);
  }, [formValues[id]]);
  
  const onClickHandler = async (isChecked, checkboxId) => {
    
    let convertedValue;
    await setSelectedValues((prevState) =>{
      const nextState = {
        ...prevState,
        [checkboxId]: isChecked,
      }
      convertedValue = nextState; // for formvalue
      return nextState; // for checkbox inner state
    });
    const allValueArr= [];
    for (const key in convertedValue) {
      const val = convertedValue[key];
      if(val) allValueArr.push(key);
    }
    const convertedAllValues  = allValueArr.join(',');
    setFormValues((prevState) => ({
      ...prevState,
      [id]: convertedAllValues
    }));
  };
  
  
  
  
  
  if (!items.length) return;

  return (
    <Wrap className={'inp_wrap'}>
      {items.map((item, index) => {
        const checkboxId = item.value;
        return (<Checkbox
          key={`${checkboxId}-${index}`}
          id={checkboxId}
          label={item.label}
          onClick={onClickHandler}
          checked={selectedValues[checkboxId]}
        />)
      })}
    </Wrap>
  );
};

export default CheckboxGroup;
