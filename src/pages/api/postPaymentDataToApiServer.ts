import {getCookie} from "@util/func/cookie";
import {cookieType} from "@store/TYPE/cookieType";
import {AxiosError, AxiosResponse} from "axios";
import {HttpResponseErrorHandler} from "@src/pages/api/axios/errorHandler";
import {axiosAPIServer} from "@src/pages/api/axios/axiosAPIServer";

export interface HttpResultType {
  isDone: boolean | null;
  error: string | null;
  data: any | null;
  status: number | null;
}

export interface AxiosConfigInfterface {
  timeout?: number; // 응답 대기 시간
  headers?: any;
}


export const postPaymentDataToApiServer = async (
  url: string,
  data?: object,
  axiosConfig?: AxiosConfigInfterface
): Promise<HttpResultType> => {


  const result: HttpResultType = {
    isDone: false,
    error: '',
    data: null,
    status: null,
  };

  const defaultConfig:AxiosConfigInfterface = {
    timeout: 60000,
    headers: {
      'content-Type': 'application/json',
      authorization: getCookie(cookieType.LOGIN_COOKIE)
    }
  }

  const config = {
    headers: axiosConfig?.headers || defaultConfig.headers,
    timeout: axiosConfig?.timeout || defaultConfig.timeout
  }


  // // console.log("config.timeout= " + config.timeout);

  await axiosAPIServer.post(url, data, config)
    .then((res: AxiosResponse) => {
      // console.log('postObjDataResponse:\n', res);
      result.data = res;
      result.status = res.status;
      result.isDone = res.status === 200 || res.status === 201;
    })
    .catch((err: AxiosError) => {
      // console.log(err);
      // console.log(err?.response);
      const hasError = HttpResponseErrorHandler(err, result); // Error 있을 경우, true
      let errors = err.response?.data?.errors;
      const hasErrorMessage = errors?.length > 0;
      result.error = hasErrorMessage ? errors : null;
      result.isDone = !hasError;
    });

  return result;
}
