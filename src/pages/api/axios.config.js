import axios from "axios";
import {getCookie} from "@util/func/cookie";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_DEV;
axios.defaults.withCredentials = true;



export default function axiosConfig (contType = "application/json") {
  // const accessToken = JSON.parse(localStorage.getItem("admin"))?.token; // PAST VERSION.
  const accessToken = getCookie('adminLoginCookie');
  return {
    headers: {
      authorization: accessToken,
      "content-Type": contType,
    }
  }
};





export function axiosUserConfig (contType = "application/json") {
  const accessToken = getCookie('userLoginCookie');
  // console.log(accessToken)
  return {
    headers: {
      authorization: accessToken || JSON.parse(localStorage.getItem("user"))?.token,
      "content-Type": contType,
    }
  }
};

