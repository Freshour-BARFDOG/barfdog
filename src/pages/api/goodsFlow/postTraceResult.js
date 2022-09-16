import axios from 'axios';
import { postDataSSR, postData } from '/src/pages/api/reqData';


export default async function handler(req, res){

console.log('-----------------',req)
  if(req.method != 'POST'){
    res.status(401).end();
  }
//   console.log(req);
//   console.log(req.body);
// console.log(req.body.data);
// console.log(req.body.data.items);

  try {
    let data = {};
    // console.log(req);
    if(req.body!=null){
      data = {
        success:true,
        message:''
      }

      const items = req.body.data.items;
      const itemFilter = items.map( i => {
        return { transUniqueCd : i.transUniqueCd , deliveryNumber : i.sheetNo}
      });
      
      const body = {
        deliveryNumberDtoList: itemFilter
      };
      
      console.log(body);
      // TODO 서버에 운송장 전송 코드 수정하기
      
    // const token = await axios
    // .post(`/api/getSelfCookie`,)
    // .then((res) => {
    //   console.log(
    //     '---------------------------- AXIOS > RESPONSE ----------------------------',
    //     res,
    //   );
    //   return res.data;
    // })
    // .catch((err) => {
    //   return err.response;
    // });
    //   console.log(token);

    //   const registerDeliveryNumberApiUrl = `https://barfdogserver.co.kr/api/admin/deliveries/deliveryNumber`;

    //   const r = await postDataSSR(req, registerDeliveryNumberApiUrl, body, token);
    //   // console.log('server RESPONSE:\n', r);      

    //   if(r!=null){
    //   // console.log('server RESPONSE:\n', r);      
    //   return;

    //   }else{
    //     return;
    //   }

    }else{
      data = {
        success:false,
        message:'서버 에러'
      }
    }
    console.log(data);
    res.end(JSON.stringify(data));
  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};