import {Request} from "express";
import axios, {AxiosInstance} from "axios";

interface axiosOptions {
  timeout: number;
}

// timeout - 네이버페이 검수 조건
// ※ 정기결제 승인 / 취소 API : 60초
// ※ 그 외 API : 10초

export const axiosBaseURLBySSR = (req: Request, axiosOptions?: axiosOptions): AxiosInstance => {
  const defaultTimeout: number = 10000;
  return axios.create({
    baseURL: `${req.protocol || 'https'}://${req.headers.host}`,  // Append '/api' to the base UR
    timeout: axiosOptions?.timeout || defaultTimeout
  });
}
