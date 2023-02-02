import React, {useCallback, useEffect, useState} from 'react';
import CustomSelectForTwoSelects from '/src/components/admin/form/CustomSelectForTwoSelects';
import {global_gradeType} from "/store/TYPE/gradeType";
import calcedAgeList from "/util/func/calcedAgeList";

const CustomSelectGroup = ({formValues, setFormValues, groupOptions}) => {
  const {fromName, toName, options, optionType} = groupOptions;
  
  const [selectedFrom, setSelectedFrom] = useState( {[fromName]: {selectedIdx: null, value: null}} );
  const [selectedTo, setSelectedTo] = useState( {[toName]: {selectedIdx: null, value: null}} );
  const [selectedToOptions, setSelectedToOptions] = useState( options );
  
  useEffect( () => {
    const fromValue = selectedFrom[fromName].value;
    const toValue = selectedTo[toName].value;
    regenerateSelectedToOptions();
    setFormValues( (prevState) => ({
      ...prevState,
      [fromName]: fromValue,
      [toName]: toValue || fromValue,
    }) );
    
  }, [selectedFrom] );
  
  
  const regenerateSelectedToOptions = () => {
    const start = selectedFrom[fromName].selectedIdx;
    const filteredToOptions = options.slice( start );
    setSelectedToOptions( filteredToOptions );
  
    const originValue = selectedTo[toName].value;
    const firstOptionIdxValue = filteredToOptions[0].value;
  
    updateSelectedToValue( originValue, firstOptionIdxValue );
    
  }
  
  
  const updateSelectedToValue = useCallback(
    (beforeValue, afterValue) => {
      
      const optionTypeArray = {
        grade: global_gradeType,
        birthYear: options.map( list => list.value )
      }
      
      const optionArray = optionTypeArray[optionType];
      
      const beforeIdx = optionArray.indexOf( beforeValue );
      const afterIdx = optionArray.indexOf( afterValue );
      
      const selectedValue = beforeIdx > afterIdx ? beforeValue : afterValue;
      setSelectedTo( {[toName]: {selectedIdx: 0, value: selectedValue}} );
    }, [] );
  
  
  useEffect( () => {
    setFormValues( prevState => ({
      ...prevState,
      [toName]: selectedTo[toName].value
    }) );
  }, [selectedTo] );
  
  
  if ( !groupOptions || !selectedToOptions.length || !formValues ) return;
  
  return (
    <>
      <CustomSelectForTwoSelects
        value={formValues[fromName] || ''}
        name={fromName}
        id={fromName}
        options={options}
        onChange={setSelectedFrom}
      />
      <span style={{margin: '0 10px'}}>~</span>
      <CustomSelectForTwoSelects
        value={formValues[toName] || formValues[fromName] || ''}
        name={toName}
        id={toName}
        options={selectedToOptions}
        onChange={setSelectedTo}
      />
    </>
  );
};

export default CustomSelectGroup;
