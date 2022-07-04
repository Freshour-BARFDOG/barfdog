const compareIdList = (allArrBefore, curArrBefore, originArrBefore) => {
  if (!allArrBefore.length) return console.error('There is no Image File.');
  
  const originArr = originArrBefore.map((a) => Number(a));
  const allArr = allArrBefore.map((a) => Number(a));
  const curArr = curArrBefore.map((a) => Number(a));
  
  let resultObj = {
    origin: originArr, // very First image List
    all: allArr, // full image List
    cur: curArr, // innerHTML image List
    add: [], // new image List that have been completely uploaded in this process
    del: [], // the image List to be deleted
  };
  
  for (const key in resultObj) { // 'ID' TYPE Conversion from 'String' to 'Number'
    let arr = resultObj[key];
    resultObj[key] = arr.map((a) => Number(a));
  }
  
  allArr.map((id) => {
    const isCurArr = curArr.indexOf(id) >= 0;
    const isOriginArr = originArr.indexOf(id) >= 0;
    const isNew = isCurArr && !isOriginArr;
    const isToBeDeleted = curArr.indexOf(id) < 0;
    
    isNew && resultObj.add.push(id);
    isToBeDeleted && resultObj.del.push(id);
  });
  
  return resultObj;
};
export default compareIdList;