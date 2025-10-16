import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChannelTalkService from './ChannelTalkService';
import axios from 'axios';

export default function ChannelTalkProvider ({ children }) {

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;
  
  // // console.log(userInfo);

  
  useEffect(() => {
    const ADMIN_BASE_PATH_KEY = 'bf-admin';
    const DISABLED_PATH = ['/popup', '/ai-obesity-analysis'];
    const isAdminPath = router.asPath.split('/')[1] === ADMIN_BASE_PATH_KEY;
    let isDisabledPath;
    DISABLED_PATH.map((path) => {
      if (router.asPath.indexOf(path) >= 0) return (isDisabledPath = true);
      // isDisabledPath = router.asPath.indexOf(path) >= 0 ;
    });

    // - ChannelTalk: 사용자 Path에 설치  (Admin페이지: 적용 안 함)
    if (isAdminPath || isDisabledPath) return;
    const ch = new ChannelTalkService();

    const settings = {
      pluginKey: process.env.NEXT_PUBLIC_CHANNEL_IO_KEY,
      customLauncherSelector: '.ch-open-button, .ch-open',
      profile: {
        name: userInfo?.name || null,
        mobileNumber: userInfo?.phoneNumber || null,
        email: userInfo?.email || null,
      },
      memberId: !!userInfo ? `bf-${userInfo.memberId}` : null,
      member: !!userInfo,
    };
    
    // 채널톡 Booting
    ch.boot(settings, channelTalkBootCallback);

    return () => {
      ch.shutdown();
    };
  }, [dispatch, router, userInfo]);

  return <>{children}</>;
};



const channelTalkBootCallback = (err, user) => {
  // // console.log(err, user);
};