import axios from 'axios';
const { validateHeaderName } = require('http');

/* - /src/pages/api/:path* 에서 작성한 코드는
    nextjs에서 serverSide 코드로 작동한다..
* */

const GoodsFlowPrint = async (req, res,) => {
  
  console.log(req.body);
  try {
    const options = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'goodsFLOW-Api-Key': process.env.NEXT_PUBLIC_GOODSFLOW_API_KEY,
        'Access-Control-Allow-Origin': '*',
      },
    };
    
    const qs = require('qs');
    
    const DATA = await axios
      .post(
      `${process.env.NEXT_PUBLIC_GOODSFLOW_PRINT_URL}dlvmgr.aspx`,
        qs.stringify({
          'OTP':req.body.otp,
          'responseURL':'https://barfdog.vercel.app/api/goodsFlow/postTraceResult',
          'id':req.body.id
        }),
        
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
    console.log('---------- AXIOS > RESPONSE: ', DATA);
  
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
  }
};

export default GoodsFlowPrint;
