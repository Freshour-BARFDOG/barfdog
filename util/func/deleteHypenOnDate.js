const deleteHypenOnDate = (d) => {
  const yyyy = d.split( "-" )[0];
  const mm = d.split( "-" )[1];
  const dd = d.split( "-" )[2];
  const convertedDate = `${yyyy}${mm}${dd}`;
  return convertedDate;
}

export default deleteHypenOnDate;