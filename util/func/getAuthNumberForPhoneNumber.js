import axios from "axios";


const getAuthNumberForPhoneNumber = async (phoneNumber) => {
  if(!phoneNumber) return;
  let authNumber;

  const API_URL = '/api/join/phoneAuth';
  const body = {
    phoneNumber: phoneNumber
  }
  const config = {
    headers: {
      'content-Type': 'application/json',
    }
  }

  try {
    authNumber = await axios
      .post(API_URL, body, config)
      .then(res=> {
        // console.log(res);
        if(res.data.responseCode !== 200) return console.error('__외부API서버 에러__');

        return res.data.authNumber;
        // return {
        //   authNumber:res.data.authNumber, // 응답코드 (200 이외의 값이면 다이렉트센드 내부 에러)
        //   responseCode : res.data.responseCode, // 다이렉트 센드 상태 코드
        //   status: res.data.status, // MEMO 다이렉트샌드 상태메시지 //
        //   msg: res.data.msg
        // };
      })
      .catch((err)=>{
        console.log(err);
        return err
      });
  } catch (err) {
    console.error(err.response);
    console.error(err.request);
  }

  return authNumber;

}


export default getAuthNumberForPhoneNumber;
