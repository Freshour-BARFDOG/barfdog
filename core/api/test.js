import axios from "axios";

const Test = (req, res) => {

  const headers = {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
    Accept: "*/*",
    // 'Access-Control-Allow-Origin' : '*',
    // 'Access-Control-Allow-Methods':'GET,PUT,POST,DELETE,PATCH,OPTIONS',
  };
  const config = {
    headers,
  };
  const data = {
    username: "admin@gmail.com",
    password: "admin",
  };
  const URL = "http://211.219.225.118:9999/login";

  let token;
  console.log(axios.defaults.headers)
  axios.defaults.headers.post = null;
  axios
    .post(URL, data, config)
    .then((res) => {
      // console.log(res.headers);
      token = res.headers.authorization;
      console.log("token : ", token);
    })
    .catch((err) => {
      console.log(err);
    });
    

    return token;
      
};


export default Test;
