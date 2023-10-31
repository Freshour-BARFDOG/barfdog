import axios from 'axios';

/* - /src/pages/api/:path* 에서 작성한 코드는
    nextjs에서 serverSide 코드로 작동한다..
* */
// 운송장 재출력하기위해 굿스플로에 등록한 주문 취소 
// 출력 된 주문자료를 재출력 하기 위해 주문 취소한다.
// (주문등록 후 출력되지 않은 건은 다시 주문 등록하여 출력한다.)
// 주문취소 처리된 {transUniqueCd}(배송고유번호)로 운송장출력이 가능하다. 운송장출력시 중복체크 기준: {transUniqueCd}(배송고유번호)

export default async function handler(req, res){
  // console.log(req);
  // console.log(req.body);

  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'goodsFLOW-Api-Key': process.env.NEXT_PUBLIC_GOODSFLOW_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    };
    const DATA = await axios
      .post(
        `${process.env.NEXT_PUBLIC_GOODSFLOW_API_URL}orders/${req.body.transUniqueCd}/cancel`,
        {},
        options
      )
      .then((res) => {
         console.log(
          '---------------------------- AXIOS > RESPONSE ----------------------------',
          res,
        );
        return res.data;
      })
      .catch((err) => {
        console.error('goodsflow otp err: ', err);

        return err.response;
      });
    // // console.log('---------- AXIOS > RESPONSE: ', DATA);
    // // console.log('---------- AXIOS > RESPONSE: ', JSON.stringify(DATA));
   
    const defaultCorsHeader = {
      "Access-Control-Allow-Origin": "*", // 다 받거나, 하나만 받거나만 가능
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": 10,
      "Accept": 'application/json',
      "Content-Type": "application/json"
    };
    
    res.writeHead(200, defaultCorsHeader);
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};