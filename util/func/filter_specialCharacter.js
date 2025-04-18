
const filter_specialCharacter = (str) => {
  let filteredStr;
  const reg = /[\{\}\[\]\/?.,;:|*~`!^\_+<>@\#$%&\\\=\'\"]/gi;
  filteredStr = reg.test(str) ? str.replace(reg, "") : str;

  return filteredStr;
};
export default filter_specialCharacter;