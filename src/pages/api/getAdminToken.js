import axios from "axios";


const getAdminToken = async (payload, callback) => {
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Expose-Headers": "*",
    post: {
      "Content-Type": "application/json",
    },
    data: "data",
    dataType: "json",
    // encType: "multipart/form-data", //파일전송 시 필수
    processData: false,
  };
  
  const adminAccount = {
    email: payload.email,
    password: payload.password,
  };

  let token;
  await axios
    .post("/api/login", JSON.stringify(adminAccount), {
      headers,
    })
    .then((res) => {
      // console.log(res);
      if (callback && typeof callback === 'function ') callback(res);
      return (token = res.headers.authorization);
    })
    .catch((err) => {
      // console.log(err);
      if (callback && typeof callback === "function" ) callback(err);
      
      return null;
    });

  return token;
};


export default getAdminToken;
