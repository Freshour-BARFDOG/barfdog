import React, {useEffect, useState} from 'react';

export default function useDeviceState() {

  const initialStateForCheckingDevice = null;

  const [isMobile, setIsMobile] = useState(initialStateForCheckingDevice);
  const [deviceWidth, setDeviceWidth] = useState(null);

  useEffect(() => {

    if(window && typeof window !=='undefined'){
      const windowWidth = window.innerWidth;
      const mobileState = windowWidth <= 600;
      setIsMobile(mobileState);
      setDeviceWidth(windowWidth);
      window.addEventListener('resize', ()=>{
        const windowWidth = window.innerWidth;
        setDeviceWidth(windowWidth);
      })
    }
  }, [deviceWidth]);

  return { isMobile, deviceWidth };
};