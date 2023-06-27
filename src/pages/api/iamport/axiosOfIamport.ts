import axios, {AxiosInstance} from "axios";

export const axiosOfIamport:AxiosInstance = axios.create({
  baseURL: "https://api.iamport.kr/",
  timeout: 60000, // request header 정보를 읽는데 설정된 timeout 시간
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE'
  }
});

export const IamportAxiosConfig = (access_token: string): { headers: { Authorization: string } } => ({
  headers: {
    Authorization: access_token
  }
});
