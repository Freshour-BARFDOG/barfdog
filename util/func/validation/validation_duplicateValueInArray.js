const validation_duplicateValueInArray = (arr) => {
  let isDuplicated;
  const setCollection = new Set(arr);
  isDuplicated = setCollection.size < arr.length;
  return isDuplicated;
}


export default validation_duplicateValueInArray;