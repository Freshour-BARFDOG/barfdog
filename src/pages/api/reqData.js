import axios from 'axios';
import axiosConfig, {
  axiosUserConfig,
  axiosConfigBlob,
} from './axios/axios.config';
import { cookieType } from '/store/TYPE/cookieType';
import { responseErrorType } from '@store/TYPE/responseErrorType';
import { errorResponseHandleMap } from '@util/func/error/errorResponseHandleMap';

/* - async / await 사용법
     아래 async await을 사용한 함수를 호출하는 함수도
     동일하게 async await을 사용해서 response를 받아야 정상적으로 값을 받을 수 있다.
     ! 그렇지 않을경우 <promise>를 return값으로 받는다 (타이밍 문제로 인함)
* */

/*
axios.request(config)
axios.get(url, {...config})
axios.delete(url, {...config}) // ! headers > config에 포함
axios.head(url, {...config})
axios.options(url, {...config})
axios.post(url,data, {...config})
axios.put(url, data, {...config})
axios.patch(url, data, {...config})
*/

export const getData = async (url, useType, optionalConfig = {}) => {
  const axiosHeaders = useType === 'admin' ? axiosConfig() : axiosUserConfig();
  const config = {
    ...axiosHeaders,
    method: 'GET',
    url: url,
    ...optionalConfig,
  };
  const res = await axios(config)
    .then((res) => {
      // // console.log(res);
      return res;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err.response);
      const errorObj = err?.response;
      const status = errorObj?.status;
      let error = responseErrorType[status];
      console.error(errorObj); // 개발 시, Response Status 확인용
      console.error(error); // 개발 시, Response Status 확인용
      return errorObj;
    });

  return res;
};

export const getDataWithCookies = async (
  url,
  cookies,
  useType,
  optionalConfig = {},
) => {
  let result;
  //const token = tokenFromSSR || getTokenFromServerSide(req);

  const axiosHeaders = useType === 'admin' ? axiosConfig() : axiosUserConfig();
  const axiosHeadersWithCookie = {
    ...axiosHeaders,
    headers: {
      ...axiosHeaders.headers,
      Cookie: cookies,
    },
  };
  const config = {
    ...axiosHeadersWithCookie,
    method: 'GET',
    url: url,
    ...optionalConfig,
    withCredentials: true,
  };
  //config.headers.Cookie = cookies;

  //// console.log(cookies)

  try {
    // ! TOKEN이 없을 경우 , axios 실행되지 않아야 함
    // // console.log('여기 --- ', token);
    result = await axios
      .get(url, config)
      .then((res) => {
        // // console.log('SSR RESPONSE: ',res);
        return res;
      })
      .catch((err) => {
        // // console.log(err.response)
        return err.response;
      });
    // // console.log('result:::', result)
  } catch (err) {
    // console.error(err)
    return err.response;
  }

  return result;

  // const axiosHeaders = useType === 'admin' ? axiosConfig() : axiosUserConfig();
  // const config = {
  //   ...axiosHeaders,
  //   method: "GET",
  //   url: url,
  //   ...optionalConfig,
  //   withCredentials: true,
  // }
  // // console.log(cookies)
  // config.headers.Cookie = cookies;

  // const res = await axios(config)
  //   .then((res) => {
  //     // // console.log(res);
  //     return res;
  //   })
  //   .catch((err) => {
  //     errorResponseHandleMap( err );
  //     // console.log(err.response);
  //     const errorObj = err?.response;
  //     const status = errorObj?.status;
  //     let error = responseErrorType[status];
  //     console.error(errorObj); // 개발 시, Response Status 확인용
  //     console.error(error); // 개발 시, Response Status 확인용
  //     return errorObj;
  //   });

  // return res;
};

export const postData = async (url, data, callback, contType) => {
  return axios
    .post(url, data, axiosConfig(contType))
    .then((res) => {
      //// console.log(res);
      if (callback && typeof callback === 'function') callback(res);
      return res;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err);
      if (callback && typeof callback === 'function') callback(err);
      alert('데이터 전송에 실패하였습니다.');
    });
};

