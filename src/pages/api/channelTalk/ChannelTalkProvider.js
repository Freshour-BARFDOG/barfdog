import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import ChannelTalkService from "./ChannelTalkService";
import axios from 'axios';


const ChannelTalkProvider = ({children}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector(s=>s.auth);
  const userInfo = auth.userInfo;
  const isLoggedIn = userInfo?.email;
  
  
  
  
  useEffect(() => {
    const ADMIN_BASE_PATH_KEY = "bf-admin";
    const DISABLED_PATH = ['/popup'];
    const isAdminPath = router.asPath.split("/")[1] === ADMIN_BASE_PATH_KEY;
    let isDisabledPath;
    DISABLED_PATH.map(path=>{
      if(router.asPath.indexOf(path) >= 0 ) return isDisabledPath = true;
      // isDisabledPath = router.asPath.indexOf(path) >= 0 ;
    })

    // MEMO ChannelTalk: 사용자 Path에 설치  (Admin페이지: 적용 안 함)
    if (isAdminPath || isDisabledPath) return;
    const channelTalk = new ChannelTalkService();
  
    // TODO 유저로그인 기능 추가 후 , ChannelTalk 유저정보 연동기능 (채널톡에 유저정보를 넘겨준다)
    if(false) {
      channelTalk.boot({
        pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY,
        memberId: '',
        profile: {
          name: userInfo.name,
          mobileNumber: userInfo.phoneNumber,
          email: userInfo.email,
          // avatarUrl,
        },
      });
    } else {
      channelTalk.boot({
        pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY,
        customLauncherSelector: ".ch-open-button, .ch-open",
        // customLauncherSelector: ".ch-open",
      });
    }

    return () => {
      channelTalk.shutdown();
    };

  }, [dispatch, router, userInfo]);



  return (
    <>
      {children}
    </>
  );
};

export default ChannelTalkProvider;




const getApiData = async (userId) => {
  const apiUrl = `https://api.channel.io/open/v5/users/${userId}/user-chats?sortOrder=desc&limit=25`
  const accessKey = '621f1bbdc6f9d0337bcc';
  const accessSecretKey = '6ef92b0a1c50f27ee7008255e5b23685';
  const config = {
    headers:{
      'Content-Type': 'application/json',
      'x-access-key': accessKey,
      'x-access-secret': accessSecretKey
    }
  }
  const res = await axios.get(apiUrl,config);
  console.log(res);
}