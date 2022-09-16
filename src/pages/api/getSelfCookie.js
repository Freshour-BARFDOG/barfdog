import axios from 'axios';
import {cookieType} from "/store/TYPE/cookieType";
const qs = require('qs');

export default async function GetSelfCookie (req, res) {
  // console.log('----------->>>', req);
  let token;
  const cookie = req.headers.cookie.split(';');
  const tokenKey = cookieType.LOGIN_COOKIE;
  if (cookie) {
    for (const key of cookie) {
      if (key.indexOf(tokenKey) >= 0) {
        token = key.split('=')[1];
        break;
      }
    }
  }
  try {
    const options = {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'x-access-key': process.env.NEXT_PUBLIC_CHANNEL_ACCESS_KEY,
        'x-access-secret': process.env.NEXT_PUBLIC_CHANNEL_ACCESS_SECRET,
      },
    };
    const DATA = {
      token
    }
    console.log('---------- RESPONSE: ', DATA);
    
    res.end(JSON.stringify(DATA)); // res body > JS obj를 JSON문자열로 전달해야함. (JSON.stringify())
  } catch (err) {
    console.error(err);
  }
}

