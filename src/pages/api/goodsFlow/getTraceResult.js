import axios from 'axios';

export default async function handler(req, res){

    console.log('trace result');
    console.log(req.body);
    // console.log(JSON.stringify(req.body));

  try {
    const qs = require('qs');

    const DATA = await axios
    .get(
      `${process.env.NEXT_PUBLIC_GOODSFLOW_API_URL}orders/traceresults/`,
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Accept': 'application/json',
            'goodsFLOW-Api-Key': process.env.NEXT_PUBLIC_GOODSFLOW_API_KEY,
            'Access-Control-Allow-Origin': '*',
          },
        data:{},
        },
      )
      .then((res) => {
        console.log(
          '---------------------------- AXIOS > RESPONSE ----------------------------',
          res,
        );
        return res.data;
      })
      .catch((err) => {
        console.error('goodsflow getTraceResult err: ', err);

        return err.response;
      });
    console.log('---------- AXIOS > RESPONSE: ', DATA);
    console.log('---------- AXIOS > RESPONSE: ', JSON.stringify(DATA));
   
    const defaultCorsHeader = {
      "Access-Control-Allow-Origin": "*", // 다 받거나, 하나만 받거나만 가능
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": 10,
      "Accept": 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    
    res.writeHead(200, defaultCorsHeader);
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};