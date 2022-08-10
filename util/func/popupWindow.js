

const popupWindow = (href, options={width:null, height:null}) => {
  if (typeof window === "undefined") return;
  window.open(
    href,
    "_blank",
    `toolbar=no,
    location=no,
    width=${options.width || 1000},
    height=${options.height || 450},
    left=${options.left || 150},
    top=${options.top || 250},
    status=no,
    menubar=no,
    scrollbars=yes,
    resizable=yes`
  );
  return false;
};


export default popupWindow;