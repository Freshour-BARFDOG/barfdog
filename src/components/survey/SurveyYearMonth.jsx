import React, { useEffect, useRef, useState } from 'react';
import s from './surveyYearMonth.module.scss';
import rem from '/util/func/rem';
import ScrollContainer from '../atoms/ScrollContainer';

export default function SurveyYearMonth({
  id,
  options,
  value,
  setFormValues,
  placeholder,
  unit,
  width = 120,
  dataType = 'string',
  className,
  onChange,
  dogInfoIndex,
  ...props
}) {
  //   const initialSelectedOption = value || options[0].value;

  const initialSelectedOption =
    value.slice(0, 4) !== '0000' && value.slice(0, -4) !== '0000' && value;

  const [selectedOption, setSelectedOption] = useState(initialSelectedOption);
  const [isActive, setIsActive] = useState(false);
  const optionBoxRef = useRef(null);
  const inputRef = useRef(null);

  //   console.log('value:::::', value);

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

    // if (initValue.length === 4) {
    //   // "2023"과 같이 년도만 들어온 경우
    //   //   initValue += '0101'; // "20230101" 형태로 만듦
    // } else if (initValue.length === 6) {
    //   // if (initValue.length === 6) {
    //   //   // "202303"과 같이 년도와 월이 들어온 경우
    //   initValue += '01'; // "20230301" 형태로 만듦
    // }

    // if (setValues && typeof setValues === 'function') {
    // 내용 업데이트
    // setFormValues((prevFormValues) => {
    //   const newFormValues = prevFormValues.map((item, idx) => {
    //     if (idx === dogInfoIndex) {
    //       return {
    //         ...item,
    //         birth: initValue,
    //       };
    //     }
    //     return item;
    //   });

    //   return newFormValues;
    // });

    // setValues((prevState) => ({
    //   ...prevState,
    //   [id]: initValue,
    // }));
    // }
    //   }, [selectedOption, setFormValues, dogInfoIndex, dataType]);
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

  //   const [birthYear, setBirthYear] = useState('');
  //   const [birthMonth, setBirthMonth] = useState('');

  const onOptionClick = (e, id) => {
    const option = e.currentTarget;
    const newValue = option.dataset.value;

    // console.log('newValue', newValue);
    // console.log('selectedOption', selectedOption);
    // console.log('value', value);

    // 초기값 설정
    let updatedValue = value || selectedOption;

    if (id === 'yyyy') {
      updatedValue = newValue;
      setSelectedOption(newValue); // 선택한 값
      //   setBirthYear(newValue);
      console.log('updatedYear::::', updatedValue);

      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            console.log('item.birth', item.birth);
            const restOfDate = item.birth.slice(4);
            let newBirth;
            if (item.birth === '') {
              // 날짜 지정 안했을 경우 (2023)
              newBirth = updatedValue;
              console.log('newBirth>>>>', newBirth);
            } else if (item.birth.slice(0, 4) === '0000') {
              // 날짜 지정했을 경우 (00000202)
              // const emptyYear = item.birth.slice(0, 4); // 앞에 4글자 '0000' 비어있는 년도
              newBirth = updatedValue + restOfDate;
            }

            return {
              ...item,
              birth: newBirth,
            };
          }
          return item;
        });
        return newFormValues;
      });
    } else if (id === 'mm') {
      setSelectedOption(newValue); // 선택한 값

      //   setBirthMonth(newValue);
      updatedValue = newValue;
      console.log('updatedValue>>>', updatedValue);

      setFormValues((prevFormValues) => {
        const newFormValues = prevFormValues.map((item, idx) => {
          if (idx === dogInfoIndex) {
            const restOfDate = item.birth.slice(0, 4); // 맨 앞 네글자 (년도)
            let newBirth;

            if (item.birth.slice(0, 4) === '0000' || item.birth === '') {
              // 년도 지정 안했을 경우 (00000101)
              newBirth = '0000' + updatedValue + '01';
            } else {
              // 년도 지정했을 경우 (20230000)
              newBirth = restOfDate + updatedValue + '01';
            }

            console.log('restOfDate', restOfDate);
            console.log('newBirth', newBirth);
            return {
              ...item,
              birth: newBirth,
            };
          }
          return item;
        });
        return newFormValues;
      });

      //   setFormValues((prevFormValues) => {
      //     const newFormValues = prevFormValues.map((item, idx) => {
      //       if (idx === dogInfoIndex) {
      //         return {
      //           ...item,
      //           birth: newValue,
      //         };
      //       }
      //       return item;
      //     });
      //     return newFormValues;
      //   });

      //   }
    }

    // // // 년도와 월이 분리된 경우("2023", "03")를 하나의 문자열로 합치고, "01" 일자를 붙임
    // // // 1) "2023"과 같이 년도가 들어온 경우
    // // if (newValue.length === 4) {
    // //   //   value += '0101'; // "20230101" 형태로 만듦
    // //   // if (value.length === 2) {
    // //   prevValue = newValue;
    // //   setSelectedOption(newValue);
    // //   console.log('year>>>', prevValue);
    // // } else if (newValue.length === 2) {
    // //   console.log('month>>>', prevValue);

    // //   // if (value.length === 2) {
    // //   // 2) "03"과 같이 월이 들어온 경우
    // //   //   value = selectedOption + newValue + '01'; // selectedOption에 년도("2023")가 저장되어 있음
    // //   value = prevValue + newValue + '01'; // selectedOption에 년도("2023")가 저장되어 있음
    // // }

    // // 문자열 -> 숫자로 변환
    // if (dataType === 'number') {
    //   updatedValue = Number(updatedValue);
    // }

    // console.log('updatedValue!!!', updatedValue);

    // if (setValues && typeof setValues === 'function') {
    // 내용 업데이트
    // setFormValues((prevFormValues) => {
    //   const newFormValues = prevFormValues.map((item, idx) => {
    //     if (idx === dogInfoIndex) {
    //       return {
    //         ...item,
    //         birth: updatedValue,
    //       };
    //     }
    //     return item;
    //   });

    //   return newFormValues;
    // });

    // setValues( (prevState) => ({
    //   ...prevState,
    //   birth: value,
    // }) );
    // }

    // if (onChange && typeof onChange === 'function') {
    //   onChange(value);
    // }
  };

  const onActiveOptionBox = () => {
    setIsActive(!isActive);
  };

  const Options = ({ value, label, id }) => {
    return (
      <p
        data-value={value}
        className={`${s.option} ${selectedOption === value ? s.selected : ''}`}
        onClick={(e) => onOptionClick(e, id)}
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
      >
        <em className={s.unit}>{unit}</em>
        <input
          type="text"
          id={id}
          placeholder={placeholder}
          //   value={value || selectedOption || ''}
          value={selectedOption || ''}
          //   onChange={setFormValues}
          //   onChange={(e) => onChangeHandler(e)}
          readOnly
          onClick={onActiveOptionBox}
          className={'customSelectInput'}
          ref={inputRef}
        />
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
              id={id}
            />
          ))}
        </ScrollContainer>
      </div>
    </>
  );
}
