// 디바이스 체크 - Mobile / Web

const isMobileDevice = (function () {
  const filter = "win16|win32|win64|mac|macintel";

  // console.log(navigator.platform);
  // console.log(navigator.maxTouchPoints);
  // alert(navigator.maxTouchPoints)
  // alert(navigator.platform)

  
  if (window && window.innerWidth < 600) {
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
})();


export default isMobileDevice;
