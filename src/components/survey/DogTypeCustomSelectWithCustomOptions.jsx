import React, {useEffect, useRef, useState} from 'react';
import s from './dogTypeCustomSelectWithCustomOptions.module.scss';
import rem from '/util/func/rem';
import ScrollContainer from '/src/components/atoms/ScrollContainer';

export const DogTypeCustomSelectWithCustomOptions = ({id, options, width, value,  setFormValues}) => {
  
  
  
  const initialSelectedOption = value[id] || options[0]?.value || '';
  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [isActive, setIsActive] = useState( false );
  const [keyword, setKeyword] = useState( '' );
  
  const optionBoxRef = useRef( null );
  const inputRef = useRef( null );
  const searchInputRef = useRef( null );
  
  useEffect( () => {
    // cookie를 통하여, 기본 값이 존재할 경우
    if(initialSelectedOption){
      setSelectedOption( initialSelectedOption );
    }
    
  }, [initialSelectedOption] );
  
  
  useEffect( () => {
    // HIDE Option
    const optionBox = optionBoxRef.current;
    const viewer = inputRef.current;
    const searchInput = searchInputRef.current;
    if ( window && typeof window !== 'undefined' && optionBox && searchInput ) {
      document.body.addEventListener( 'click', (e) => {
        let isBoxClicked = false;
        const clickedTarget = e.target;
        const targetList = [clickedTarget, ...Array.from( clickedTarget.children )];
        
        const deceptListDepth2 = []
        const deceptListDepth1 = [...Array.from( optionBox.children )];
        deceptListDepth1.forEach((ch1)=>{
          Array.from(ch1.children).forEach((ch2)=>{
            deceptListDepth2.push(ch2)
          })
        })
        const exceptList = [searchInput, viewer, ...Array.from( optionBox.children ),  ...deceptListDepth2];
        targetList.forEach( (target) => {
          const targetClassName = target.className;
          const exceptClassNameList = exceptList.map( (list) => list.className );
          // console.log( targetClassName );
          // console.log( exceptClassNameList );
          if ( exceptClassNameList.indexOf( targetClassName ) >= 0 ) {
            isBoxClicked = true;
            return;
          }
        } );
        // console.log(isBoxClicked)
        setIsActive( isBoxClicked );
        //console.log(viewer, clickedTarget, searchInput)
        if(isBoxClicked && clickedTarget !== viewer){
          setIsActive(false);
        }
      } );
    }
  }, [optionBoxRef.current] );
  
  const onOptionClick = (e) => {
    const option = e.currentTarget;
    const value = option.dataset.value;
    setSelectedOption( value );
    setFormValues( (prevState) => ({
      ...prevState,
      [id]: value,
    }) );
  };
  
  const onSeachHandler = (e) => {
    const value = e.currentTarget.value;
    setKeyword( value );
  };
  
  const onActiveOptionBox = () => {
    setIsActive( !isActive );
  };
  
  const Options = ({label, value}) => {
    return (
      <p
        data-value={value}
        className={`${s.option} ${selectedOption === value ? s.selected : ''}`}
        onClick={onOptionClick}
      >
        {label}
      </p>
    );
  };
  
  return (
    <>
      <div
        className={`${s.selectDogBreed}`}
        style={{width: `${rem( width )}`}}
        onClick={onActiveOptionBox}
      >
        <div className={s.viewer} ref={inputRef}>
          {selectedOption || '견종을 선택해주세요.'}
        </div>
        <div
          className={`${isActive ? s.active : ''} ${s['modal-selectDogBreed']}`}
        >
          <input
            type="text"
            id={id}
            placeholder="견종을 입력하세요"
            className={s.search}
            value={keyword}
            onChange={onSeachHandler}
            ref={searchInputRef}
          />
          <ScrollContainer
            height={options.length > 4 ? 143 : ''}
            scrollBarWidth={options.length > 4 ? '8' : '0'}
            className={`${s.scrollContainer}}`}
            ref={optionBoxRef}
          >
            {options.map( (option, i) => {
              const searchResult = option.value.includes( keyword );
              return (
                <div key={`${option.value}-${i}`} className={s.option}>
                  {keyword.length ? (
                    <>
                      {searchResult && <Options label={option.label} value={option.value}/>}
                    </>
                  ) : (
                    <Options  label={option.label} value={option.value} />
                  )}
                </div>
              );
            } )}
          </ScrollContainer>
        </div>
      </div>
    </>
  );
};