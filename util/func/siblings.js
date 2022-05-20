// ! React에서는 작동하지 않음




// * React에서 형제를 사용하려면, '원본 배열'을 보존해야함.

const siblings = (target) => {
  let sib = [];
  
  if(!target) return;
  Array.from(target.parentNode.children).forEach((t) => {
    return t !== target && sib.push(t);
  });
  return sib;
};




// * Vanila JS Version.
// function siblings(t) {
//   var children = t.parentElement.children;
//   var tempArr = [];

//   for (let i = 0; i < children.length; i++) {
//     tempArr.push(children[i]);
//   }

//   return tempArr.filter(function (e) {
//     return e != t;
//   });
// } // siblings


export default siblings;