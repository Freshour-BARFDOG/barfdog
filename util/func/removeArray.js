

const removeArray = function (list, targetIdx) {
  if (list.length < 0) return;
  list.splice(targetIdx, 1)[0]; // splice (n번 째배열, n개 삭제
  return list;
};
