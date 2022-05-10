let t;

const timer = (time, callbackArray, callbackTimerRunning) => {
  t = setTimeout(() => {
    let currentTime = time;
    currentTime--;
    callbackArray.forEach((cb) => {
      cb(currentTime);
    });
    if (currentTime === 0) {
      clearTimeout(t);
      callbackTimerRunning(false);
      // console.log("타이머 종료");
    }
  }, 1000);
};

export default timer;