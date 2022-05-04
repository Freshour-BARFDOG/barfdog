import getAdminToken from "@api/getAdminToken";
import axios from "axios";


let token ; 

export const getData = async (url, callback) => {
  token = await getAdminToken();
  const axiosConfig = {
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
  };
  axios
    .get(url, axiosConfig)
    .then((res) => {
      callback(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};


export const putData = async (url) => {
  token && await getAdminToken();
  const axiosConfig = {
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
  };
  axios
    .put(url, axiosConfig)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};



export const postData = async (url) => {
  const token = await getAdminToken();
  const axiosConfig = {
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
  };
  axios
    .post(url, axiosConfig)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};




export const deleteData = async (url) => {
  const token = await getAdminToken();
  const axiosConfig = {
    headers: {
      authorization: token,
      "Content-Type": "application/json",
    },
  };
  axios
    .delete(url, axiosConfig)
    .then((res) => {
      console.log(res);
    })
    .catch((err) => {
      console.log(err.response);
      console.log(err.request);
    });
};

