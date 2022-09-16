import axios from 'axios';
import { cookieType } from '/store/TYPE/cookieType';
import { getDataSSR } from './reqData';

export default async function GetSelfCookie(req, res) {
  // console.log('----------->>>', req);


  const prod = process.env.NODE_ENV === 'production';
  axios.defaults.baseURL = prod ? process.env.NEXT_PUBLIC_API_URL_PRODUCT : 'http://localhost:4000';
  await axios({ method: 'post', url: '/api/getSelfCookie' })
    .then((response) => {
      console.log('----response: ', response);
    })
    .catch((err) => {
      console.log('----err: ', err);
    });

  res.end(JSON.stringify({ data:null }));
}
