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


/* - async / await 사용법
     아래 async await을 사용한 함수를 호출하는 함수도
     동일하게 async await을 사용해서 response를 받아야 정상적으로 값을 받을 수 있다.
     ! 그렇지 않을경우 <promise>를 return값으로 받는다 (타이밍 문제로 인함)
* */

export const testTokenStateWithOldToken = async (url)=>{
  const res = await axios
    .get(url, {
      headers: {
        authorization:
          'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiLthqDtgbAg7J2066aEIiwiaWQiOjUsImV4cCI6MTY1MTg5MjU3NiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifQ.Wycm9ZmiiK-GwtsUkvMCHHeExDBtkveDbhKRealjmd8C4OZMp3SFqGFcFWudXMiL5Mxdj6FcTAV9OVsOYsn_Mw',
        'Content-Type': 'application/json',
      },
    })
    .then((res) => {
      console.log('OLD TOKEN RESULT: ', res.response);
      return res;
    })
    .catch((err) => {
      console.error('OLD TOKEN RESULT: ', err);
      return err.response;
    });
  return res;
}


export const getData = async (url, callback) => {
  const response = await axios
    .get(url, axiosConfig())
    .then((res) => {
      // console.log(res);
      if(callback && typeof callback === 'function') callback(res);
      return res;
    })
    .catch((err) => {
      let errorMessage;
      // console.log(err);
  
      const errorObj = err.response;
      const status = errorObj?.status;
      if(status === 401){
        const errorReason = errorObj.data.reason;
        if(errorReason === "EXPIRED_TOKEN"){
          console.error("ERROR REASON: ", errorReason);
          errorMessage = status + errorReason+ '\n로그인 토큰이 만료되었습니다. 다시 로그인해주세요.';
        } else if(errorReason === "UNAUTHORIZED") {
          errorMessage = errorReason +  '\n권한이 없습니다.'
        }
      }else if (status === 403) {
        errorMessage =  errorReason + '\n접근 불가한 페이지입니다.';
      } else if(status === 500) {
        errorMessage =  errorObj?.data?.error + '\n데이터가 존재하지 않거나, 서버 내부 에러입니다.';
      } else {
        errorMessage =  'Failed Fetching Data: 데이터를 불러오는데 실패했습니다.';
      }
      
      console.log(err.response);
      console.error(errorMessage);
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
      if (callback && typeof callback === "function") callback(err);
      alert("데이터 전송에 실패하였습니다.");
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
      return err;
      console.log(err.response);
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
      console.error(err)
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
  }

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
      console.log('ERROR내용: ',err.response);
      if (error.data.error || error.data.errors[0].defaultMessage) {
        result.error = error.data.error || error.data.errors[0].defaultMessage;
      } else if(error?.data.error.error){
        result.error = '서버와 통신오류가 발생했습니다.'
      } else if (error.data.reason === 'EXPIRED_TOKEN') {
        result.error = '관리자 로그인 토큰이 만료되었습니다.'
      }
      return !error?.status >= 400;
    });

  result.isDone = response;
  return result;
}




export const putObjData = async (url, data, contType) => {
  const result = {
    isDone: false,
    error: '',
    data: null,
  }
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




export const getTokenFromCookie = (req)=>{
  let token;
  const cookie = req.headers.cookie;
  const tokenKey = 'userLoginCookie';
  cookie.split(';').forEach((c) => {
    if (c.indexOf(tokenKey) >= 0) {
      token = c.split('=')[1];
      return
    }
  });
  
  return token;
  
}







export const getDataSSR = async (req, url)=>{
  const token = getTokenFromCookie(req);
  const result = await axios
    .get(url,{
      headers: {
        authorization: token,
        "content-Type": "application/json",
      }
    })
    .then((res) => {
      // console.log(res);
      return res;
    })
    .catch((err) => {
      // console.log(err.response)
      return err.response
    });
  
  return result;
  
}
