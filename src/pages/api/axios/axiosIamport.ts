import axios, {AxiosInstance} from "axios";

// timeout - 네이버페이 검수 조건
// ※ 정기결제 승인 / 취소 API : 60초
// ※ 그 외 API : 10초

export const axiosIamport:AxiosInstance = axios.create({
  baseURL: "https://api.iamport.kr/",
  timeout: 10000, // request header 정보를 읽는데 설정된 timeout 시간
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*',
    'Access-Control-Allow-Methods' : 'GET, POST, PUT, DELETE'
  }
});
