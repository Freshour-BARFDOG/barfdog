


const transformDate = (d, option='time') => {
  if(!d?.indexOf('-'))return;
  const yy = d.split("-")[0];
  const mm = d.split("-")[1];
  const dd = d.split("-")[2].split("T")[0];
  const t = d.split("-")[2].split("T")[1];
  const hour = t.split(':')[0];
  const min = t.split(':')[1];
  const sec = Math.floor(t.split(':')[2]);
  
  let result = `${yy}-${mm}-${dd}`;
  
  if(option === 'time'){
    result = option === 'time' && `${yy}년 ${mm}월 ${dd}일 ${hour}시 ${min}분 ${sec}초`;
  }
  
  return result;
};



export default transformDate;