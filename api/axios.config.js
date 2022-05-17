import axios from "axios";

axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL_DEV;
axios.defaults.headers.post["Content-Type"] = axios.defaults.headers.post[
  "Content-Type"
] = "application/x-www-form-urlencoded";
axios.defaults.withCredentials = true;



const axiosConfig = (contType = "application/json") => {
  console.log(contType);
  return {
    headers: {
      authorization: JSON.parse(localStorage.getItem("admin"))?.token,
      "Content-Type": contType,
    }
  }
};


export default axiosConfig;
