import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_DEV;
axios.defaults.withCredentials = true;



const axiosConfig = (contType = "application/json") => {
  // console.log(contType);
  return {
    headers: {
      authorization: JSON.parse(localStorage.getItem("admin"))?.token,
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