async function getOtp(){
   await axios
    .post('https://test.goodsflow.com/delivery/api/v2/otps/partner/BARFDOG/',  {
      headers: {
        'content-Type': 'application/json',
        'goodsFLOW-Api-Key':'c52a4671-40e2-409e-90c0-07759066145e'
      }
    })
    .then((res) => { 
        console.log(res);
    })
    .catch((err) => {  
      console.error('goodsflow otp err: ',err);
      // console.log(err.request)
      // console.log(err.response)
    });
}