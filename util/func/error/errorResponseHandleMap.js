export const errorResponseHandleMap = (pureErrorMap) => {
  const errorResponse = pureErrorMap?.response;
  const errorStatus = errorResponse?.status;
  if ( window && typeof window !== 'undefined' && errorStatus === 401 && errorResponse.data ) {
    const errorType = errorResponse.data.reason;
    alert( errorMessageMap_KOR[errorType] );
    errorHandleMap[errorType]();
  }
};


const errorHandleMap = {
  UNAUTHORIZED: ()=> window.location.href = "/account/login",
  EXPIRED_TOKEN: ()=> window.location.href = "/account/login",
  FORBIDDEN: ()=> window.location.href = "/account/login"
}


const errorMessageMap_KOR = {
  UNAUTHORIZED: "로그인이 필요합니다.",
  EXPIRED_TOKEN: "인증시간이 만료되었습니다.",
  FORBIDDEN: "접근 권한이 없습니다.",
}
