export class BlockScroll {
  // left: 37, up: 38, right: 39, down: 40,
  // spacebar: 32, pageup: 33, pagedown: 34, end: 35, home: 36
  constructor(props) {
    this.wheelOpt = { passive: false };
    this.wheelEvent = 'onwheel' in document.createElement('div') ? 'wheel' : 'mousewheel';
  }

  // call this to Disable
  disableScroll() {
    window.addEventListener('DOMMouseScroll', preventDefault, false); // older FF
    window.addEventListener(this.wheelEvent, preventDefault, this.wheelOpt); // modern desktop
    window.addEventListener('touchmove', preventDefault, this.wheelOpt); // mobile
    window.addEventListener('keydown', preventDefaultForScrollKeys, false);
  }

  // call this to Enable
  enableScroll() {
    window.removeEventListener('DOMMouseScroll', preventDefault, false);
    window.removeEventListener(this.wheelEvent, preventDefault, this.wheelOpt);
    window.removeEventListener('touchmove', preventDefault, this.wheelOpt);
    window.removeEventListener('keydown', preventDefaultForScrollKeys, false);
  }
}

function preventDefault(e) {
  e.preventDefault();
}

function preventDefaultForScrollKeys(e) {
  const keys = { 37: 1, 38: 1, 39: 1, 40: 1, 33: 1, 34: 1, 35: 1, 36: 1 };
  if (keys[e.keyCode]) {
    preventDefault(e);
    return false;
  }
}
