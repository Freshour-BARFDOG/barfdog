const changeArrayOrder = function (arr, targetIdx, moveValue) {
  // 배열값이 없는 경우 나가기
  if (arr.length < 0) return;

  // 이동할 index 값을 변수에 선언
  const newPos = targetIdx + moveValue;

  // 변경될 위치의 index: 0보다 작거나 최대값을 벗어나는 경우, 종료
  if (newPos < 0 || newPos >= arr.length) return;

  // 임의의 변수를 하나 만들고 배열 값 저장
  let tempArr = JSON.parse(JSON.stringify(arr));

  // // console.log('tempArr: ', tempArr)
  // 옮길 대상을 기존 배열에서 분리 && 변수 target에 저장
  let target = tempArr.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제

  // 새로운 위치에 옮길 대상을 추가하기
  tempArr.splice(newPos, 0, target);
  // // console.log('변경 후 배열: ',tempArr)
  return tempArr;
};


export default changeArrayOrder;