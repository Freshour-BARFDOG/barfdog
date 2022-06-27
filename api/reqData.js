// * ----------------------------------- * //
// *  < AXIOS PARAM for Server API>

// * get(url, config)
// * post(url, data, config)
// * put(url, data, config)
// ! put() : data param값 필수 (수정할 값 없을 시, ''빈값 전송)
// * delete(url, config)
// ! delete() :  data param값 제외 (data param존재할 경우, 서버에서 token 에러발생)

// * ----------------------------------- * //


import axios from "axios";
import axiosConfig from './axios.config';
import {useRouter} from "next/router";




/* - async / await 사용법
     아래 async await을 사용한 함수를 호출하는 함수도
     동일하게 async await을 사용해서 response를 받아야 정상적으로 값을 받을 수 있다.
     ! 그렇지 않을경우 <promise>를 return값으로 받는다 (타이밍 문제로 인함)
* */
export const getData = async (url, callback) => {
  const response = await axios
    .get(url, axiosConfig())
    .then((res) => {
      // console.log(res);
      if(callback && typeof callback === 'function') callback(res);
      return res;
    })
    .catch((err) => {
      console.error('ERROR: ', err.response);
      const errorObj = JSON.parse(err.request.response);
      const status = errorObj.status;
      if(status === 401){
        const EXPIRED_TOKEN = errorObj.reason === "EXPIRED_TOKEN";
        const UNAUTHORIZED = errorObj.reason === "UNAUTHORIZED";
        console.log(EXPIRED_TOKEN)
        if(EXPIRED_TOKEN){
          alert('로그인 토큰이 만료되었습니다. 다시 로그인해주세요.');
        }
        console.error("errorType > EXPIRED_TOKEN : ", EXPIRED_TOKEN);
        console.error("errorType > UNAUTHORIZED : ", UNAUTHORIZED);
      }else if (status === 403) {
        const FORBIDDEN = errorObj.reason === "FORBIDDEN";
        console.error("errorType > FORBIDDEN : ", FORBIDDEN);
      }
      const errorMessage =  err.response?.data.error || '데이터를 불러오는데 실패했습니다.'
      alert(errorMessage);
      return err;
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
      if (callback && typeof callback === "function") callback(err);
      alert("데이터 전송에 실패하였습니다.");
    });
};





export const putData = async (url, data) => {

  axios
    .put(url, data, axiosConfig())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};




export const deleteData = async (url) => {
  const response = axios
    .delete(url, axiosConfig())
    .then((res) => {
      console.log(res);
      return res;
    })
    .catch((err) => {
      return err.response;
    });

  return response;
};

// 비아이벤처스로 리다이렉ㅇ트된 비언ㅌ--> 다시 분리시키기




export const postObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: ''
  }
  const response = await axios
    .post(url, data, axiosConfig(contType))
    .then((res) => {
      console.log(res);
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      const error = err.response;
      console.log('ERROR내용: ',err.response);
      const errStatus = error?.status >= 400;
      let errorMessage = error?.data.error ||(error.data.reason === 'EXPIRED_TOKEN' && '관리자 로그인 토큰이 만료되었습니다.');
      result.error = errorMessage || '서버와 통신오류가 발생했습니다.';
      return !errStatus;
    });

  result.isDone = response;
  return result;
}




export const putObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: ''
  }
  const response = await axios
    .put(url, data, axiosConfig(contType))
    .then((res) => {
      console.log(res);
      return res.status === 200 || res.status === 201;
    })
    .catch((err) => {
      console.log(err.response);
      const errStatus = err.response.status >= 400;
      const errorMessage = err.response.data.error;
      result.error = errorMessage
      return !errStatus;
    });

  result.isDone = response;
  return result;
}





export const postFileUpload = async (url, formData) => {
  console.log(url, formData)
  const response = await axios
    .post(url, formData, axiosConfig("multipart/fomdata"))
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
}



