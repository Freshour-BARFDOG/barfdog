  const filter_onlyNumber = (value) => {
    if (!value) return '';
    let filteredValue;
    const regExp = /[^0-9\.]/g;
    filteredValue = Number(value.replace(regExp, ""));
    return filteredValue;
  };

  export default filter_onlyNumber;