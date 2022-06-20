


const transformDate = (d) => {
  if(!d?.indexOf('-'))return;
  const yy = d.split("-")[0];
  const mm = d.split("-")[1];
  const dd = d.split("-")[2].split("T")[0];
  return `${yy}-${mm}-${dd}`;
};



export default transformDate;