import {axiosIamport} from "@src/pages/api/axios/axiosIamport";
import {AxiosInstance} from "axios";
import {axiosBaseURLBySSR} from "@src/pages/api/axios/axiosBaseURLBySSR";
import {NextApiRequest, NextApiResponse} from "next";
import {IamportTokenResponseInterface} from "./getAccessToken";
import {IamportExtraRequester} from "../../../../type/naverpay/IamportExtraRequester";

export interface DeleteCustomerBillingKeyAsUnsubscribeNaverpayRequest extends DeleteBillingKeyParamInterface{
  customerUid: string;
}

export default async function DELETE(req: NextApiRequest, res: NextApiResponse) {

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

    const body: DeleteCustomerBillingKeyAsUnsubscribeNaverpayRequest = req.body;
    const {customerUid, reason, requester } = body;
    if (!customerUid) {
      res.writeHead(400, "CustomerUid must be provided");
      return res.status(400).end();
    } else if (!requester) {
      res.writeHead(400, "requester must be provided");
      return res.status(400).end();
    } else if (!reason) {
      res.writeHead(400, "Delete reason must be provided");
      return res.status(400).end();
    }


    const paramMap = {
      reason: reason,
      requester: requester
    }
    const url = `/subscribe/customers/${customerUid}`;
    const encodedUrl:string = getDeleteBillingkeyEncodedURI(url, paramMap);
    // console.log("------ encodedUrl = ",encodedUrl);
    const DATA = await axiosIamport({
      url: encodedUrl,
      method: "DELETE",
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



interface DeleteBillingKeyParamInterface {
  reason: string; // 삭제 사유
  requester: IamportExtraRequester // 삭제 요청자
}

const getDeleteBillingkeyEncodedURI = (url:string, params:DeleteBillingKeyParamInterface):string => {
  if(!url || typeof params !== "object") throw new Error("There are no URLs or parameters to encode the URL.");

  const paramMap = new Map<string, string>();
  const queryPrefix = "?";
  const delimiter = "&";
  const separator = "=";

  paramMap.set("reason", params.reason);
  paramMap.set("extra[requester]", params.requester);

  const paramArr: [string, string][] = Array.from(paramMap.entries());
  const param:string = paramArr.map(curParam => {
    const [key, val] = curParam;
    return `${key}${separator}${val}`;
  }).join(delimiter);

  return encodeURI(url + queryPrefix + param)

};
