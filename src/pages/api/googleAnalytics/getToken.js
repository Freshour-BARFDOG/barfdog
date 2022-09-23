import axios from 'axios';

export default async function getToken(req, res) {
  let data;
  const code = req.query.code;
  const access_denied = req.query.error;

  if (code) {
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CALLBACK_URL;
    const grant_type = 'authorization_code';
    const token = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v4/token',
      params: {
        client_id,
        client_secret,
        redirect_uri,
        grant_type,
        code: code
      },
    }).then(res => {
      const token = res.data.access_token;
      return token;
    }).catch(err => console.log(err));
    
    // console.log('googleAuthtoken', token);

    res.redirect(`/bf-admin/dashboard?token=${token}`);
  } else if (access_denied) {
  
    data = {
      error: 'access_denied'
    }
    res.writeHead(403, { Location: '/bf-admin/login' });
    res.status(403).end(JSON.stringify(data));
  } else {
    // 구글 응답 > auth 코드가 없을 경우
    data = {
      error: 'there is no auth code'
    }
    res.writeHead(500, { Location: '/bf-admin/login' });
    res.status(500).end(JSON.stringify(data));
  }
}
