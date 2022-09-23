
// ** server side에서만 실행해야함
// ** client side에서 실행할 경우, 에러 발생
import {google} from "googleapis";


// ! 구글로그인 후,  Google에서 확인하지 않은앱 Page가 뜰 경우
//  => 구글은 https(ssl을 사용한 보안)을 쓰지않으면 확인되지 않은 앱이라고 단정을지음

export const getGoogleAuthUrl = ()=>{
  const client_id = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const client_secret = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_SECRET;
  const redirect_url = process.env.NEXT_PUBLIC_GOOGLE_OAUTH_CALLBACK_URL;
  
  // 구글 API 연동할 범위 설정 https://developers.google.com/identity/protocols/oauth2/scopes
  // scope 지정 후, 유저동의화면에서 모두 check할 경우, 사용가능
  // scope 내에 포함되지 않을 경우 > insufficient permissions ERROR발생
  const scopes = ['https://www.googleapis.com/auth/analytics.readonly'];
  const oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_url);
  const authorizationUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline', // 'online' (default) or 'offline' (gets refresh_token)
    scope: scopes,
    include_granted_scopes: true, // Enable incremental authorization. Recommended as a best practice.
  });
  return authorizationUrl;
}




