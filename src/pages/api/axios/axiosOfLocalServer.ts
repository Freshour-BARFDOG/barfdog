import axios, {AxiosInstance} from "axios";

export const axiosOfLocalServer:AxiosInstance = axios.create({
  baseURL: process.env.NODE_ENV === 'production'
    ? process.env.NEXT_PUBLIC_CLIENT_URL_PRODUCT
    : process.env.NEXT_PUBLIC_CLIENT_URL_DEV
  ,
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});
