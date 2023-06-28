import {axiosOfIamport} from "./axiosOfIamport";
import {IamportTokenResponseInterface} from "@src/pages/api/iamport/getAccessToken";
import {AxiosInstance} from "axios";
import {NextApiRequest, NextApiResponse} from "next";
import {axiosOfBaseURL} from "@src/pages/api/axios/axiosOfBaseURL";

export default async function POST(req:NextApiRequest, res:NextApiResponse) {
  console.log("--req body", req.body);
  // Set the Axios base URL dynamically

  const localApi:AxiosInstance = axiosOfBaseURL(req);

  try {

    const tokenRes = await localApi.post(`/api/iamport/getAccessToken`);
    if (tokenRes.status !== 200) {
      res.status(tokenRes.status).json({
        status: tokenRes.status,
        statusText: tokenRes.statusText,
        message: "Failed to get access token"
      });
    }

    const {access_token}: IamportTokenResponseInterface = tokenRes.data;


    const DATA = await axiosOfIamport({
      url: `/subscribe/payments/again`,
      method: "post",
      headers: {"Authorization": access_token}, // 인증 토큰을 Authorization header에 추가
      data: req.body,
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
