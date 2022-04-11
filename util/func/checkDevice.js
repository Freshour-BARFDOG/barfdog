// 디바이스 체크 - Mobile / Web

const IsMobileDevice = () => {
  const filter = "win16|win32|win64|mac|macintel";

  if (window.innerWidth < 600) {
    // alert('Width < 600');
    return true;
  } else if (navigator.maxTouchPoints >= 5) {
    // alert('iPad');
    return true;
  } else if (filter.indexOf(navigator.platform.toLowerCase()) < 0) {
    // alert('Mobile');
    return true;
  } else {
    // alert('PC');
    return false;
  }
};


export default IsMobileDevice;