export const postDataBlob = async (url, data, contType) => {
  return axios
    .post(url, data, axiosConfigBlob(contType))
    .then((res) => {
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};

export const deleteData = async (url, config = { data: {} }) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };
  const response = await axios
    .delete(url, {
      ...config, // delete에 body를 추가하기 위함
      ...axiosConfig(), // header
    })
    .then((res) => {
      // console.log('postObjDataResponse:\n', res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      console.error(err.response);
      // console.error('postObjDataResponseError:\n',err.response);
      const error = err.response;
      // // console.log('ERROR내용: ', err.response);
      if (!error.data) {
        result.error = '요청에 대응하는 데이터가 서버에 없습니다.';
      } else if (error.data.error) {
        result.error = error.data.error;
        if (error.data?.errors?.length > 0) {
          result.error = error.data.errors[0].defaultMessage;
        } else if (error?.data?.error?.error) {
          result.error = '서버와 통신오류가 발생했습니다.';
        }
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '관리자 로그인 토큰이 만료되었습니다.';
      } else if (error.data.reason) {
        result.error = error.data.reason;
      } else {
        result.error = '서버측의 정의되지않은 Reponse Error 발생';
      }
      result.status = err.response.status;
      return !error?.status >= 400;
    });

  result.isDone = response;
  return result;
};

export const postObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };

  await axios
    .post(url, data, axiosConfig(contType))
    .then((res) => {
      // console.log('postObjDataResponse:\n', res);
      result.data = res;
      result.status = res.status;
      result.isDone = res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err.response);
      const error = err.response;

      if (!error) {
        result.error = '서버의 에러 응답이 없습니다.';
        result.status = 500;
        result.isDone = false;
        return;
      }

      result.status = err.response.status;
      if (!error.data) {
        result.error = '요청에 대응하는 데이터가 서버에 없습니다.';
      } else if (error.data?.error || error.data?.errors.length) {
        result.error = error.data.error;
        if (error.data?.errors?.length > 0) {
          result.error = getErrorMessageFromApiServer(error.data.errors);
        }
        if (error?.data?.error?.error) {
          result.error = '서버와 통신오류가 발생했습니다.';
        }
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '관리자 로그인 토큰이 만료되었습니다.';
      } else {
        result.error = '서버측의 정의되지않은 Reponse Error 발생';
      }
      result.isDone = false;
    });

  return result;
};

export const patchObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };

  await axios
    .patch(url, data, axiosConfig(contType))
    .then((res) => {
      // console.log('postObjDataResponse:\n', res);
      result.data = res;
      result.status = res.status;
      result.isDone = res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err.response);
      const error = err.response;

      if (!error) {
        result.error = '서버의 에러 응답이 없습니다.';
        result.status = 500;
        result.isDone = false;
        return;
      }

      result.status = err.response.status;
      if (!error.data) {
        result.error = '요청에 대응하는 데이터가 서버에 없습니다.';
      } else if (error.data?.error || error.data?.errors.length) {
        result.error = error.data.error;
        if (error.data?.errors?.length > 0) {
          result.error = getErrorMessageFromApiServer(error.data.errors);
        }
        if (error?.data?.error?.error) {
          result.error = '서버와 통신오류가 발생했습니다.';
        }
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '관리자 로그인 토큰이 만료되었습니다.';
      } else {
        result.error = '서버측의 정의되지않은 Reponse Error 발생';
      }
      result.isDone = false;
    });

  return result;
};

export const putObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };
  const response = await axios
    .put(url, data, axiosConfig(contType))
    .then((res) => {
      // console.log(res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err.response);
      const errStatus = err.response?.status >= 400;
      const errorMessage = err.response?.data.error;
      result.status = err.response.status;
      result.error = errorMessage;
      result.data = err.response;
      return !errStatus;
    });

  result.isDone = response;
  return result;
};

export const deleteObjData = async (url, data) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };
  const response = await axios
    .delete(url, { ...data, ...axiosConfig() })
    .then((res) => {
      // console.log(res);
      result.data = res;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      // console.log(err.response);
      const errStatus = err.response?.status >= 400;
      const errorMessage = err.response?.data.error;
      result.status = err.response.status;
      result.error = errorMessage;
      result.data = err.response;
      return !errStatus;
    });

  result.isDone = response;
  return result;
};

export const postFileUpload = async (url, formData) => {
  const response = await axios
    .post(url, formData, axiosConfig('multipart/fomdata'))
    .then((res) => {
      // // console.log(res);
      return res;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      return err.response;
      // console.log(err.response);
      // console.log(err.request);
    });

  return response;
};

export const postUserObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };

  const response = await axios
    .post(url, data, axiosUserConfig(contType))
    .then((res) => {
      // console.log(res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      errorResponseHandleMap(err);
      const error = err.response;
      // console.log('ERROR내용: ', err.response);
      if (error.data.error || error.data.errors[0].defaultMessage) {
        result.error = error.data.error || error.data.errors[0].defaultMessage;
      } else if (error?.data.error.error) {
        result.error = '서버와 통신오류가 발생했습니다.';
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '유저 토큰이 만료되었습니다.';
      }
      result.status = err.response.status;
      return !error?.status >= 400;
    });

  result.isDone = response;
  return result;
};

