
type HTMLElemClientRect = {} | {
  height: number,
  width: number,
  left: number,
  right: number,
  top: number,
  bottom: number,
  x: number,
  y: number,
}
export const getHTMLElementInfo = (elem): null | HTMLElemClientRect => {
    if (!elem) return;
    let info:HTMLElemClientRect = {};
    const rect = elem.getBoundingClientRect();
    for (let key in rect) {
        if (typeof rect[key] !== 'function') {
            info[key] = rect[key]
        }
    }
    return info
};
