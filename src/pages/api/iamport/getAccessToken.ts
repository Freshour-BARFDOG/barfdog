import {axiosIamport} from "@src/pages/api/axios/axiosIamport";
import {AxiosResponse} from "axios";

export interface IamportTokenResponseInterface {
  access_token: string;
  expired_at: number;
}

export default async function POST(req:Request, res:any | Response) {

  const tokenRes:AxiosResponse = await axiosIamport.post('/users/getToken', {
    imp_key: `${process.env.NEXT_PUBLIC_IAMPORT_REST_API_KEY}`,
    imp_secret: `${process.env.NEXT_PUBLIC_IAMPORT_REST_API_SECRET}`
  });
  const {access_token, expired_at} = tokenRes.data.response;
  const body: IamportTokenResponseInterface = {
    access_token, expired_at
  }

  // console.log("----- getAccessToken > access_token = ",access_token);
  if (!access_token) {
    return res.status(500).json({
      message: "Failed to get Iamport access token."
    });
  }

  return res.status(200).json(body);
}