export const getTokenClientSide = (req) => {
  // - MEMBER & ADMIN 모두 동일한 API에서 동일한 TOKEN을 발급받는다
  // - SERVER에서 TOKEN 속에 권한에 대한 값을 설정하여 검증한다.
  let token;
  const headers = req.headers;
  if (headers) {
    const cookie = headers.cookie;
    const tokenKey = cookieType.LOGIN_COOKIE;
    cookie.split(';').forEach((c) => {
      if (c.indexOf(tokenKey) >= 0) {
        return (token = c.split('=')[1]);
      }
    });
  }
  return token;
};

export const getTokenFromServerSide = (req) => {
  // - MEMBER & ADMIN 모두 동일한 API에서 동일한 TOKEN을 발급받는다
  // - SERVER에서 TOKEN 속에 권한에 대한 값을 설정하여 검증한다.
  let token;
  if (!req?.headers?.cookie) {
    token = null; // window 첫 load 시, cookie가 없는 경우
  } else {
    const cookies = req.headers.cookie.split(';');
    const loginTokenKey = cookieType.LOGIN_COOKIE;
    if (cookies) {
      for (const cookie of cookies) {
        const key = cookie.split('=')[0].trim();
        const val = cookie.split('=')[1];
        if (key === loginTokenKey) {
          token = val === 'null' ? null : val;
          break;
        }
      }
    }
  }

  return token;
};

export const getCookieSSR = (req, CookieName) => {
  // *주의: SSR에서만 실행
  let result = null;
  // // console.log(req.headers);
  const cookies = req.headers.cookie.split(';');
  if (cookies && CookieName) {
    for (const key of cookies) {
      if (key.indexOf(CookieName) >= 0) {
        result = key.split('=')[1];
        break;
      }
    }
  }
  return result;
};

export const getDataSSR = async (req, url, tokenFromSSR) => {
  let result;
  const token = tokenFromSSR || getTokenFromServerSide(req);
  try {
    // ! TOKEN이 없을 경우 , axios 실행되지 않아야 함
    // // console.log('여기 --- ', token);
    result = await axios
      .get(url, {
        headers: {
          authorization: token,
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // // console.log('SSR RESPONSE: ',res);
        return res;
      })
      .catch((err) => {
        // // console.log(err.response)
        return err.response;
      });
    // // console.log('result:::', result)
  } catch (err) {
    // console.error(err)
    return err.response;
  }

  return result;
};

export const getDataSSRWithCookies = async (
  req,
  url,
  cookies,
  tokenFromSSR,
) => {
  let result;
  const token = tokenFromSSR || getTokenFromServerSide(req);
  try {
    // ! TOKEN이 없을 경우 , axios 실행되지 않아야 함
    // // console.log('여기 --- ', token);
    result = await axios
      .get(url, {
        headers: {
          authorization: token,
          'content-Type': 'application/json',
          Cookie: cookies, // 클라이언트 쿠키를 서버 요청에 추가
        },
      })
      .then((res) => {
        // // console.log('SSR RESPONSE: ',res);
        return res;
      })
      .catch((err) => {
        // // console.log(err.response)
        return err.response;
      });
    // // console.log('result:::', result)
  } catch (err) {
    // console.error(err)
    return err.response;
  }

  return result;
};

export const postDataSSR = async (req, url, data, tokenFromSSR) => {
  let result;
  const token = tokenFromSSR || getTokenFromServerSide(req);
  try {
    // ! TOKEN이 없을 경우 , axios 실행되지 않아야 함
    // // console.log('여기 --- ', token);
    result = await axios
      .post(url, data, {
        headers: {
          authorization: token,
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // // console.log('SSR RESPONSE: ',res);
        return res;
      })
      .catch((err) => {
        // // console.log(err.response)
        return err.response;
      });
    // // console.log('result:::', result)
  } catch (err) {
    // console.error(err)
    return err.response;
  }

  return result;
};

function getErrorMessageFromApiServer(errors = []) {
  let errorMessage = '데이터 처리 중 오류가 발생하였습니다.';
  if (Array.isArray(errors)) {
    errorMessage = errors
      .map((err) => `- error_message: ${err.defaultMessage}`)
      .join('\n');
  }
  return errorMessage;
}
