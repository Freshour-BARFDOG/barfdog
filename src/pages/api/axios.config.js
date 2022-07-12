import axios from "axios";
import {getCookie} from "@util/func/cookie";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_DEV;
axios.defaults.withCredentials = true;



const axiosConfig = (contType = "application/json") => {
  // const accessToken = JSON.parse(localStorage.getItem("admin"))?.token; // PAST VERSION.
  const accessToken = getCookie('adminLoginCookie');
  return {
    headers: {
      authorization: accessToken,
      "content-Type": contType,
    }
  }
};


export default axiosConfig;






export const axiosUserConfig = (contType = "application/json") => {
  return {
    headers: {
      authorization: JSON.parse(localStorage.getItem("user"))?.token,
      "content-Type": contType,
    }
  }
};