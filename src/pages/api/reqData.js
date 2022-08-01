
import axios from 'axios';
import axiosConfig, { axiosUserConfig } from './axios.config';
import { cookieType } from '/store/TYPE/cookieType';

/* - async / await 사용법
     아래 async await을 사용한 함수를 호출하는 함수도
     동일하게 async await을 사용해서 response를 받아야 정상적으로 값을 받을 수 있다.
     ! 그렇지 않을경우 <promise>를 return값으로 받는다 (타이밍 문제로 인함)
* */

//
// export const testTokenStateWithOldToken = async (url) => {
//   const res = await axios
//     .get(url, {
//       headers: {
//         authorization:
//           'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLthqDtgbAg7J2066aEIiwiaWQiOjUsImV4cCI6MTY1MTg5MjU3NiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.Wycm9ZmiiK-GwtsUkvMCHHeExDBtkveDbhKRealjmd8C4OZMp3SFqGFcFWudXMiL5Mxdj6FcTAV9OVsOYsn_Mw',
//         'Content-Type': 'application/json',
//       },
//     })
//     .then((res) => {
//       console.log('OLD TOKEN RESULT: ', res.response);
//       return res;
//     })
//     .catch((err) => {
//       console.error('OLD TOKEN RESULT: ', err);
//       return err.response;
//     });
//   return res;
// };



export const getData = async (url, type) => {
  // console.log(url, type)
  const response = await axios
    .get(url, type === 'admin' ? axiosConfig() : axiosUserConfig())
    // .get(url,axiosConfig())
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err.response);
      let errorMessage;
      const errorObj = err?.response;
      const status = errorObj?.status;
      let error = null;
      switch (status) {
        case 200:
          error = ''; // 유효한 토큰 : 요청을 성공적으로 처리함
          break;
        case 201:
          error = '';
          // 새 리소스를 성공적으로 생성함. 응답의 Location 헤더에 해당 리소스의 URI가 담겨있다.
          break;
        case 400:
          error = '잘못된 요청을 보냈습니다.';
          break;
        case 401:
          error = '인증 토큰이 만료되었습니다';
          break;
        case 403:
          error = '접근권한이 없는 페이지입니다.';
          break;
        case 404:
          error = '요청한 리소스가 서버에 없습니다.';
          break;
        case 409:
          error = '중복된 리소스가 이미 존재합니다.';
          break;
        case 500:
          error = `${status}: 데이터를 조회할 수 없습니다.`;
          break;
      }
      console.error(error); // 개발 시, Response Status 확인용
      return err.response;
    });

  return response;
};

export const postData = async (url, data, callback, contType) => {
  axios
    .post(url, data, axiosConfig(contType))
    .then((res) => {
      console.log(res);
      if (callback && typeof callback === 'function') callback(res);
      return res;
    })
    .catch((err) => {
      console.log(err);
      if (callback && typeof callback === 'function') callback(err);
      alert('데이터 전송에 실패하였습니다.');
    });
};

export const putData = async (url, data) => {
  const response = axios
    .put(url, data, axiosConfig())
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.log(err.response);
      return err;
    });

  return response;
};

export const deleteData = async (url) => {
  const response = axios
    .delete(url, axiosConfig())
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      console.error(err);
      return err.response;
    });

  return response;
};

// 비아이벤처스로 리다이렉ㅇ트된 비언ㅌ--> 다시 분리시키기

export const postObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };

  const response = await axios
    .post(url, data, axiosConfig(contType))
    .then((res) => {
      console.log(res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      const error = err.response;
      console.log('ERROR내용: ', err.response);
      if (error.data.error || error.data.errors[0].defaultMessage) {
        result.error = error.data.error || error.data.errors[0].defaultMessage;
      } else if (error?.data.error.error) {
        result.error = '서버와 통신오류가 발생했습니다.';
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '관리자 로그인 토큰이 만료되었습니다.';
      }
      result.status = err.response.status;
      return !error?.status >= 400;
    });

  result.isDone = response;
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
      console.log(res);
      result.data = res;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      console.log(err.response);
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

export const deleteObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };
  const response = await axios
    .delete(url, data, axiosConfig(contType))
    .then((res) => {
      console.log(res);
      result.data = res;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      console.log(err.response);
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
  console.log(url, formData);
  const response = await axios
    .post(url, formData, axiosConfig('multipart/fomdata'))
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      return err.response;
      console.log(err.response);
      console.log(err.request);
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
      console.log(res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      const error = err.response;
      console.log('ERROR내용: ', err.response);
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

export const postSelfApiData = async (selfPath, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };
  const selfApiUrl = window.location.origin;
  axios.defaults.baseURL = selfApiUrl;
  const response = await axios
    .post(`${selfApiUrl}${selfPath}`, data, axiosUserConfig(contType))
    .then((res) => {
      console.log('', res);
      result.data = res;
      result.status = res.status;
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      const error = err.response;
      console.log('ERROR내용: ', err.response);
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

// -------- SSR DATA FETCHING -------- //
/* - EXAMPLE

export async function getServerSideProps({req}) {
  const getApiUrl = '/api/dogs'
  const res = await getDataSSR(req , getApiUrl )
  let DATA;
  const hasData = res.data._embedded.queryDogsDtoList.length;
  if(hasData){
    const dataList = res.data._embedded.queryDogsDtoList;
    DATA = dataList.map((data)=>({
      id : data.id,
      pictureUrl : data.pictureUrl, // 반려견 프로필 사진
      name : data.name, // 반려견 이름
      birth : data.birth, // 반려견 생년월 //YYYYMM
      gender : data.gender, // 반려견 성별
      representative : data.representative, // 대표견 여부
      subscribeStatus : data.subscribeStatus, // 구독상태
    }))
  }
  return { props: { data: DATA } };
}

*/

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
  // console.log(req.headers);
  const cookie = req.headers.cookie.split(';');
  const tokenKey = cookieType.LOGIN_COOKIE;
  if (cookie) {
    for (const key of cookie) {
      if (key.indexOf(tokenKey) >= 0) {
        token = key.split('=')[1];
        break;
      }
    }
  }
  return token;
};

export const getDataSSR = async (req, url, tokenFromSSR) => {
  let result;
  const token = tokenFromSSR || getTokenFromServerSide(req);
  // console.log('token:', token)
  try {
    result = await axios
      .get(url, {
        headers: {
          authorization: token,
          'content-Type': 'application/json',
        },
      })
      .then((res) => {
        // console.log(res);
        return res;
      })
      .catch((err) => {
        // console.log(err.response)
        return err.response;
      });
  } catch (err) {
    // console.error(err)
    return err.response;
  }

  return result;
};

//
//
// export const axiosServerSide = async (req, method, url, data) => {
//   let result = {
//     isDone: null,
//     err: null,
//     res: null,
//     status: null,
//   };
//
//   await axios({
//     url: url,
//     method: method,
//     headers: {
//       authorization: getTokenFromServerSide(req),
//       'content-Type': 'application/json',
//     },
//     data: data,
//   })
//     .then((res) => {
//       result.res = res;
//     })
//     .catch((err) => {
//       result.err =  err;
//     });
//
//   return result;
// };
