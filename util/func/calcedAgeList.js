export default function calcedAgeList() {
  const ageList = [];
  const limitedUserAge = 14;
  const curYear = new Date().getFullYear();
  const endYear = curYear - limitedUserAge - 1;
  const startYear = curYear - 100;
  for (let i = 0; i < endYear - startYear; i++) {
    const year = endYear - i;
    const label = `${year}년`;
    ageList.push({label: label, value: year});
  }
  ageList.reverse();
  const initialValue = {label: '선택', value: ''};
  ageList.unshift(initialValue);
  return ageList;
}