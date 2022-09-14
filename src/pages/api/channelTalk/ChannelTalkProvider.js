import { useRouter } from 'next/router';
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ChannelTalkService from './ChannelTalkService';
import axios from 'axios';

const ChannelTalkProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s) => s.auth);
  const userInfo = auth.userInfo;
  console.log(userInfo)

  const callback = (err, user) => {
    console.log(err, user);
  };
  useEffect(() => {
    const ADMIN_BASE_PATH_KEY = 'bf-admin';
    const DISABLED_PATH = ['/popup'];
    const isAdminPath = router.asPath.split('/')[1] === ADMIN_BASE_PATH_KEY;
    let isDisabledPath;
    DISABLED_PATH.map((path) => {
      if (router.asPath.indexOf(path) >= 0) return (isDisabledPath = true);
      // isDisabledPath = router.asPath.indexOf(path) >= 0 ;
    });

    // MEMO ChannelTalk: 사용자 Path에 설치  (Admin페이지: 적용 안 함)
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
      // language: 'en',
      // unsubscribed: false,
      // hidePopup: false,
      // hideChannelButtonOnBoot: true,
      // trackDefaultEvent: false,
      // trackUtmSource: false,
      // openChatDirectlyAsPossible: true,
      // mobileMessengerMode: 'newTab',
      // zIndex: 1,
    };

    ch.boot(settings, callback);

    console.log(ch);
    ch.track('traceForm', { userName: 'test' });

    return () => {
      console.log('셧다운');
      ch.shutdown();
    };
  }, [dispatch, router, userInfo]);

  return <>{children}</>;
};

export default ChannelTalkProvider;
