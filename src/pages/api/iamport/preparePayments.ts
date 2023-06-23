import {axiosOfLocalServer} from "@src/pages/api/axios/axiosOfLocalServer";
import {axiosOfIamport, IamportAxiosConfig} from "@src/pages/api/iamport/axiosOfIamport";
import {IamportTokenResponseInterface} from "@src/pages/api/iamport/getAccessToken";


interface IamportPrepareRequestInterface {
  merchant_uid: string; // merchant_uid
  amount: number; // 결제금액
}


interface IamportPrepareResponseInterface {
  code: number;
  message: string | null;
  response: {
    merchant_uid: string;
    amount: number;
  }
}

// 아임포트 결제정보 사전 등록 => 결제 위변조 방지
export default async function POST(req: Request, res: Response) {


  const {merchant_uid, amount}:IamportPrepareRequestInterface = req.body;
  if (!merchant_uid || !amount) {
    res.status(400).json({
      status: 400,
      statusText: "Invalid Parameters",
      message: "Not Blank of All parameters"
    });
  }
  // console.log("----- Iamport prepare payment = ", merchant_uid, amount);

  const tokenRes = await axiosOfLocalServer(`/api/iamport/getAccessToken`);
  if (tokenRes.status !== 200) {
    res.status(tokenRes.status).json({
      status: tokenRes.status,
      statusText: tokenRes.statusText,
      message: "Failed to get access token"
    });
  }

  const {access_token}: IamportTokenResponseInterface = tokenRes.data;
  // console.log("----- access_token: ", access_token, expired_at);

  const reqData: IamportPrepareRequestInterface = {
    merchant_uid: merchant_uid,
    amount: amount,
  }


  try {
    // insert async & await code
    const prepareRes = await axiosOfIamport.post('/payments/prepare', reqData, IamportAxiosConfig(access_token))
    const {response}: IamportPrepareResponseInterface = prepareRes.data;
    const {merchant_uid:registeredMerchantUid, amount:registeredAmount} = response;
    // console.log("----- prepareRes = ", merchant_uid, amount);
    console.log(prepareRes);
    return res.status(prepareRes.status).json({
      data:{
        merchant_uid:registeredMerchantUid,
        amount:registeredAmount,
      },
      iamportData: prepareRes.data,
    });

  } catch (err) {
      console.error(err.response);
      const errRes = err.response;
      return res.status(errRes.status).json({
        status: errRes.status,
        statusText: errRes.statusText,
        data: errRes.data,
        message: "Failed to prepare payment"
      });
  }

}
