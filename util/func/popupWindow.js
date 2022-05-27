

const popupWindow = (href, options={width:1000, height:400}) => {
  if (typeof window === "undefined") return;
  window.open(
    href,
    "popupWindow",
    `toolbar=no,
    location=no,
    width=${options.width},
    height=${options.height},
    left=150,
    top=250,
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes`
  );
  return false;
};


export default popupWindow;