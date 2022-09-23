

const option = {path: '/'}

export const setCookie = function (name, value, dateUnit, expNumber, option={path: '/'}) {
  const date = new Date();
  let expiryTime;
  switch (dateUnit){
    case 'date':
      expiryTime = expNumber * 24 * 60 * 60 * 1000;
    break;
    case 'hour':
      expiryTime = expNumber * 60 * 60 * 1000;
    break;
    case 'min':
      expiryTime = expNumber * 60 * 1000;
      break;
    case 'sec':
      expiryTime = expNumber * 1000;
      break;
    default:
      expiryTime = 24 * 60 * 60 * 1000; // 만료시간  기본 1일 후
  }
  date.setTime(date.getTime() + expiryTime);
  document.cookie = name + '=' + value + ';expires=' + date.toUTCString() + `;path=${option.path}`;
  // console.log('쿠키 만료예정:  +', expNumber, dateUnit)
};



export const getCookie = function (name) {
  const value = document.cookie.match('(^|;) ?' + name + '=([^;]*)(;|$)');
  return value ? value[2] : null;
};


export const deleteCookie = function (name,option={path:'/'}) {
  document.cookie = `${name}=; expires=2022-09-23T03:12:21.000Z; path=${option.path};`;
};