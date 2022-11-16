import s from './customSelectWithCustomOptions.module.scss';
import ScrollContainer from '../atoms/ScrollContainer';
import React, {useEffect, useRef, useState} from 'react';
import rem from "/util/func/rem";

export const CustomSelectWithCustomOptions = ({id, options, value, setValues, placeholder, unit, width=120, dataType='sting',  className, onChange ,...props}) => {
  
  const initialSelectedOption = value || options[0].value;
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [isActive, setIsActive] = useState( false );
  const optionBoxRef = useRef( null );
  const inputRef = useRef( null );
  
  
  
  useEffect( () => {
    // 초기값할당
    if(initialSelectedOption) {
      setSelectedOption(initialSelectedOption);
    }
  
    let initValue = initialSelectedOption;
    if(dataType === 'number'){
      initValue = Number(initValue);
    } else {
      initValue = initValue.toString();
    }
 
  
    if(setValues && typeof setValues === 'function'){
      setValues( (prevState) => ({
        ...prevState,
        [id]: initValue,
      }) );
    }
    
  }, [initialSelectedOption] );
  
  
  
  useEffect( () => {
    // HIDE Option
    const optionBox = optionBoxRef.current;
    const viewerInput = inputRef.current;
    if(window && typeof window !=='undefined' && optionBox && viewerInput){
      document.body.addEventListener('click', (e)=>{
        let isBoxClicked = false;
        const clickedTarget = e.target;
        const clickedElemList = [clickedTarget, ...Array.from(clickedTarget.children)];
        clickedElemList.forEach((target)=>{
          const targetClassName = target.className;
          // const exceptClassNameList = [input, optionBox, ...Array.from(optionBox.children)].map(list=>list.className);
          const exceptClassNameList = [optionBox, ...Array.from(optionBox.children)].map(list=>list.className);
          if(exceptClassNameList.indexOf(targetClassName) >= 0){
            isBoxClicked = true;
            return;
          }
        })
        if(isBoxClicked || clickedTarget !== viewerInput){
          setIsActive(false);
        }
      })
    }
  }, [optionBoxRef.current] );
  
  
  
  const onOptionClick = (e) => {
    const option = e.currentTarget;
    let value = option.dataset.value;
    setSelectedOption(value);
    if(dataType === 'number'){
      value = Number(value);
    }
    if(setValues && typeof setValues === 'function'){
      setValues( (prevState) => ({
        ...prevState,
        [id]: value,
      }) );
    }
    
    if(onChange && typeof onChange === 'function'){
      onChange(value);
    }
    
    
  };
  
  
  const onActiveOptionBox = ()=>{
    setIsActive(!isActive);
  }
  
  
  const Options = ({value, label}) => {
    return (
      <p data-value={value} className={`${s.option} ${selectedOption === value ? s.selected : ''}`} onClick={onOptionClick}>
        {label || value}
      </p>
    );
  };
  
  
  
  return (
    <>
      <div className={`${s['customSelectWithOptions']} ${className}`} style={{ width: `${rem(width)}` }} {...props}>
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          value={value || selectedOption || ''}
          onChange={setValues}
          readOnly
          onClick={onActiveOptionBox}
          className={'customSelectInput'}
          ref={inputRef}
        />
        <em className={s.unit}>{unit}</em>
        <ScrollContainer  height={'200'} scrollBarWidth={'0'} className={`${s.scrollContainer} ${isActive ? s.active : ''}`} ref={optionBoxRef}>
          {options.map((option, i) => (
            <Options key={`options-${id}-${i}`} value={option.value} label={option.label}/>
          ))}
        </ScrollContainer>
      </div>
    </>
  );
};