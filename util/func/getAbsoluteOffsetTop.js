const getAbsoluteOffsetTop = (elem) => {
  const target = elem;
  const clientRect = target.getBoundingClientRect();
  const relTop = clientRect.top;
  const scrolledTopLength = window.pageYOffset;
  const absTop = scrolledTopLength + relTop;
  return absTop;
}


export default getAbsoluteOffsetTop;