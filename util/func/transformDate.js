


const transformDate = (d, option) => {
  if(!d?.indexOf('-'))return;
  const yy = d.split("-")[0];
  const mm = d.split("-")[1];
  const dd = d.split("-")[2].split("T")[0];

  let result = `${yy}-${mm}-${dd}`;
  
  if(option === 'time'){
    const t = d?.split("-")[2].split("T")[1];
    const hour = t?.split(':')[0];
    const min = t?.split(':')[1];
    const sec = Math.floor(t?.split(':')[2]);
    result = option === 'time' && `${yy}년 ${mm}월 ${dd}일 ${hour}시 ${min}분 ${sec}초`;
  }
  
  return result;
};

export default transformDate;



export const transformToday = (date)=>{
  const today =  date || new Date();
  const yy = today.getFullYear();
  let mm = today.getMonth()+1; // important
  let dd = today.getDate();
  
  // mm = mm < 10 ?  '0'+mm.toString() : mm;
  // dd = dd < 10 ? '0'+dd.toString() : dd;
  mm = ('0' + mm).slice(-2);
  dd = ('0' + dd).slice(-2);
  
  return `${yy}-${mm}-${dd}`
}


export const transformDateWithHyphen = (yyyy, m,d)=>{
  // year, month, day, hours, minutes, seconds, milliseconds
  const today =  new Date(yyyy, m,d);
  const yy = today.getFullYear();
  let mm = today.getMonth(); // important
  let dd = today.getDate();
  
  mm = mm < 10 && '0'+mm.toString();
  dd = dd < 10 && '0'+dd.toString();
  
  return `${yy}-${mm}-${dd}`
}