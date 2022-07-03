  const filter_onlyNumber = (value) => {
    if (!value) return '';
    let filteredValue;
    const regExp = /[^0-9\.]/g;
    filteredValue = value.replace(regExp, ""); // Number() 사용 시, 소수입력 불가
    return filteredValue;
  };

  export default filter_onlyNumber;