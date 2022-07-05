import transformClearLocalCurrency from './transformClearLocalCurrency';



///  ! createSinglePage -> 에도 익 적용하기
let callingCount = 0;
const transformClearLocalCurrencyInEveryObject = (obj, filterStringObj) => {
  let resultObj = obj;
  callingCount++;
    
    for (const key in obj) {
      const val = obj[key];
      const isTarget = Object.keys(filterStringObj).indexOf(key) >= 0;
      
      if (isTarget && typeof val === 'string') {
        resultObj = {
          ...resultObj,
          [key]: transformClearLocalCurrency(val),
        };
        // console.log('****** result obj: ',resultObj);
      } else if (isTarget && valid_isArray(val) && val.length > 0) {
        const innerValueArr = val;
        let isInnerTarget = false;
        const newInnerArray = [];
        const filterKeys = Object.keys(filterStringObj);
        let innerFilterStringObj = filterKeys.indexOf(key) && filterStringObj[key];
        // console.log('callingCount:',callingCount,' && value :',val);
        const innerFilterKeys = Object.keys(innerFilterStringObj);
        innerValueArr.forEach(objInInnerValueArr=>{
          // console.log(objInInnerValueArr)
          const keysOfobjInInnerValuearr =  Object.keys(objInInnerValueArr);
          keysOfobjInInnerValuearr.forEach(k=> {
            innerFilterKeys.forEach(f=>{
              if(k === f){
                return isInnerTarget = true;
              }
            })
          });
          
          if (isInnerTarget && innerFilterKeys.length){
            // console.log('Recursive Target > objInArray: ',objInInnerValueArr);
            // console.log('innerFilterStringList: ',innerFilterStringObj);
            const result = transformClearLocalCurrencyInEveryObject(
              objInInnerValueArr,
              innerFilterStringObj,
            );
            // console.log('result :::::: ', result);
            newInnerArray.push(result);
            resultObj = {
              ...resultObj,
              [key]: newInnerArray,
            };
          }
        })
      }
    }
  return resultObj;
};

export default transformClearLocalCurrencyInEveryObject;

const valid_isArray = (arr) => {
  const result = Array.isArray(arr);
  return result;
};
