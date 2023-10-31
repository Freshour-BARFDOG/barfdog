import {axiosIamport} from "@src/pages/api/axios/axiosIamport";
import {AxiosInstance} from "axios";
import {axiosBaseURLBySSR} from "@src/pages/api/axios/axiosBaseURLBySSR";
import {NextApiRequest, NextApiResponse} from "next";
import {IamportTokenResponseInterface} from "./getAccessToken";

export interface GetCustomerBillingKeyRequest {
  customerUid: string;
}

export enum iamportBillingKeyResponseCode {
  valid = 0,
  inValid = 1, // 빌링키가 이미 삭제된 경우 message: "요청하신 customer_uid( ... )로 등록된 정보를 찾을 수 없습니다."
}

export interface GetCustomerBillingKeyResponse {
  code: iamportBillingKeyResponseCode,
  message: string,
  response: {
    pg_provider: "string",
    customer_id: "string",
  }
}

export default async function POST(req: NextApiRequest, res: NextApiResponse) {
  // console.log("===========여기 ??????");

  const timeout: number = 60000;
  // Set the Axios base URL dynamically
  const localApi: AxiosInstance = axiosBaseURLBySSR(req, {timeout: timeout});

  try {

    const tokenRes = await localApi.post(`/api/iamport/getAccessToken`);
    if (tokenRes.status !== 200) {
      res.status(tokenRes.status).json({
        status: tokenRes.status,
        statusText: tokenRes.statusText,
        message: "Failed to get access token"
      });
      res.end();
      return;
    }

    const {access_token}: IamportTokenResponseInterface = tokenRes.data;

    const body: GetCustomerBillingKeyRequest = req.body;
    const customerUid = body.customerUid;
    if (!customerUid) {
      res.writeHead(400, "CustomerUid must be provided");
      return res.status(400).end();
    }


    const DATA = await axiosIamport({
      url: `/subscribe/customers/${customerUid}`,
      method: "get",
      headers: {"Authorization": access_token}, // 인증 토큰을 Authorization header에 추가
      timeout: timeout
    })
      .then((res) => res.data)
      .catch((err) => err.response);

    const jsonDataAsString = JSON.stringify(DATA);

    // console.log('---------- AXIOS > RESPONSE: ', DATA);

    const defaultCorsHeader = {
      "Access-Control-Allow-Origin": "*", // 다 받거나, 하나만 받거나만 가능
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": 10,
      "Accept": 'application/json',
      "Content-Type": "application/json"
    };


    res.writeHead(200, defaultCorsHeader);
    res.end(jsonDataAsString); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
}
