import axios from 'axios';

export default async function handler(req, res){
  console.log(req.method);

  if(req.method != 'POST'){
    res.status(401).end();
  }
  console.log(req);
  console.log(req.body);

  try {
    
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const getToken = await axios({
        url: "https://api.iamport.kr/users/getToken",
        method: "post", // POST method
        headers: { "Content-Type": "application/json" }, // "Content-Type": "application/json"
        data: {
          imp_key: "8722322371707106", // REST API 키
          imp_secret: "eb961888a719002923f107e1024bb45d177b8d92279ad7843a35be08c107c4ab01033597b2c21968" // REST API Secret
        }
      });
      
      const { access_token } = getToken.data.response;

      
    const DATA = await axios({
        url: `https://api.iamport.kr/subscribe/payments/again`,
        method: "post",
        headers: { "Authorization": access_token }, // 인증 토큰을 Authorization header에 추가
        data: req.body,
        // data: {
        //   customer_uid: req.body.customer_uid,
        //   merchant_uid: req.bodymerchantUid, // 새로 생성한 결제(재결제)용 주문 번호
        //   amount: req.body.paymentPrice,
        //   name: req.body.name
        // }
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