import {Request} from "express";
import axios, {AxiosInstance} from "axios";

export const axiosOfBaseURL = (req: Request): AxiosInstance => {
  const instance = axios.create({
    baseURL: `${req.protocol}://${req.headers.host}`,  // Append '/api' to the base UR
  });
  return instance;
}
