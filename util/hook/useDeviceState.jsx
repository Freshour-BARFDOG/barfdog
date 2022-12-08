import React, {useEffect, useState} from 'react';

export default function useDeviceState () {
  
  
  const [isMobileWidth, setIsMobileWidth] = useState( null );
  const [mobileDevice, setMobileDevice] = useState( null );
  const [deviceWidth, setDeviceWidth] = useState( null );
  
  useEffect( () => {
    if ( window && typeof window !== 'undefined' ) {
      
      // # check by window width
      const windowWidth = window.innerWidth;
      const mobileWidth = windowWidth <= 600;
      setIsMobileWidth( mobileWidth );
      setDeviceWidth( windowWidth );
      
      // console.log(window.navigator.userAgent)
      // # check by Device Info.
      const mobileDevice = /iPhone|iPad|iPod|Android/i.test( navigator.userAgent );
      setMobileDevice( mobileDevice )
      window.addEventListener( 'load', () => {
        const windowWidth = window.innerWidth;
        setDeviceWidth( windowWidth );
      } )
      window.addEventListener( 'resize', () => {
        const windowWidth = window.innerWidth;
        setDeviceWidth( windowWidth );
      } )
    }
  }, [deviceWidth] );
  
  return {isMobile: isMobileWidth, deviceWidth, mobileDevice};
};