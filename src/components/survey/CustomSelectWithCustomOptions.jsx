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
  
    let initValue = selectedOption;
    if(dataType === 'number'){
      initValue = Number(initValue);
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
    const input = inputRef.current;
    if(window && typeof window !=='undefined' && optionBox && input){
      document.body.addEventListener('click', (e)=>{
        let isBoxClicked = false;
        const clickedTarget = e.target;
        const targetList = [clickedTarget, ...Array.from(clickedTarget.children)];
        const exceptList = [input, optionBox, ...Array.from(optionBox.children)];
        targetList.forEach((target)=>{
          const targetClassName = target.className;
          const exceptClassNameList = exceptList.map(list=>list.className);
          if(exceptClassNameList.indexOf(targetClassName) >= 0){
            isBoxClicked = true;
            return;
          }
        })
        if(!isBoxClicked){
          setIsActive(false)
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