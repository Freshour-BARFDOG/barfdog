import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import ChannelTalkService from "./ChannelTalkService";



const ChannelTalkProvider = ({children}) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();

  const ADMIN_BASE_PATH_KEY = "bf-admin";
  const DISABLED_PATH = ['/popup'];
  const user = {isLoggedIn:false } // MEMO ______FOR TEST Info
  const {isLoggedIn} = user;


  useEffect(() => {
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
    if(isLoggedIn) {
      channelTalk.boot({
        pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY,
        memberId: uid,
        profile: {
          name,
          // mobileNumber,
          // email,
          // avatarUrl,
        },
      });
    } else {
      channelTalk.boot({
        pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY,
      });
    }

    return () => {
      channelTalk.shutdown();
    };

  }, [dispatch, router, user]);



  return (
    <>
      {children}
    </>
  );
};

export default ChannelTalkProvider;
