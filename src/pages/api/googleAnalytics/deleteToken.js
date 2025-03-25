const https = require('https');

export default async function getToken(req, res) {
  let data;
  const token = req.body.token;
  let postData = "token=" + token;
  // // console.log('Google OAuth 토큰삭제:', req)

  if (token) {
    // Options for POST request to Google's OAuth 2.0 server to revoke a token
    let postOptions = {
      host: 'oauth2.googleapis.com',
      port: '443',
      path: '/revoke',
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      }
    };
  
    const postReq = https.request(postOptions, function (res) {
      res.setEncoding('utf8');
      res.on('data', d => {
        // console.log('Response:::: ' + d);
      });
    });
  
    postReq.on('error', error => {
      // console.log(error)
    });
  
  
    // console.log('전송한다.')
    postReq.write(postData);
    postReq.end();
    res.status(200).end();
  } else {
    // 구글 응답 > auth 코드가 없을 경우
    data = {
      error: 'FORBIDDEN: there is no auth token'
    }
    res.status(403).end(JSON.stringify(data));
  }
}
