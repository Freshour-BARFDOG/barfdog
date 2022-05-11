const changeArrayOrder = function (list, targetIdx, moveValue) {
  // 배열값이 없는 경우 나가기
  if (list.length < 0) return;
  // 이동할 index 값을 변수에 선언
  const newPosition = targetIdx + moveValue;
  // console.log("타겟 og index: ", targetIdx ," || 타겟 new index: ", newPosition);

  // console.log("변경 전 배열: ", list);
  // 이동할 값이 0보다 작거나 최대값을 벗어나는 경우 종료
  if (newPosition < 0 || newPosition >= list.length) return;

  // 임의의 변수를 하나 만들고 배열 값 저장
  const tempList = JSON.parse(JSON.stringify(list));

  // 옮길 대상을 기존 배열에서 분리 및 target 변수에 저장
  const target = tempList.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제
  // console.log(target);
  
  // 새로운 위치에 옮길 대상을 추가하기
  tempList.splice(newPosition, 0, target);

  // console.log(tempList.splice(newPosition, 0, target));
  // console.log('변경 후 배열: ',tempList)
  return tempList;
};


export default changeArrayOrder;