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

const axiosConfig = (contType = "application/json") => ({
  headers: {
    authorization: JSON.parse(localStorage.getItem("admin")).token,
    "Content-Type": contType,
  },
});




export const getData = async (url, callback) => {

  axios
    .get(url, axiosConfig())
    .then((res) => {
      console.log(res);
      callback(res);
      return res;
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};




export const postData = async (url, data, config, callback) => {

  axios
    .post(url, data, axiosConfig())
    .then((res) => {
      console.log(res);
      callback();
    })
    .catch((err) => {
      console.log(err);
      console.log(err.response);
      console.log(err.request);
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
  axios
    .delete(url, axiosConfig())
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};

// export const putData = async (url, data) => {
//   // token = token ? token : await getAdminToken();
//   const axiosConfig = {
//     headers: {
//       authorization: token,
//     },
//   };
//   axios
//     .put(url, data, axiosConfig)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err.response);
//       console.log(err.request);
//     });
// };

// export const postData = async (url, data, config, callback) => {
//   // token = token ? token : await getAdminToken();

//   const axiosConfig = config && {
//     headers: {
//       authorization: token,
//       "Content-Type": "application/json",
//     },
//   };
//   console.log(axiosConfig);
//   axios
//     .post(url, data, axiosConfig)
//     .then((res) => {
//       console.log(res);
//       callback();
//     })
//     .catch((err) => {
//       console.log(err);
//       console.log(err.response);
//       console.log(err.request);
//       alert("데이터 전송에 실패하였습니다.");
//     });
// };

// export const deleteData = async (url) => {
//   // token = token ? token : await getAdminToken();
//   const axiosConfig = {
//     headers: {
//       authorization: token,
//       "Content-Type": "application/json",
//     },
//   };
//   axios
//     .delete(url, axiosConfig)
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err.response);
//       console.log(err.request);
//     });
// };
