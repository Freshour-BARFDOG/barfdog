import {axiosIamport} from "../axios/axiosIamport";
import {IamportTokenResponseInterface} from "@src/pages/api/iamport/getAccessToken";
import {AxiosInstance} from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {axiosBaseURLBySSR} from "@src/pages/api/axios/axiosBaseURLBySSR";

/**
 * <h1>구매자 Billing Key 관리</h1>
 * <pre>
 *   - [네이버페이] 정기구독 해제 = 포트원 billing key 삭제
 *   - 기존 포트원의 경우, 별도의 정기구독 해제 기능 없음
 *
 * </pre>
 */
export interface DeleteCustomerRequest {
  customer_uid: string;
}
export default async function POST(req:NextApiRequest, res:NextApiResponse) {
  console.log("--req body", req.body);
  // timeout - 네이버페이 검수 조건
  // ※ 정기결제 승인 / 취소 API : 60초
  // ※ 그 외 API : 10초
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

    const body:DeleteCustomerRequest = req.body;
    const customer_uid  = body.customer_uid;
    if (!customer_uid) {
      res.writeHead(400, "CustomerUid must be provided");
      return res.status(400).end();
    }

    console.log("-------DeleteCustomerRequest >  accessToken = ",access_token);


    const DATA = await axiosIamport({
      url: `/subscribe/customers/${customer_uid}`,
      method: "delete",
      headers: {"Authorization": access_token}, // 인증 토큰을 Authorization header에 추가
      timeout: timeout
    })
      .then((res) => res.data)
      .catch((err) => err.response);

    const jsonDataAsString = JSON.stringify(DATA);

    console.log('---------- AXIOS > RESPONSE: ', DATA);

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
};
