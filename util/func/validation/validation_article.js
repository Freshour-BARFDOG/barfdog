import validation_duplicateValueInArray from './validation_duplicateValueInArray';

export default function validation_article(obj) {
  let error = '';
  const valuesArr = Object.values(obj);
  const allCounts = valuesArr.length;
  let emptyCount = 0;

  for (const key in obj) {
    const val = obj[key];
    if (!val) {
      emptyCount++;
      error = '빈 항목이 있습니다.';
    }
  }
  const isDuplicated = validation_duplicateValueInArray(valuesArr);
  if (emptyCount === allCounts) {
    error = '모든 항목이 비어있습니다.';
  } else if (isDuplicated) {
    error = '항목이 중복되었습니다.';
  }
  return error;
}