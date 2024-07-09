export default function surveyYearOptionList(
  listCount = 1,
  defaultLabel = false,
) {
  const today = new Date();
  const maxDate = new Date(today.getTime() - 90 * 24 * 60 * 60 * 1000); //! 90일 이전이어야
  const maxYear = maxDate.getFullYear();
  const maxMonth = maxDate.getMonth() + 1; // getMonth() returns 0-based month

  // YEAR
  const yearOptions = [];
  const startYear = maxYear - listCount + 1; // 시작 연도 설정
  for (let year = maxYear; year >= startYear; year--) {
    yearOptions.push({ label: `${year}`, value: `${year}` });
  }
  // MONTH
  const monthOptions = [];
  for (let i = 1; i < 12; i++) {
    if (maxYear === maxDate.getFullYear() && i > maxMonth) break; // 90일 이전의 월까지만 포함
    const month = ('0' + i).slice(-2);
    monthOptions.push({ label: month, value: month });
  }

  if (defaultLabel) {
    // '선택' label
    const defaultLabel = { label: '선택', value: '' };
    yearOptions.unshift(defaultLabel);
    monthOptions.unshift(defaultLabel);
  }

  return { year: yearOptions, month: monthOptions };
}
