// wheel EVENT
export default function animateWindow(targetSectionOffsetTop, delay, easing = 'easeInOutQuint') {
  let timer;

  // Debouncing
  if (timer) {
    clearTimeout(timer);
  }

  timer = setTimeout(function () {
    const defaultSpeed = 1200;
    scrollToY(targetSectionOffsetTop, { speed: defaultSpeed, easing });
  }, delay);
} //moveWindow

// main function
const scrollToY = (scrollTargetY, option = { speed, easing }) => {
  // scrollTargetY: the target scrollY property of the window
  // speed: time in pixels per second
  // easing: easing equation to use
  // FX  -  EASING
  window.requestAnimFrame = (() => {
    return (
      window.requestAnimationFrame ||
      window.webkitRequestAnimationFrame ||
      window.mozRequestAnimationFrame ||
      function (callback) {
        window.setTimeout(callback, 1000 / 60, easing);
      }
    );
  })(); //

  let scrollY = window.scrollY,
    targetY = scrollTargetY || 0,
    speed = option.speed || 3000,
    easing = option.easing || 'easeOutSine',
    currentTime = 0;

  // min time .1, max time .8 seconds
  const time = Math.max(0.1, Math.min(Math.abs(scrollY - targetY) / speed, 0.8));

  // easing equations from https://github.com/danro/easing-js/blob/master/easing.js
  const PI_D2 = Math.PI / 2,
    easingEquations = {
      easeOutSine: function (pos) {
        return Math.sin(pos * (Math.PI / 2));
      },
      easeInOutSine: function (pos) {
        return -0.5 * (Math.cos(Math.PI * pos) - 1);
      },
      easeInOutQuint: function (pos) {
        if ((pos /= 0.5) < 1) {
          return 0.5 * Math.pow(pos, 5);
        }
        return 0.5 * (Math.pow(pos - 2, 5) + 2);
      },
    };

  // add animation loop
  const tick = () => {
    currentTime += 1 / 60;

    const p = currentTime / time;
    const t = easingEquations[easing](p);

    if (p < 1) {
      requestAnimFrame(tick);
      // console.log('scrolling')

      window.scrollTo(0, scrollY + (targetY - scrollY) * t);
    } else {
      window.scrollTo(0, targetY);
      // console.log('scroll done');
    }
  };

  // call it once to get started
  tick();


}; // scrollToY
