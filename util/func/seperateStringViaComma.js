export const seperateStringViaComma = (stringWithComma) => {
  if (!stringWithComma) return;
  const comma = ",";
  return stringWithComma.indexOf( comma )
    ? stringWithComma.split( comma )
    : [stringWithComma];
}
