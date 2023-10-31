import React from 'react';
import axios from 'axios';
const { validateHeaderName } = require('http');

/* - /src/pages/api/:path* 에서 작성한 코드는
    nextjs에서 serverSide 코드로 작동한다..
* */

const GoodsFlowTest = async (req, res) => {
  axios.defaults.baseURL = 'https://test.goodsflow.com/';
  //// 'https://test.goodsflow.com/delivery/api/v2/otps/partner/BARFDOG',

  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'goodsFLOW-Api-Key': 'c52a4671-40e2-409e-90c0-07759066145e',
        'Access-Control-Allow-Origin': '*',
      },
    };
    const DATA = await axios
      .post(
        'https://test.goodsflow.com/delivery/api/v2/otps/partner/BARFDOG',
        {body:{
          test:'hello world!'
          }},
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
    // console.log('---------- AXIOS > RESPONSE: ', DATA);
    // console.log('---------- AXIOS > RESPONSE: ', JSON.stringify(DATA));
   
    const defaultCorsHeader = {
      "Access-Control-Allow-Origin": "*", // 다 받거나, 하나만 받거나만 가능
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Accept",
      "Access-Control-Max-Age": 10,
      "Accept": 'application/json',
      "Content-Type": "application/json"
    };
    //
    // const body = {
    //   appVersion: DATA.appVersion,
    //   id: DATA.id,
    //   data: DATA.data,
    //   success: DATA.success,
    // }
    // // console.log('BODY: ', body);
    
    
    res.writeHead(200, defaultCorsHeader);
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())

  } catch (err) {
    console.error(err);
    res.json(err);
    res.status(405).end();
  }
};

export default GoodsFlowTest;
