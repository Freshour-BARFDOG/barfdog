import transformClearLocalCurrency from './transformClearLocalCurrency';

let callingCount = 0;
const transformClearLocalCurrencyInEveryObject = (obj, filterStringList) => {
  let resultObj = obj;

  callingCount++;

  filterStringList.forEach((filterString) => {
    for (const key in resultObj) {
      const val = resultObj[key];
      if (key === filterString && typeof val === 'string') {
        resultObj = {
          ...resultObj,
          [key]: transformClearLocalCurrency(val),
        };
      } else if (typeof filterString === 'object' && valid_isArray(val)) {
        const innerArrayInParentObj = val;
        const keyToInnerArray = Object.keys(filterString)[0]; // inner 객체 key
        const filterListToInnerArray = Object.values(filterString)[0]; // inner 객체의 value

        let isTargetKey;
        const newInnerArray = [];
        innerArrayInParentObj.forEach((objInArray) => {
          const innerObjKeyList = Object.keys(objInArray);
          const innerFilterStringList = Object.values(filterString)[0];
          innerObjKeyList.forEach(innerObjKey=>{
            isTargetKey = innerFilterStringList.indexOf(innerObjKey) >= 0;
            // console.log('innerFilterString: ',innerFilterString,'innerObjKey',innerObjKey, 'pos: ',innerFilterString.indexOf(innerObjKey)) // TEST용
          })
          if (isTargetKey){
            const result = transformClearLocalCurrencyInEveryObject(
              objInArray,
              filterListToInnerArray,
            );
            // console.log('result:::::: ', result);
            newInnerArray.push(result);
            resultObj = {
              ...resultObj,
              [keyToInnerArray]: newInnerArray,
            };
          }
        });

      }
    }
  });

  return resultObj;
};

export default transformClearLocalCurrencyInEveryObject;

const valid_isArray = (arr) => {
  const result = Array.isArray(arr);
  return result;
};
