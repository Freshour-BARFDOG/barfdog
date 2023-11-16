import axios from "axios";


const getAuthNumberForPhoneNumber = async (phoneNumber) => {
  if(!phoneNumber) return;
  let authNumber;
  let message;
  let error;


  const API_URL = '/api/join/phoneAuth';
  const body = {
    phoneNumber: phoneNumber
  }
  const config = {
    headers: {
      'content-Type': 'application/json',
    }
  }

  authNumber = await axios
    .post(API_URL, body, config)
    .then(res=> {
      // MEMO res.data.responseCode : 다이렉트샌드 상태메시지
      if(res.data.responseCode !== 200) return console.error('::: 외부API서버 에러');
      message = '인증번호가 발송되었습니다.'
      return res.data.authNumber;
    })
    .catch((err)=>{
      console.error(err);
      // // console.log(err.request);
      // // console.log(err.response);
      if(err.response.status === 409){
        const serverMessage = err.response.data.errors[0].defaultMessage;
        // console.error(serverMessage)
        error = '이미 등록된 휴대전화입니다.';

      } else if(err) {
        error = '서버와 통신할 수 없습니다. 관리자에게 문의하세요.'
      }
    });

  return { authNumber, message, error };

}


export default getAuthNumberForPhoneNumber;
