export const seperateStringViaComma = (stringWithComma, option= {convertType: null}) => {
  if (!stringWithComma) return;
  const comma = ",";
  return stringWithComma.indexOf( comma )
    ? stringWithComma.split( comma ).map(str => option.convertType === 'number' ? Number(str) : str)
    : [stringWithComma];
}
