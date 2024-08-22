import s from 'src/components/survey/surveyCustomSelectWithCustomOptions.module.scss';
import ScrollContainer from 'src/components/atoms/ScrollContainer';
import React, { useEffect, useRef, useState } from 'react';
import rem from '/util/func/rem';

export const ReCustomSelectWithCustomOptions = ({
  id,
  options = [],
  value,
  setFormValues,
  placeholder,
  unit,
  width = 120,
  dataType = 'sting',
  className,
  onChange,
  ...props
}) => {
  const initialSelectedOption = value || '';

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [isActive, setIsActive] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(initialSelectedOption);

  const optionBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // 초기값할당
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption);

      const foundOption = options.find(
        (option) => option.value === selectedOption,
      );
      if (foundOption) {
        setSelectedLabel(foundOption.label);
      }
    }

    let initValue = initialSelectedOption;
    if (dataType === 'number') {
      initValue = Number(initValue);
    } else {
      initValue = initValue.toString();
    }

    // if (setValues && typeof setValues === 'function') {
    setFormValues((prevState) => ({
      ...prevState,
      [id]: initValue,
    }));

    // setFormValues((prevState) => ({
    //   ...prevState,
    //   [id]: initValue,
    // }));
    // }
  }, []);

  useEffect(() => {
    // HIDE Option
    const optionBox = optionBoxRef.current;
    const viewerInput = inputRef.current;

    if (window && typeof window !== 'undefined' && optionBox && viewerInput) {
      document.body.addEventListener('click', (e) => {
        let isBoxClicked = false;
        const clickedTarget = e.target;
        const clickedElemList = [
          clickedTarget,
          ...Array.from(clickedTarget.children),
        ];
        clickedElemList.forEach((target) => {
          const targetClassName = target.className;
          // const exceptClassNameList = [input, optionBox, ...Array.from(optionBox.children)].map(list=>list.className);
          const exceptClassNameList = [
            optionBox,
            ...Array.from(optionBox.children),
          ].map((list) => list.className);
          if (exceptClassNameList.indexOf(targetClassName) >= 0) {
            isBoxClicked = true;
            return;
          }
        });
        if (isBoxClicked || clickedTarget !== viewerInput) {
          setIsActive(false);
        }
      });
    }
  }, [optionBoxRef.current]);

  const onOptionClick = (e, label) => {
    const option = e.currentTarget;
    let value = option.dataset.value;

    // console.log('value>>>>', value);
    // console.log('label>>>>', label);

    setSelectedOption(value);
    setSelectedLabel(label);
    // setIsActiveNextBtn(!!value);

    if (dataType === 'number') {
      value = Number(value);
    }

    // setActiveIndexList((prevIndexList) => {
    //   if (prevIndexList?.includes(dogInfoIndex)) {
    //     return prevIndexList.filter((idx) => idx === dogInfoIndex);
    //   }
    //   return prevIndexList;
    // });

    setFormValues((prevState) => ({
      ...prevState,
      [id]: initValue,
    }));
  };

  // useEffect(() => {
  //   if (!isActive) {
  //     setActiveIndexList((prevIndexList) => {
  //       if (prevIndexList?.includes(dogInfoIndex)) {
  //         return prevIndexList.filter((idx) => idx !== dogInfoIndex);
  //       }
  //       return prevIndexList;
  //     });
  //   }
  // }, [isActive]);

  const onActiveOptionBox = (e) => {
    e.stopPropagation();

    setIsActive(!isActive);

    // setActiveIndexList((prevIndexList) => {
    //   if (prevIndexList?.includes(dogInfoIndex)) {
    //     return prevIndexList.filter((idx) => idx !== dogInfoIndex);
    //   } else {
    //     return [...prevIndexList, dogInfoIndex];
    //   }
    // });
  };

  const Options = ({ value, label, index }) => {
    return (
      <p
        data-value={value}
        className={`${s.option} ${
          selectedOption[index] === value ? s.selected : ''
        }`}
        onClick={(e) => onOptionClick(e, label)}
      >
        {label || value}
      </p>
    );
  };

  return (
    <>
      <div
        className={`${s['customSelectWithOptions']} ${className}`}
        style={{ width: `${rem(width)}` }}
        {...props}
        onClick={(e) => onActiveOptionBox(e)}
      >
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          value={selectedLabel || ''}
          onChange={onChange}
          onClick={onActiveOptionBox}
          className={'customSelectInput'}
          ref={inputRef}
          autoComplete={'off'}
          readOnly={true}
        />
        <em className={s.unit}>{unit}</em>
        <ScrollContainer
          height={'200'}
          scrollBarWidth={'0'}
          className={`${s.scrollContainer} ${isActive ? s.active : ''}`}
          ref={optionBoxRef}
        >
          {options.map((option, i) => (
            <Options
              key={`options-${id}-${i}`}
              value={option.value}
              label={option.label}
              index={i}
            />
          ))}
        </ScrollContainer>
      </div>
    </>
  );
};
