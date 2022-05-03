import axios from "axios";

const getAdminToken = async (req, res) => {
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

  const adminAccount = {
    email: "admin@gmail.com",
    password: "admin",
  };



  let token = await axios
    .post("/api/login", JSON.stringify(adminAccount), {
      headers,
    })
    .then((res) => {
      // console.log(res);
      // console.log("token : ", res.headers.authorization);
      return token = res.headers.authorization;
    })
    .catch((err) => {
      console.log(err);
      return null;
    });


    return token;
};


export default getAdminToken;
