import axios, {AxiosInstance} from "axios";

export const axiosOfIamport:AxiosInstance = axios.create({
  baseURL: "https://api.iamport.kr/",
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export const IamportAxiosConfig = (access_token: string): { headers: { Authorization: string } } => ({
  headers: {
    Authorization: access_token
  }
});
