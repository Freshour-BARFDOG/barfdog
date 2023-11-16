import {axiosIamport} from "@src/pages/api/axios/axiosIamport";
import {AxiosInstance} from "axios";
import {axiosBaseURLBySSR} from "@src/pages/api/axios/axiosBaseURLBySSR";
import {NextApiRequest, NextApiResponse} from "next";

export interface IamportTokenResponseInterface {
  access_token: string;
  expired_at: number;
}

export interface GetPaymentsByImpUidRequest {
  impUid: string;
}

export interface GetPaymentsByImpUidResponse {
  imp_uid: string;
  customer_uid: string;
  pg_provider: string;
  status: string;
  bank_name: string;
  card_name: string;
  amount: number;
  cancel_amount: number;
}

export default async function POST(req:NextApiRequest, res:NextApiResponse) {

  const timeout:number = 60000;
  // Set the Axios base URL dynamically
  const localApi:AxiosInstance = axiosBaseURLBySSR(req, {timeout: timeout});

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

    const body:GetPaymentsByImpUidRequest = req.body;
    const impUid  = body.impUid;
    if (!impUid) {
      res.writeHead(400, "CustomerUid must be provided");
      return res.status(400).end();
    }



    const DATA = await axiosIamport({
      url: `/payments/${impUid}`,
      method: "delete",
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
