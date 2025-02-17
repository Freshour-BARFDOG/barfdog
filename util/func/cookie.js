// # cf. 쿠키테스트 환경
//  Chrome: 정상작동 (getTime으로 설정할 경우, 365일 설정가능)
//  BraveBrowser: 위의 크롬과 동일한 조건에서 '최대 7일'까지 설정 가능


export const setCookie = function (
  name,
  value,
  dateUnit,
  expNumber,
  option = { path: '/' },
) {
 
  const expiryTime = {
    date: expNumber * 24 * 60 * 60 * 1000,
    hour: expNumber * 60 * 60 * 1000,
    min: expNumber * 60 * 1000,
    sec: expNumber * 1000,
    def: expNumber * 24 * 60 * 60 * 1000,
  };

  const today = new Date();
  today.setTime(today.getTime() + expiryTime[dateUnit || 'def']);
  document.cookie = `${name}=${value};expires=${today.toUTCString()};path=${option.path}`;
};

export const getCookie = function (name) {
  const value = typeof window !== "undefined" && document?.cookie?.match(`(^|;) ?${name}=([^;]*)(;|$)`);
  return value ? value[2] : null;
};

export const deleteCookie = function (name, option = { path: '/' }) {
  document.cookie = `${name}=; expires=2000-01-01T01:00:00.000Z; path=${option.path};`;
};
