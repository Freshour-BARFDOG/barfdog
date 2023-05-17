


const transformDate = (d, unit, option={seperator:'. '}) => {
  if(!d) return;
  
  if(d.indexOf('-') < 0)return;
  let result;
  let yymmdd;
  let time;
  let hour, min, sec
  
  

  // YYMMDD
  const yy = d.slice(0,4);
  const mm = d.slice(5,7);
  const dd = d.slice(8,10);
  const seperator = option.seperator || '';
  yymmdd = `${yy}${seperator}${mm}${seperator}${dd}`;
  result = yymmdd;
  
  if(unit === '년월일'){
    result = `${yy}년 ${mm}월 ${dd}일`;
  } else if(unit === '월일'){
    result = `${mm}월 ${dd}일`;
  } else if (unit === '일'){
    result = `${dd}일`;
  }
  
  
  
  // TIME
  if(d.indexOf('T') >= 0){
    const t = d?.split("-")[2].split("T")[1];
    // const hour = t?.split(':')[0];
    hour = t.slice(0,2);
    min = t.slice(3,5);
    sec = t.slice(6,8);
    time = `${hour}:${min}:${sec}`;
  }
  
  if(unit === 'time'){
    result = `${yy}년 ${mm}월 ${dd}일 ${hour}시 ${min}분 ${sec}초`;
    if(seperator){
      result = `${yy}${seperator}${mm}${seperator}${dd} ${hour}:${min}:${sec}`;
    }
  }
  
  if ( unit === 'total') {
    result = `${yymmdd} ${time}`;
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