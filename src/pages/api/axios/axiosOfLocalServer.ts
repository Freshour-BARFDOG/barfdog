import axios, {AxiosInstance} from "axios";

export const axiosOfLocalServer:AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CLIENT_URL_PRODUCT
    : process.env.NEXT_PUBLIC_CLIENT_URL_DEV
  ,
  timeout: 60000, // request header 정보를 읽는데 설정된 timeout 시간
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});
