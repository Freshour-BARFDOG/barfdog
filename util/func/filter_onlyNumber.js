  const filter_onlyNumber = (value) => {
    if (!value) return '';
    const regExp = /[^0-9\.]/g;
    return (value = value.replace(regExp, ""));
  };

  export default filter_onlyNumber;