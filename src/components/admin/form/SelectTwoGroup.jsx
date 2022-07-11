import React, { useEffect, useState } from 'react';
import CustomSelectForTwoSelects from '/src/components/admin/form/CustomSelectForTwoSelects';

const CustomSelectGroup = ({ setFormValues, groupOptions }) => {
  const startName = groupOptions?.startName; // string
  const endName = groupOptions?.endName; // string
  const options = groupOptions?.options || [];
  
  const [selectedValue, setSelectedValue] = useState();
  const [rightOptionList, setRightOptionList] = useState(options);
  
  useEffect(() => {
    const start = selectedValue && selectedValue[startName].selectedIdx;
    const end = options.length;
    const filteredOptions = options.splice(start, end);
    setRightOptionList(filteredOptions);
    setFormValues((prevState) => ({
      ...prevState,
      [startName]: { value: selectedValue && selectedValue[startName].value },
    }));
  }, [selectedValue]);
  
  if (!groupOptions || !rightOptionList.length) return;
  
  return (
    <>
      <CustomSelectForTwoSelects
        name={startName}
        id={startName}
        options={options}
        onChange={setSelectedValue}
      />
      <span style={{ margin: '0 10px' }}>~</span>
      <CustomSelectForTwoSelects
        name={endName}
        id={endName}
        options={rightOptionList}
        onChange={setFormValues}
      />
    </>
  );
};

export default CustomSelectGroup;
