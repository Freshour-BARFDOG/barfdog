import axios from "axios";

const Test = (req, res) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
    post: {
      "Content-Type": "application/json",
    },
    data: "data",
    dataType: "json",
    encType: "multipart/form-data", //파일전송 시 필수
    processData: false,
  };

  const data = {
    email: "admin@gmail.com",
    password: "admin",
  };



  let token;
  axios
    .post("/api/login", JSON.stringify(data), {
      headers,
    })
    .then((res) => {
      console.log(res);
      token = res.headers.authorization;
      console.log("token : ", token);
    })
    .catch((err) => {
      console.log(err);
    });
  
  return token;
};


export default Test;
