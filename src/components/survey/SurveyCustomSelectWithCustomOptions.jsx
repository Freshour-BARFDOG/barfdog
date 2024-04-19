import s from './surveyCustomSelectWithCustomOptions.module.scss';
import ScrollContainer from '../atoms/ScrollContainer';
import React, { useEffect, useRef, useState } from 'react';
import rem from '/util/func/rem';

export const SurveyCustomSelectWithCustomOptions = ({
  id,
  options,
  value,
  setFormValues,
  placeholder,
  unit,
  width = 120,
  dataType = 'sting',
  className,
  onChange,
  dogInfo,
  dogInfoIndex,
  activeIndexList,
  setActiveIndexList,
  ...props
}) => {
  // const initialSelectedOption = value || options[0].value;
  const initialSelectedOption = value[id] || options[0]?.value || '';

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [isActive, setIsActive] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  const optionBoxRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    // 초기값할당
    if (initialSelectedOption) {
      setSelectedOption(initialSelectedOption);
    }

    let initValue = initialSelectedOption;
    if (dataType === 'number') {
      initValue = Number(initValue);
    } else {
      initValue = initValue.toString();
    }

    // if (setValues && typeof setValues === 'function') {

    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [id]: initValue,
          };
        }
        return item;
      });

      return newFormValues;
    });
    // setFormValues((prevState) => ({
    //   ...prevState,
    //   [id]: initValue,
    // }));
    // }
  }, [initialSelectedOption]);

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

    if (dataType === 'number') {
      value = Number(value);
    }

    setActiveIndexList((prevIndexList) => {
      if (prevIndexList?.includes(dogInfoIndex)) {
        return prevIndexList.filter((idx) => idx === dogInfoIndex);
      }
      return prevIndexList;
    });

    setFormValues((prevFormValues) => {
      const newFormValues = prevFormValues.map((item, idx) => {
        if (idx === dogInfoIndex) {
          return {
            ...item,
            [id]: value,
          };
        }
        return item;
      });

      return newFormValues;
    });
    // if (setValues && typeof setValues === 'function') {
    //   setValues((prevState) => ({
    //     ...prevState,
    //     [id]: value,
    //   }));
    // }

    // if (onChange && typeof onChange === 'function') {
    // onChange(value);
    // }
  };

  useEffect(() => {
    if (!isActive) {
      setActiveIndexList((prevIndexList) => {
        if (prevIndexList?.includes(dogInfoIndex)) {
          return prevIndexList.filter((idx) => idx !== dogInfoIndex);
        }
        return prevIndexList;
      });
    }
  }, [isActive]);

  // const onActiveOptionBox = () => {
  //   setIsActive(!isActive);
  // };
  const onActiveOptionBox = (e) => {
    e.stopPropagation();

    setIsActive(!isActive);

    setActiveIndexList((prevIndexList) => {
      if (prevIndexList?.includes(dogInfoIndex)) {
        return prevIndexList.filter((idx) => idx !== dogInfoIndex);
      } else {
        return [...prevIndexList, dogInfoIndex];
      }
    });
  };

  const Options = ({ value, label, index }) => {
    return (
      <p
        data-value={value}
        // className={`${s.option} ${selectedOption === value ? s.selected : ''}`}
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
          // value={value || selectedOption || ''}
          value={selectedLabel || ''}
          // onChange={setFormValues}
          onChange={onChange}
          // readOnly
          onClick={onActiveOptionBox}
          className={'customSelectInput'}
          ref={inputRef}
        />
        {/* <em className={s.unit}>{unit}</em> */}
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
