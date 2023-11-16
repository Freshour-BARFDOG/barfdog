import {AxiosError, AxiosRequestConfig, AxiosResponseHeaders} from "axios";
import {HttpResultType} from "@src/pages/api/postPaymentDataToApiServer";

export const ErrorMessage = {
  200: '',
  201: '',
  400: '400 Bad Request',
  401: '401 Bad Request',
  403: '403 Forbidden',
  404: '404 Not Found',
  409: '409 Conflict',
  500: '500 Internal Server Error',
}

interface ErrorResponse<T = any, D = any> extends AxiosError{
  response: {
    status: number;
    statusText: string;
    headers: AxiosResponseHeaders;
    config: AxiosRequestConfig<D>;
    request?: any;
    data: {
      reason: string;
    }
  } | null;
}

export const HttpResponseErrorHandler = (err:ErrorResponse | AxiosError, result?:HttpResultType):boolean => {
  const errorResponse = err?.response;
  const errorStatus = errorResponse?.status;
  // console.log("errorResponse = ",errorResponse);
  if ( window && typeof window !== 'undefined' && errorStatus === 401 && errorResponse.data ) {
    const errorType = errorResponse.data.reason;
    result.status = errorStatus;
    result.error = ErrorResponseMessage[errorType] || "UNKNOWN ERROR";
    ErrorResponseFunc[errorType]();
  }
  return !!errorStatus;
};


const ErrorResponseMessage = {
  UNAUTHORIZED: "Unauthorized!",
  EXPIRED_TOKEN: "Token is expired!",
  FORBIDDEN: "Forbidden!",
}


export const ErrorResponseFunc = {
  UNAUTHORIZED: ()=> window.location.href = "/account/login",
  EXPIRED_TOKEN: ()=> window.location.href = "/account/login",
  FORBIDDEN: ()=> window.location.href = "/account/login"
}
