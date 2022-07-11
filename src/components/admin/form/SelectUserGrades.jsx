import React, { useEffect, useState } from 'react';
import { global_gradeType, global_gradeType_ENG } from '/store/TYPE/gradeType';
import CustomSelectForTwoSelects from './CustomSelectForTwoSelects';


export default function SelectUserGrades({ setFormValues, id }) {
  const noticeOption = [{ label: '선택', value: null }];
  const gradeEn = global_gradeType_ENG;
  const gradeKo = global_gradeType;

  const typeOptions = gradeKo.map((gradeName, index) => ({
    label: gradeName,
    value: gradeName,
  }));

  const startId = 'start';
  const endId = 'end';
  const initialSelectIdObj = {
    [startId]: '',
    [endId]: '',
  };
  const allOptions = noticeOption.concat(typeOptions);
  const [selectedGradeObj, setSelectedGradeObj] = useState(initialSelectIdObj);
  const [rightOptionList, setRightOptionList] = useState(allOptions);

  
  
  useEffect(() => {
    setRightOptions();
   const arr = getSelectedGradesArray();
    setFormValues((prevState) => ({
      ...prevState,
      [id]: arr,
    }));

  }, [selectedGradeObj]);
  
  
  function getSelectedGradesArray () {
    let result = [];
    const leftVal = selectedGradeObj[startId].value;
    let rightVal = selectedGradeObj[endId].value;
    if (Number(leftVal) > Number(rightVal) || !rightVal) {
      rightVal = leftVal;
    }
    const gradeStartIndex = gradeKo.indexOf(leftVal);
    const gradeEndIndex = gradeKo.indexOf(rightVal); // slice함수는 마지막 index를 제외한 새 배열을 리턴한다.
    const calcEndIndex = gradeEndIndex + 1;
  
    if (leftVal === '선택' || rightVal === '선택') {
      result = [];
    } else if (gradeStartIndex > gradeEndIndex) {
      const calcEndIndexForSelectArray = gradeStartIndex + 1;
      result = gradeKo.slice(gradeStartIndex, calcEndIndexForSelectArray);
    } else {
      result = gradeKo.slice(gradeStartIndex, calcEndIndex);
    }
    // console.log('startIndex: ', gradeStartIndex, '& endIndex: ', gradeEndIndex, '& calcEndIndex' , calcEndIndex)
    // console.log('Selected GradeList: ',result)
    return result;
  }
  
  
  
  const setRightOptions = ()=>{
    const leftOptionIndex = selectedGradeObj[startId].selectedIdx;
    const OriginOptionLastIndex = allOptions.length;
    const filteredGradeOptions = allOptions.splice(leftOptionIndex, OriginOptionLastIndex);
    setRightOptionList(filteredGradeOptions);
    
  }

  if (!allOptions.length) return;

  return (
    <>
      <CustomSelectForTwoSelects
        name={startId}
        id={startId}
        options={allOptions}
        onChange={setSelectedGradeObj}
      />
      <span style={{ margin: '0 10px' }}>~</span>
      <CustomSelectForTwoSelects
        name={endId}
        id={endId}
        options={rightOptionList}
        onChange={setSelectedGradeObj}
      />
    </>
  );
}
