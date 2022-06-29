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

const CheckboxGroup = ({id, items = [], formValues, setFormValues}) => {
  let initialValueArray = [];
  if (formValues[id]) {
    initialValueArray = formValues[id]?.replace(/\s/g, '').split(',');
  }

  const [selectedValues, setSelectedValues] = useState(initialValueArray);

  // console.log(selectedValues);


  useEffect(() => {
    setFormValues((prevState) => ({
      ...prevState,
      [id]: selectedValues.join(','),
    }));
  }, [selectedValues]);

  const onClickHandler = (isChecked, checkboxId) => {
    setSelectedValues((prevState) => {
      let newState = [];
      const alreadyExist = prevState.indexOf(checkboxId) >= 0;
      if (isChecked && !alreadyExist) {
        newState = prevState.concat(checkboxId);
      } else if (!isChecked) {
        newState = prevState.filter((id) => id !== checkboxId);
      }
      return newState;
    });
  };
  if (!items.length) return;

  return (
    <Wrap className={'inp_wrap'}>
      {items.map((item, index) => (
        <Checkbox
          key={`${item.value}-${index}`}
          id={item.value}
          label={item.label}
          onClick={onClickHandler}
          checked={selectedValues.indexOf(item.value) >= 0}
        />
      ))}
    </Wrap>
  );
};

export default CheckboxGroup;