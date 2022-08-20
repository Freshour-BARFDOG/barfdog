export const transformPhoneNumber = (phoneNum, option = { seperator: '-' }) => {
  if (!phoneNum) return;
  let pNum = phoneNum;
  if (pNum.indexOf('-') >= 0) {
    pNum = pNum.replace(/-/g, '');
  }
  const RegExp = /^01([0|1|6|7|8|9])([0-9]{3,4})([0-9]{4})$/;
  const error = !RegExp.test(pNum);
  if (error) return console.error('입력받은 휴대전호번호의 형식이 올바르지 않습니다.');

  let n1;
  let n2;
  let n3;

  if (pNum.length === 10) {
    n1 = pNum.slice(0, 3);
    n2 = pNum.slice(3, 6);
    n3 = pNum.slice(6, 10);
  } else if (pNum.length === 11) {
    n1 = pNum.slice(0, 3);
    n2 = pNum.slice(3, 7);
    n3 = pNum.slice(7, 11);
  }
  return `${n1}${option.seperator}${n2}${option.seperator}${n3}`;
};
