import React from 'react';
import GoodsFlowTest from '../api/goodsFlow';
import MetaTitle from '../../components/atoms/MetaTitle';
import axios from 'axios';

export default function Goodsflow() {
  const onClickHandler = async () => {
    // 1. client페이지에서 -> localhost의 api path로 호출을 보낸다
    // 2. nextjs api path에서는 server 에서 request하는 코드를 작성한다
    //   => server side에서 external api 요청은 CORS를 피할 수 있다.

    axios.defaults.baseURL = 'http://localhost:4000/';
    const res = await axios
      .post(
        '/api/goodsFlow',
        // 'https://test.goodsflow.com/delivery/api/v2/otps/partner/BARFDOG',
        {
          param: 'hello world!',
        },
        {
          headers: {
            'goodsFLOW-Api-Key': 'c52a4671-40e2-409e-90c0-07759066145e',
            'Access-Control-Allow-Origin': '*',
          },
        },
      )
      .then((res) => {
        console.log(
          '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
          res,
        );
        return res;
      })
      .catch((err) => {
        console.error('goodsflow otp err: ', err);

        return err.response;
      });

    console.log('*****------------------- GET GOODSFLOW DATA from NextJS Server Response:', res);
  };
  return (
    <>
      <MetaTitle title="TEST | GoodsFlow API" />
      <div>
        <h1>GoodsFlowTest</h1>
        <button type={'button'} className={'admin_btn solid basic_l'} onClick={onClickHandler}>
          API요청 버튼
        </button>
      </div>
    </>
  );
}

//
//
// Goodsflow.getInitialProps = async () => {
//   const res = await GoodsFlowTest();
//   console.log('------------------------------------------------------------------ ServerSide Request ------------------------------------------------------------------ ', res);
//   return { props: { id: 'dummyDataForTesting' } };
// };
