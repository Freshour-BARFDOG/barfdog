export default function yearOptionList (listCount = 1, defaultLabel = false) {
  // YEAR
  const yearOptions = [];
  const curYear = new Date().getFullYear();
  const endYear = curYear;
  const startYear = endYear - listCount;
  for (let i = 0; i < endYear - startYear; i++) {
    const year = (endYear - i).toString();
    const label = `${year}`;
    yearOptions.push( {label: label, value: year} );
  }
  
  // MONTH
  const monthOptions = [];
  for (let i = 0; i < 12; i++) {
    const month = ('0' + (i + 1).toString()).slice( -2 );
    const label = `${month}`;
    monthOptions.push( {label: label, value: month} );
  }
  
  if ( defaultLabel ) {
    // '선택' label
    const defaultLabel = {label: '선택', value: ''};
    yearOptions.unshift( defaultLabel );
    monthOptions.unshift( defaultLabel );
  }
  
  
  return {year: yearOptions, month: monthOptions};
}