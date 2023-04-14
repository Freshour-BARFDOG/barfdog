export const seperateStringViaComma = (stringWithComma, convertType= 'string') => {
  if (!stringWithComma) return;
  const comma = ",";
  return stringWithComma.indexOf( comma )
    ? stringWithComma.split( comma ).map(str => convertType === 'number' ? Number(str) : str)
    : [stringWithComma];
}
