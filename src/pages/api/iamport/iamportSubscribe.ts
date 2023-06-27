import {axiosOfIamport} from "./axiosOfIamport";
import {axiosOfLocalServer} from "../axios/axiosOfLocalServer";
import {IamportTokenResponseInterface} from "@src/pages/api/iamport/getAccessToken";

export default async function POST(req, res) {
  console.log("--req body", req.body);

  try {

    const tokenRes = await axiosOfLocalServer(`/api/iamport/getAccessToken`);
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
      .then((res) => {
        console.log(
          '---------------------------- AXIOS > RESPONSE ----------------------------',
          res,
        );
        return res.data;
      })
      .catch((err) => {
        console.error('iamport subscribe err: ', err);

        return err.response;
      });
    console.log('---------- AXIOS > RESPONSE: ', DATA);
    console.log('---------- AXIOS > RESPONSE: ', JSON.stringify(DATA));
    // res.json(DATA);

    const defaultCorsHeader = {
      "Access-Control-Allow-Origin": "*", // 다 받거나, 하나만 받거나만 가능
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": 10,
      "Accept": 'application/json',
      "Content-Type": "application/json"
    };

    const body = {
      appVersion: DATA.appVersion,
      id: DATA.id,
      data: DATA.data,
      success: DATA.success,
    }
    console.log('BODY: ', body);


    res.writeHead(200, defaultCorsHeader);
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};
