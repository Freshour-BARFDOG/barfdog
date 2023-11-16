import axios from "axios";

export const getGoodsFlowOtp = async () => {

    const otp = await axios
    .post(
      `${window.location.origin}/api/goodsFlow/getOtp`,{},

      {
        headers: {
        'Content-Type': 'application/json',}}
    )
    .then((res) => {
        console.log(
        '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
        res,
      );
      // console.log(res.data.data);
      const otpValue = res.data.data; 
      // console.log('otpValue');
      // console.log(otpValue);
      return otpValue;
    })
    .catch((err) => {
      console.error('goodsflow otp err: ', err);

      return err.response;
    });
  // console.log('*****------------------- GET GOODSFLOW DATA OTP from NextJS Server Response:', otp);
  // console.log(otp);

  return otp;

}

export const postGoodsFlowOrder = async (data)=>{ 

    const id = await axios
      .post(
        `${window.location.origin}/api/goodsFlow/orderRegister`, 
        data,
        {headers: {
          'Content-Type': 'application/json',}}
      )
      .then((res) => { 
        // console.log(res.data.id);
         console.log(
          '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
          res,
        );
        // console.log(res.data.id);

        return res;
      })
      .catch((err) => {
        console.error('goodsflow otp err: ', err);

        return err.response;
      });

    // console.log('*****------------------- GET GOODSFLOW DATA ID from NextJS Server Response:', id);
    return id;
}


export const orderPrint = async (o,i) => {

    await axios
      .post(
      `${window.location.origin}api/goodsFlow/print`,
  {
          otp:o,
          id:i
      },
      {headers: {
        'Content-Type': 'application/json',}}
      
    )
     .then((res) => {
        console.log(
         '------------------------------------------------------------------ AXIOS > RESPONSE ------------------------------------------------------------------ ',
         res,
       );
       // console.log(res.data);
       
       return res.data;
   });
   }



export const goodsFlowOrderCancel = async (transUniqueCd) => {
  const cancelRes = await axios
  .post(
    `${window.location.origin}/api/goodsFlow/cancelOrder`,
    {transUniqueCd},
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  )
  .then((res) => {
    // // console.log(res.data);
    //  console.log(
    //   '---------------------------------GoodsFlow Cancel AXIOS > RESPONSE ------------------------------------------------------------------ ',
    //   res,
    // );

    return res;
    
  })
  .catch((err) => {
    console.error('goodsflow cancel err: ', err);

    return err.response;
  });
  // console.log(`=======cancel res${cancelRes}`);
  return cancelRes;
}