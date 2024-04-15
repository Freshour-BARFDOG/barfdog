export default function yearOptionList(listCount = 1, defaultLabel = false) {
  // YEAR
  const yearOptions = [];
  const curYear = new Date().getFullYear();
  const endYear = curYear;
  const startYear = endYear - listCount;
  for (let i = 0; i < endYear - startYear; i++) {
    const year = (endYear - i).toString();
    const label = `${year}`;
    yearOptions.push({ label: label, value: year });
  }

  // MONTH
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const month = ('0' + (i + 1).toString()).slice(-2);
    const label = `${month}`;
    monthOptions.push({ label: label, value: month });
  }

  // DAY
  const dayOptions = [];
  for (let i = 1; i <= 31; i++) {
    const day = ('0' + i.toString()).slice(-2);
    const label = `${day}`;
    dayOptions.push({ label: label, value: day });
  }

  if (defaultLabel) {
    // '선택' label
    const defaultLabel = { label: '선택', value: '' };
    yearOptions.unshift(defaultLabel);
    monthOptions.unshift(defaultLabel);
    dayOptions.unshift(defaultLabel);
  }

  return { year: yearOptions, month: monthOptions, day: dayOptions };
}
