import axios from 'axios';

export default async function getGoogleOauthToken(req, res) {
  let errMessage;
  const code = req.query.code;
  const access_denied = req.query.error;

  if (code) {
    // https://datatracker.ietf.org/doc/html/draft-ietf-oauth-v2-22#section-4.2.2
    // 4.1.3 Access Token Request
    const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
    const redirect_uri = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CALLBACK_URL;
    const grant_type = 'authorization_code'; // REQUIRED.  Value MUST be set to "authorization_code".
    console.log(redirect_uri)
    const data = await axios({
      method: 'POST',
      url: 'https://www.googleapis.com/oauth2/v4/token',
      params: {
        client_id,
        client_secret,
        redirect_uri,
        grant_type,
        code: code
      },
    }).then(googleResonse => {
      console.log('googleResonse: ', googleResonse);
      const token = googleResonse.data.access_token;
      const expires_in = googleResonse.data.expires_in;
      res.redirect(`/bf-admin/dashboard?token=${token}&expires_in=${expires_in}`);
    }).catch(err => {
      console.log(err);
      if(err.status === 400){
        res.redirect(`/bf-admin/dashboard`);
      }
    });
    


   
  } else if (access_denied) {
  
    errMessage = {
      error: 'access_denied'
    }
    res.writeHead(403, { Location: '/bf-admin/login' });
    res.status(403).end(JSON.stringify(errMessage));
  } else {
    // 구글 응답 > auth 코드가 없을 경우
    errMessage = {
      error: 'there is no auth code'
    }
    res.writeHead(500, { Location: '/bf-admin/login' });
    res.status(500).end(JSON.stringify(errMessage));
  }
}
